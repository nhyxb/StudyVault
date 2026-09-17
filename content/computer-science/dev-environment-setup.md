---
title: "开发环境配置清单：EndeavourOS + Hyprland 工作台"
description: "一份可复现的 Linux 开发环境记录：Ryzen 5 7600X + RX 6700 XT 硬件、EndeavourOS 系统、Hyprland Wayland 桌面，以及完整的工具链版本与调优参数"
category: "计算机科学"
tags:
  - Linux
  - EndeavourOS
  - Arch Linux
  - Hyprland
  - Wayland
  - 开发环境
date: "2026-09-17"
updated: "2026-09-17"
featured: false
---

# 开发环境配置清单：EndeavourOS + Hyprland 工作台

这份清单记录一台日常开发机的完整配置：从 CPU/GPU 选型、系统与内核，到桌面环境、工具链版本和系统调优参数。目的不是炫耀配置，而是让环境**可复现**——机器损坏或换新机时，照着这份文档能快速重建同一套工作台。

## 硬件配置

| 部件 | 规格 |
| --- | --- |
| CPU | AMD Ryzen 5 7600X（Zen 4，6 核 12 线程） |
| 指令集 | 支持 AVX-512（`avx512f`），当下 4.78 GHz |
| 内存 | 14.8 GiB 可用 |
| 交换空间 | 32 GiB（独立分区，非 zram） |
| 系统盘 | NVMe SSD 931.5 GiB（根分区 XFS，当前占用 121 GiB / 20%） |
| 数据盘 | SATA SSD 119.3 GiB |
| 显卡 | AMD Radeon RX 6700 XT（Navi 22）+ Ryzen 内置 Raphael 核显 |
| 固件 | UEFI 启动 |

CPU 与 GPU 同为 AMD，带来了一个实际好处：内核态与用户态驱动栈完全统一在 `amdgpu` + Mesa 一套开源驱动上，不需要处理 NVIDIA 专有驱动的 DKMS 与 Wayland 兼容问题。

## 系统环境

| 项目 | 版本 / 取值 |
| --- | --- |
| 发行版 | EndeavourOS（Arch Linux 衍生，滚动更新） |
| 内核 | 7.2.6-arch2-1 |
| 架构 | x86_64 |
| 引导 | UEFI + systemd-boot |
| systemd | 261.3 |
| 会话类型 | Wayland |
| 默认 Shell | bash（交互使用 fish 4.9.3） |
| 语言环境 | zh_CN.UTF-8 |
| 时区 | Asia/Shanghai |
| 已启用服务 | 19 个（失败 0 个） |
| 已加载内核模块 | 121 个 |

选 EndeavourOS 而不是纯 Arch 的理由很直接：它保留了 Arch 的滚动更新与 AUR 生态，但把安装器和常用驱动、固件、桌面组件打包好了，装机后能直接进入干活状态，省掉手工配置各环节的时间。

## 图形与桌面

桌面环境是 Hyprland——一个基于 wlroots 的平铺合成器，没有传统意义上的「桌面环境」包袱：

| 组件 | 选择 |
| --- | --- |
| 合成器 | Hyprland 0.56.2（Wayland） |
| 状态栏 | quickshell 0.3.1（QML 驱动的面板框架） |
| 输入法 | fcitx5 5.1.22 |
| 图形栈 | Mesa 26.2.2 + vulkan-radeon 26.2.2 |
| 门户 | xdg-desktop-portal-hyprland 1.4.1 |
| 字体 | 3037 个字体条目，中文主力为等距更纱黑体 CL/HC |

Hyprland 的配置全部是纯文本，这让整套桌面（键位、布局、动画、规则）可以和代码一样纳入版本管理。GPU 温度在空闲时约 49°C（`edge` 传感器），风扇曲线与温控表现稳定。

## 开发工具链

| 工具 | 版本 |
| --- | --- |
| Node.js | 26.9.0 |
| pnpm | 11.26.0 |
| Python | 3.14.7 |
| Rust | 1.98.1（含 cargo） |
| GCC | 16.2.1 |
| Clang | 22.1.8 |
| CMake | 4.4.3 |
| GNU Make | 4.4.1 |
| Git | 2.55.0 |
| Vim | 9.2 |
| fish | 4.9.3 |
| starship | 1.26.0 |
| bat / eza / fd / fzf | 0.26.1 / 现代 ls 替代 / 10.5.0 / 0.74.4 |
| jq | 1.8.2 |
| zoxide | 0.10.0 |

前端、Rust 与 C/C++ 三条链路的编译器都保持在较新的大版本上。terminal 工具方面用 `eza`、`bat`、`fd`、`fzf`、`zoxide` 替换了传统的 `ls`、`cat`、`find`：这套组合在滚动更新的系统上能保持行为一致，同时对大目录和高频跳转的处理更快。

## 包管理与更新

- **包总数 1366 个**，其中显式安装 264 个，AUR/外部包 28 个；
- AUR 助手用 `yay` 13.0.1；
- 镜像源使用教育网镜像（吉林大学源），`ParallelDownloads = 5`；
- 包缓存占用 3.0 GiB，建议定期 `paccache -r` 清理；
- 未使用 Flatpak（0 个包），保持单一包管理来源，避免依赖排查时分不清出处。

单一包管理来源这点值得强调：所有软件都来自 pacman/AUR，升级路径只有一条，出问题时 `pacman -Qo` 就能定位文件归属，不需要在三套包管理体系之间对照。

## 系统调优参数

| 参数 | 取值 | 说明 |
| --- | --- | --- |
| CPU 调频策略 | `performance` | 桌面机优先响应速度，不追求省电 |
| vm.swappiness | 60 | 保持内核默认值 |
| ZRAM | 未启用 | 用 32 GiB 独立交换分区替代 |
| 引导参数 | `nowatchdog` | 关闭看门狗，减少无谓唤醒 |

桌面场景下 `performance` 调频比 `powersave` 更合适：编译、构建、浏览器多标签这些负载都是突发型，等到调频器反应过来再升频，体感延迟就出来了。

## 为什么这样搭配

1. **全 AMD 平台**：内核与 Mesa 一条开源栈，Wayland 下没有专有驱动的合成器兼容坑。
2. **滚动更新 + 教育网镜像**：软件版本新，拉包速度快；代价是升级需谨慎，重要工作前先看 Arch 新闻。
3. **Wayland 原生桌面**：Hyprland 在分数缩放、多显示器、屏幕共享上比 X11 更干净，且配置即代码。
4. **终端工具现代化但克制**：只替换高频命令，`vim`、`git`、`gcc` 这些保持原样，避免肌肉记忆被打破。

## 环境复现步骤

```bash
# 1. 基础系统：EndeavourOS 安装器（UEFI + systemd-boot）
# 2. 桌面与图形
sudo pacman -S hyprland xdg-desktop-portal-hyprland mesa vulkan-radeon \
               quickshell fcitx5 fcitx5-chinese-addons

# 3. 工具链
sudo pacman -S nodejs pnpm python rust gcc clang cmake make git vim fish

# 4. 终端增强
sudo pacman -S starship eza bat fd fzf zoxide jq

# 5. 调优
echo performance | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor
```

## 小结

一台能长期稳定干活的开发机，关键不在单项硬件多强，而在于**每一层都可解释**：为什么选这个发行版、为什么用这个合成器、为什么保留这条调优参数。把环境写成清单，就等于把"重装"从一次冒险变成一次照单执行。

> 说明：本文隐去了主机名、网络地址、硬件序列号与磁盘标识等本机专属信息，只保留可复现的技术配置。
