---
title: "在 AMD RX 6700 XT 上用 ROCm 搭建 ComfyUI"
description: "在 Arch 系 Linux 上用 Miniconda + ROCm 版 PyTorch 部署 ComfyUI 的完整记录：HSA 架构覆盖、镜像加速、性能对比与踩坑"
category: "计算机科学"
tags:
  - AI
  - ComfyUI
  - ROCm
  - PyTorch
  - Linux
  - 环境搭建
date: "2026-09-19"
updated: "2026-09-19"
featured: false
---

# 在 AMD RX 6700 XT 上用 ROCm 搭建 ComfyUI

本文记录一次完整的 ComfyUI 部署过程：硬件是 AMD RX 6700 XT（RDNA2，12GB 显存）+ Ryzen 5 7600X + 14GB 内存，系统为 Arch 系 Linux（Hyprland / Wayland）。没有 NVIDIA 显卡，因此走 **ROCm** 路线，并用 Miniconda 管理独立的 Python 环境。

## 方案选型

- **PyTorch 的 pip ROCm 轮子自带完整的用户态运行时**，系统不需要安装 `/opt/rocm` 全套（内核侧的 `amdgpu` 驱动是 Linux 内核自带的），只要 `/dev/kfd` 和 `/dev/dri` 可访问即可。
- RX 6700 XT 是 `gfx1031`，不在官方支持列表里，但官方轮子里带 `gfx1030` 代码，因此设置 `HSA_OVERRIDE_GFX_VERSION=10.3.0` 让 HIP 把 `gfx1031` 当作 `gfx1030` 运行即可，这是社区通用做法。
- 版本选择：
  - `torch 2.7.1 + rocm6.3`（经典稳定组合，轮子约 4.5GB）
  - `torch 2.14.0 + rocm7.2`（新组合，轮子约 5.8GB，实测可行且采样更快）

## 安装 Miniconda

```bash
curl -L -o Miniconda3-latest-Linux-x86_64.sh \
  https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh -b -p ~/miniconda3

# bash / fish 二选一（或都做）
~/miniconda3/bin/conda init bash
~/miniconda3/bin/conda init fish
```

## 创建 conda 环境

新版 conda 使用官方 channel 需要先接受 ToS（`CondaToSNonInteractiveError`）。不想替用户同意协议的话，直接换清华镜像并 `--override-channels`：

```bash
~/miniconda3/bin/conda create -n comfyui python=3.12 -y \
  --override-channels \
  -c https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
```

## 安装 PyTorch（ROCm 版）

先用 `curl` 把轮子下到本地（便于断点续传和进度监控），再本地安装。实测 **官方源直连速度最快**（约 2–6 MB/s），清华 PyPI 只用来装普通依赖：

```bash
# 以 rocm7.2 为例（6.3 同理，把版本号换掉即可）
BASE=https://download.pytorch.org/whl/rocm7.2
curl -sSL -C - -o torch-2.14.0+rocm7.2-cp312-cp312-manylinux_2_28_x86_64.whl \
  "$BASE/torch-2.14.0%2Brocm7.2-cp312-cp312-manylinux_2_28_x86_64.whl"
# torchvision / torchaudio 同理下载

~/miniconda3/envs/comfyui72/bin/python -m pip install \
  -i https://pypi.tuna.tsinghua.edu.cn/simple \
  --extra-index-url https://download.pytorch.org/whl/rocm7.2 \
  ./torch-2.14.0+rocm7.2-*.whl ./torchvision-0.29.0+rocm7.2-*.whl ./torchaudio-2.11.0+rocm7.2-*.whl
```

要点：

- `torch` 依赖 `pytorch-triton-rocm`，这个包只在官方轮子源里，所以必须加 `--extra-index-url`，否则报 `No matching distribution found`。
- `torchaudio 2.11` 已改为 `abi3` 独立版本，不锁 torch 版本，可以和更新版 torch 搭配。
- `torchvision / torchaudio` 的版本号要跟 torch 对齐（如 torch 2.14 ↔ torchvision 0.29）。

## 安装 ComfyUI

```bash
git clone --depth 1 https://github.com/comfyanonymous/ComfyUI.git ~/AI/ComfyUI
~/miniconda3/envs/comfyui72/bin/python -m pip install \
  -i https://pypi.tuna.tsinghua.edu.cn/simple \
  -r ~/AI/ComfyUI/requirements.txt
```

注意：`requirements.txt` 里显式包含 `torch`、`torchvision`、`torchaudio`，**必须先装好 ROCm 版再跑 requirements**，否则 pip 会从镜像拉一份几百 MB 的默认（CUDA）版本，白白浪费还装错。

