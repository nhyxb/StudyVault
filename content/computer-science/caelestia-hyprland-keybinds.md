---
title: "Caelestia + Hyprland 快捷键与常用操作速查"
description: "Caelestia dotfiles 默认快捷键、触控板手势、常用 CLI 与配置覆盖方式速查，基于官方 main 分支配置核对整理。"
category: "计算机科学"
tags:
  - "Hyprland"
  - "Caelestia"
  - "Linux"
  - "Wayland"
  - "快捷键"
  - "Quickshell"
date: "2026-09-18"
updated: "2026-09-18"
featured: false
---
# Caelestia + Hyprland 快捷键与常用操作速查

[Caelestia](https://github.com/caelestia-dots/caelestia) 是一套以 Hyprland + Quickshell 为核心的桌面方案，由 dotfiles、shell、CLI 三个仓库组成。它把工作区、窗口组、特殊工作区、截图录屏、剪贴板等串成统一交互，操作习惯和原版 Hyprland 差别不小。这篇笔记整理自官方 main 分支的 `hypr/variables.lua`、`hypr/hyprland/keybinds.lua`、`hypr/hyprland/gestures.lua` 与仓库 README（核对于 2026-09-18），方便日常查阅。

> 说明：所有快捷键都可以在 `~/.config/caelestia/hypr-vars.lua` 中覆盖。不同版本可能略有出入，以自己机器上的实际配置为准——但不要直接修改 `~/.config/hypr/`，否则更新 dots 时会产生冲突。

## 启动器与工作区

| 快捷键 | 作用 |
| --- | --- |
| `Super`（按下后松开） | 打开启动器 |
| `Super + 1~9, 0` | 切换到工作区 1~10（0 表示第 10 个） |
| `Super + Alt + 1~9, 0` | 把当前窗口移动到工作区 1~10 |
| `Ctrl + Super + 1~9, 0` | 切换到工作区组（每组 10 个） |
| `Ctrl + Super + Alt + 1~9, 0` | 把当前窗口移动到工作区组 |
| `Super + Alt + S`、`Ctrl + Super + Shift + Up` | 把窗口移到特殊工作区 |
| `Ctrl + Super + Shift + Down` | 把窗口移出特殊工作区 |
| `Super + Alt + 滚轮下`、`Super + Alt + Page_Down`、`Ctrl + Super + Shift + Right` | 把窗口移到下一个工作区 |
| `Super + Alt + 滚轮上`、`Super + Alt + Page_Up`、`Ctrl + Super + Shift + Left` | 把窗口移到上一个工作区 |
| `Super + 滚轮下`、`Ctrl + Super + Right`、`Super + Page_Down` | 去下一个工作区 |
| `Super + 滚轮上`、`Ctrl + Super + Left`、`Super + Page_Up` | 去上一个工作区 |
| `Ctrl + Super + 滚轮下` | 去下一个工作区组 |
| `Ctrl + Super + 滚轮上` | 去上一个工作区组 |

## 窗口组（Group）

| 快捷键 | 作用 |
| --- | --- |
| `Alt + Tab` | 组内下一个窗口 |
| `Shift + Alt + Tab` | 组内上一个窗口 |
| `Ctrl + Alt + Tab` | 下一个窗口组 |
| `Ctrl + Shift + Alt + Tab` | 上一个窗口组 |
| `Super + Comma` | 切换（创建/解散）窗口组 |
| `Super + Shift + Comma` | 锁定当前组 |
| `Super + U` | 把窗口移出组 |

## 窗口操作

| 快捷键 | 作用 |
| --- | --- |
| `Super + 方向键` | 聚焦对应方向的窗口 |
| `Super + Shift + 方向键` | 把窗口向对应方向移动 |
| `Super + Minus`、`Super + Alt + Left` | 减小窗口宽度 |
| `Super + Equal`、`Super + Alt + Right` | 增大窗口宽度 |
| `Super + Shift + Minus`、`Super + Alt + Up` | 减小窗口高度 |
| `Super + Shift + Equal`、`Super + Alt + Down` | 增大窗口高度 |
| `Super + 左键拖拽`、`Super + Z + 左键` | 移动窗口 |
| `Super + 右键拖拽`、`Super + X + 左键` | 调整窗口大小 |
| `Ctrl + Super + Backslash` | 窗口居中 |
| `Ctrl + Super + Alt + Backslash` | 调整为屏幕 55% × 70% 并居中 |
| `Super + Alt + Backslash` | 画中画（PiP）模式 |
| `Super + P` | 固定窗口（pin） |
| `Super + F` | 全屏 |
| `Super + Alt + F` | 全屏（保留边框，即 maximized） |
| `Super + Alt + Space` | 切换浮动 |
| `Super + Q` | 关闭窗口 |

> 注意：官方 README 里「增大窗口高度」误写成了 `Super + Shift + Minus`，实际配置是 `Super + Shift + Equal`，上表已按 `variables.lua` 修正。

## 特殊工作区

| 快捷键 | 作用 |
| --- | --- |
| `Super + S` | 切换特殊工作区 |
| `Ctrl + Shift + Escape` | 切换系统监视器工作区（默认 btop） |
| `Super + M` | 切换音乐工作区 |
| `Super + D` | 切换通讯工作区 |
| `Super + R` | 切换待办工作区 |

## 应用启动

| 快捷键 | 作用 |
| --- | --- |
| `Super + T` | 终端（默认 foot） |
| `Super + W` | 浏览器（默认 firefox） |
| `Super + C` | 编辑器（默认 codium） |
| `Super + E` | 文件管理器（默认 thunar） |
| `Ctrl + Alt + V` | 音频设置（默认 pwvucontrol） |

## 截图与录屏

| 快捷键 | 作用 |
| --- | --- |
| `Print` | 截图 |
| `Super + Shift + S` | 截图（冻结画面） |
| `Super + Shift + Alt + S` | 区域截图 |
| `Ctrl + Alt + R` | 录制全屏 |
| `Super + Alt + R` | 录制（带声音） |
| `Super + Shift + Alt + R` | 录制选定区域 |
| `Super + Shift + C` | 取色器（hyprpicker） |

## 媒体、音量与亮度

| 快捷键 | 作用 |
| --- | --- |
| `Ctrl + Super + Space` | 播放 / 暂停 |
| `Ctrl + Super + Equal` | 下一曲 |
| `Ctrl + Super + Minus` | 上一曲 |
| `Ctrl + Super + Backspace` | 停止播放 |
| `Super + Shift + M` | 静音 |
| `XF86AudioMute` | 切换输出静音 |
| `XF86AudioMicMute` | 切换麦克风静音 |
| `XF86AudioRaiseVolume` / `XF86AudioLowerVolume` | 音量增减（默认步进 10，上限 100） |
| `XF86MonBrightnessUp` / `XF86MonBrightnessDown` | 亮度增减 |

## 剪贴板与 Emoji

| 快捷键 | 作用 |
| --- | --- |
| `Super + V` | 打开剪贴板历史 |
| `Super + Alt + V` | 剪贴板历史（删除模式） |
| `Ctrl + Shift + Alt + V` | 直接粘贴最新一条剪贴板 |
| `Super + Period` | Emoji 选择器 |

## Shell 与会话

| 快捷键 | 作用 |
| --- | --- |
| `Ctrl + Alt + Delete` | 打开会话菜单 |
| `Super + N` | 切换侧边栏 |
| `Super + K` | 显示所有面板 |
| `Ctrl + Alt + C` | 清除通知 |
| `Super + L` | 锁屏 |
| `Super + Alt + L` | 恢复锁屏（重启 shell 并锁定） |
| `Super + Shift + L` | 休眠（`systemctl suspend-then-hibernate`） |
| `Ctrl + Super + Alt + R` | 重启 shell |
| `Ctrl + Super + Shift + R` | 结束 shell |

## 触控板手势

| 手势 | 作用 |
| --- | --- |
| 四指横向滑动 | 切换工作区 |
| 三指上滑 | 打开特殊工作区 |
| 三指下滑 | 切换特殊工作区 |
| 四指下滑 | 休眠 |

手指数可在 `hypr-vars.lua` 里用 `gestureFingers`、`workspaceSwipeFingers`、`gestureFingersMore` 调整。

## 常用 CLI 命令

| 命令 | 作用 |
| --- | --- |
| `caelestia shell -d` | 启动 shell（后台常驻） |
| `caelestia shell -s` | 查看可用的 IPC 命令 |
| `caelestia wallpaper -f <path>` | 直接设置壁纸 |
| `caelestia scheme set -n dynamic` | 让配色方案跟随壁纸动态生成 |
| `caelestia screenshot` / `record` | 截图 / 录屏 |
| `caelestia clipboard` / `emoji` | 剪贴板 / emoji 工具 |
| `caelestia update` | 更新系统与 dots |
| `caelestia install` | 安装 dots（需先装 AUR 的 `caelestia-cli`） |

启动器里还能直接输入 `>wallpaper` 打开壁纸切换器、`>scheme` 切换配色。壁纸默认从 `~/Pictures/Wallpapers` 读取，可用 shell 配置里的 `paths.wallpaperDir` 修改。

## 自定义配置要点

Caelestia 升级时会覆盖 `~/.config/hypr/`，所以个人改动要放在这两个文件里：

- `~/.config/caelestia/hypr-vars.lua`：覆盖默认变量（应用、快捷键、模糊、圆角、间距等）。
- `~/.config/caelestia/hypr-user.lua`：追加任意 Hyprland 配置（显示器布局、额外快捷键、窗口规则）。

例如改默认应用和快捷键：

```lua
return {
    browser = "zen-browser",
    editor = "code",
    kbTerminal = "SUPER + Return",
    blurEnabled = false,
}
```

Shell 和 CLI 的配置分别在 `~/.config/caelestia/shell.json` 与 `~/.config/caelestia/cli.json`。改完用 `hyprctl reload` 或 `caelestia shell -d` 重启 shell 即可生效。

## 参考

- Caelestia dotfiles：<https://github.com/caelestia-dots/caelestia>
- Caelestia shell：<https://github.com/caelestia-dots/shell>
- Caelestia CLI：<https://github.com/caelestia-dots/cli>
- Hyprland Wiki：<https://wiki.hypr.land/>