## 启动脚本

```bash
#!/bin/bash
export HSA_OVERRIDE_GFX_VERSION=10.3.0
export TORCH_ROCM_AOTRITON_ENABLE_EXPERIMENTAL=1
cd "$HOME/AI/ComfyUI"
exec "$HOME/miniconda3/envs/comfyui72/bin/python" main.py --listen 127.0.0.1 --port 8188 "$@"
```

- `HSA_OVERRIDE_GFX_VERSION=10.3.0`：让 `gfx1031` 使用 `gfx1030` 的代码路径，缺了会 `cuda_available: False`。
- `TORCH_ROCM_AOTRITON_ENABLE_EXPERIMENTAL=1`：启用 ROCm 的实验性 flash attention 后端，AMD 上更快。

## 验证

```bash
# 1. PyTorch 侧
HSA_OVERRIDE_GFX_VERSION=10.3.0 python -c "
import torch
print(torch.__version__, torch.version.hip)
print(torch.cuda.is_available(), torch.cuda.get_device_name(0))
print(torch.cuda.get_arch_list())  # 应包含 gfx1030
"

# 2. ComfyUI 侧
curl -s http://127.0.0.1:8188/system_stats | jq '.devices'
```

实测输出：`AMD Radeon RX 6700 XT`、显存 12272 MB、`gfx1030`、ROCm 6.3 / 7.2 均正常。

## 性能对比（512×512，SD1.5，20 步）

| 项目 | ROCm 6.3 + torch 2.7.1 | ROCm 7.2 + torch 2.14 |
| --- | --- | --- |
| 首次出图 | 182 秒（内核编译） | 380 秒（内核编译） |
| 第二次出图 | 37.4 秒 | 36.2 秒 |
| 采样速度 | 1.76 秒/步 | **1.11 秒/步** |
| VAE 解码 | 较快 | 略慢（差值被采样速度抵消） |

结论：采样环节 7.2 快约 36%，端到端总时长接近。整体上推荐 ROCm 7.2 作为默认，6.3 环境保留做后备。

## 踩坑记录

1. **`/tmp` 是 tmpfs，别放大文件。** 本机 `/tmp` 只有 7.4GB（内存一半），下载 5.8GB 轮子时写到 881MB 就报 `curl: (23) Failure writing output to destination`。把下载目录挪到主目录（如 `~/AI/wheels`）即可。
2. **conda 官方源要接受 ToS。** 不代为同意时用清华镜像 + `--override-channels`。
3. **`pytorch-triton-rocm` 不在 PyPI。** 必须加官方 `--extra-index-url`。
4. **先装 torch 再装 requirements。** 否则会被 requirements 里的 `torch` 拉错版本。
5. **核显也会被枚举。** Ryzen 7600X 的核显会被识别成 `cuda:1`（7GB 共享显存），ComfyUI 默认用 `cuda:0` 独显，可忽略。
6. **首次运行慢是正常的。** MIOpen 要为每个卷积自动编译并缓存内核，第一次出图可能多花几分钟，之后走缓存就快了。

## 常用命令速查

```bash
# 启动服务（默认 8188）：~/AI/run_comfyui.sh
# 回退到 ROCm 6.3 环境：~/AI/run_comfyui_rocm63.sh

# 环境切换
conda activate comfyui72     # 或 comfyui（6.3）

# 查看 GPU 状态
HSA_OVERRIDE_GFX_VERSION=10.3.0 ~/miniconda3/envs/comfyui72/bin/python -c \
  "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_name(0))"

# 关掉某个实例
kill $(pgrep -f "main.py --listen 127.0.0.1 --port 8188")
```

## 附：用 NapCat 自动汇报进度

本次部署顺手做了一个进度播报：NapCat 的 OneBot 11 HTTP 服务（`http://127.0.0.1:3000`，token 在 `~/.config/napcat-qq-plugin/config/onebot11_*.json`），用它发送文字与图片：

```bash
# 发私聊文字
curl -s -X POST http://127.0.0.1:3000/send_private_msg \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"user_id": 10001, "message": "进度：50%"}'

# 发本地图片（绝对路径即可）
curl -s -X POST http://127.0.0.1:3000/send_private_msg \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"user_id": 10001, "message": [{"type":"image","data":{"file":"/abs/path/pic.png"}}]}'
```

配合后台监控脚本，就能在下载 / 安装 / 测试各阶段自动推送到 QQ，适合长时间无人值守的任务。
