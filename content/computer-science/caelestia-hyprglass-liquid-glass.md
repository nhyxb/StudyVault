---
title: "Caelestia + Hyprland 液态玻璃实战：HyprGlass 窗口与侧边栏调校"
description: "在 Caelestia dotfiles 上接入 HyprGlass 插件：两套可切换的窗口玻璃预设（微磨砂 / 轻模糊清透）、侧边栏图层玻璃与遮罩阈值、面板底色与卡片填充的分层处理、窗口透明度，以及色散、紫色描边、QML 重载等常见问题的处理方法。"
category: "计算机科学"
tags:
  - "Hyprland"
  - "Caelestia"
  - "HyprGlass"
  - "Quickshell"
  - "Wayland"
  - "液态玻璃"
  - "Linux"
date: "2026-09-22"
updated: "2026-09-22"
featured: false
---
# Caelestia + Hyprland 液态玻璃实战：HyprGlass 窗口与侧边栏调校

[HyprGlass](https://github.com/hyprnux/hyprglass) 是一个给 Hyprland 做「液态玻璃」的插件：把窗口或图层表面当作一块厚玻璃板，在背景采样上做多轮模糊、边缘折射、R/G/B 分通道色散、菲涅尔边缘辉光、顶部高光与底部内阴影。它和 Hyprland 自带的 `decoration:blur` 是二选一的关系——插件会给被玻璃化的窗口打上 `noblur`（由默认开启的 `manage_window_blur` 负责），避免两套模糊互相打架。

这篇笔记记录在 Caelestia（Hyprland + Quickshell 桌面方案）上把窗口和侧边栏都调成液态玻璃的完整过程。当前环境：EndeavourOS（Arch 系），Hyprland 0.56.2、caelestia-shell 2.5.0（Quickshell 0.3.1）、HyprGlass 1.0.0，插件用 hyprpm 安装，显示器 DP-2 2560×1440@165。改动集中在用户配置里，只有一处侧边栏 QML 透明化的小修补，dotfiles 升级一般不会冲突。

> 早先的记录对应 caelestia-shell 2.4.0；升级到 2.5.0 后本地 shell 副本已重新合并，`Content.qml` 的透明化补丁仍在 `~/.config/quickshell/caelestia/` 里保留。

## 文件分工与备份习惯

| 文件 | 作用 |
| --- | --- |
| `~/.config/caelestia/hypr-user.lua` | Caelestia 的用户配置，在全部默认配置之后加载（hyprglass 配置写在这里；开头还有一个 `hl.on("hyprland.start", …)` 自启动块，负责 fcitx5 / clash-verge / linux-wallpaperengine-gui，与玻璃无关） |
| `~/.config/caelestia/hypr-vars.lua` | 覆盖 `variables.lua` 里的变量（在子配置加载前应用，reload 后依然可靠生效）；当前是空的 `return {}`，没有覆盖任何默认值 |
| `~/.config/hypr/variables.lua` | Caelestia 默认变量：模糊、圆角、窗口不透明度等 |
| `~/.config/quickshell/caelestia/modules/sidebar/Content.qml` | 侧边栏面板的 QML 实现（本地 shell 副本，位于 `~/.config/`，上游包在 `/etc/xdg/quickshell/caelestia/`） |

改之前先 `cp 文件 文件.bak-$(date +%Y%m%d-%H%M%S)`，出问题直接复制回去再 reload 即可。特别注意：`hypr-user.lua` 里的裸全局表（例如 `general = { border_size = 0 }`）在 `hyprctl reload` 时不一定重新生效，需要覆盖默认值的项一律走 `hypr-vars.lua`（它由 `hyprland.lua` 在加载各个子配置之前合并进 `variables` 表）。

## 插件安装与确认

```bash
hyprpm add https://github.com/hyprnux/hyprglass
hyprpm enable hyprglass
hyprpm reload -n

# 确认加载与配置生效
hyprctl plugins list                        # 应能看到 hyprglass（by Hyprnux, Version: 1.0.0）
hyprctl configerrors                        # 这里为空才算配置没问题
hyprctl getoption plugin:hyprglass:default_preset
```

`~/.config/hypr/hyprland.lua` 末尾挂了一个 `hl.on("hyprland.start", …)`，里面执行 `hyprpm reload -n`，所以每次进 Hyprland 都会自动重载插件，不必手动再跑一次。

插件必须在配置里用 `if hl.plugin.hyprglass then` 包起来，否则插件没加载时整份配置会报错。

## 默认配置速览（改动前的基线）

HyprGlass 的值按 **预设链（主题变体 → 预设共享值 → `inherits` 链）→ 主题覆盖 → 全局值 → 硬编码默认** 的顺序解析。要判断自己到底改了哪些、没改哪些，先记住这套基线（来自插件 1.0.0 源码 `PluginConfig.hpp` / `BuiltInPresets.hpp`）。

全局开关不属于任何预设，直接写在 `hg.config` 里：

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `enabled` | `true` | 全局开关；单窗口可用 `hyprglass_disabled` / `hyprglass_enabled` 标签覆盖 |
| `manage_window_blur` | `true` | 自动给玻璃窗口打 `noblur`，用玻璃替代 Hyprland 模糊 |
| `default_theme` | `dark` | 默认主题 |
| `default_preset` | `default` | 默认预设名 |
| `layers:enabled` | `false` | 图层玻璃默认关闭，必须显式打开 |

可覆盖参数的硬编码默认（暗色 / 亮色有差异的主要是色调映射项）：

| 参数 | 全局默认 | 暗色默认 | 亮色默认 |
| --- | --- | --- | --- |
| `blur_strength` | `2.0` | — | — |
| `blur_iterations` | `3` | — | — |
| `refraction_strength` | `0.6` | — | — |
| `chromatic_aberration` | `0.5` | — | — |
| `fresnel_strength` | `0.6` | — | — |
| `specular_strength` | `0.8` | — | — |
| `glass_opacity` | `1.0` | — | — |
| `edge_thickness` | `0.06` | — | — |
| `tint_color` | `0x8899aa22` | — | — |
| `lens_distortion` | `0.5` | — | — |
| `brightness` | — | `0.82` | `1.12` |
| `contrast` | — | `0.90` | `0.92` |
| `saturation` | — | `0.80` | `0.85` |
| `vibrancy` | — | `0.15` | `0.12` |
| `adaptive_dim` | — | `0.4` | `0.0` |
| `adaptive_boost` | — | `0.0` | `0.4` |

内置预设（用 `default_preset` 或 `hyprglass_preset_<name>` 标签调用；同名用户预设会覆盖内置）：

| 预设 | 特点 |
| --- | --- |
| `high_contrast` | 高对比、强染色，低模糊强折射 |
| `subtle` | 最轻的玻璃 |
| `clear` | 几乎不模糊，近似透明的圆角玻璃边框 |
| `glass` | 实心玻璃块，色散很强（`liquid` 就继承它） |

`liquid` 继承的 `glass` 预设具体值（源码里等价写成用户预设是这样）：

```lua
-- 内置 glass 预设（BuiltInPresets.hpp）
hg.preset("glass", {
    blur_strength = 1.0,
    blur_iterations = 2,
    lens_distortion = 0.3,
    refraction_strength = 8.0,
    chromatic_aberration = 0.5,
    fresnel_strength = 0.4,
    specular_strength = 0.8,
    glass_opacity = 1.0,
    edge_thickness = 0.06,
    tint_color = 0xffffff00,
    dark = { adaptive_dim = 0.3 },
    light = { adaptive_boost = 0.3 },
})
```

一个容易踩的文档坑：README 的表格把 `refraction_strength` 标成 0.0–1.0，但内置 `glass` 直接用了 `8.0`。它实际是折射位移的倍率（像素位移 = 值 × 50px），并不受那个区间限制，别被说明吓到。

## 窗口：两套可切换的玻璃预设

在 `~/.config/caelestia/hypr-user.lua` 里定义两个预设：`liquid` 是带一点磨砂与色调映射的日常版；`crystal` 是当前启用的清透版，保留强折射与边缘高光，只加很轻的高斯模糊（`blur_strength = 0.4`，约 5px 半径），背景杂乱时不至于干扰阅读。

```lua
if hl.plugin.hyprglass then
    local hg = hl.plugin.hyprglass

    hg.config({
        enabled = true,
        default_theme = "dark",
        default_preset = "crystal",   -- 当前启用：crystal / liquid 切换
        brightness = 0.9,
        layers = { enabled = true },  -- 覆盖默认的 false，打开图层玻璃
    })

    -- 微磨砂版：有模糊、去饱和、轻微压暗与冷色 tint
    hg.preset("liquid", {
        inherits = "glass",
        blur_strength = 0.9,
        blur_iterations = 3,
        lens_distortion = 0.45,
        refraction_strength = 2.2,
        chromatic_aberration = 0,
        fresnel_strength = 0.7,
        specular_strength = 1.0,
        glass_opacity = 0.95,
        edge_thickness = 0.07,
        tint_color = 0x8899aa14,
        dark = {
            brightness = 0.9,
            contrast = 0.95,
            saturation = 0.85,
            vibrancy = 0.25,
            adaptive_dim = 0.35,
        },
        light = {
            brightness = 1.06,
            contrast = 0.95,
            saturation = 0.88,
            vibrancy = 0.15,
            adaptive_boost = 0.35,
        },
    })

    -- 轻模糊清透版：无 tint、不做色调映射，保留折射与边缘高光，只加一点高斯模糊
    hg.preset("crystal", {
        inherits = "liquid",
        blur_strength = 0.4,
        blur_iterations = 3,
        tint_color = 0x8899aa00,
        dark = {
            brightness = 1.0,
            contrast = 1.0,
            saturation = 1.0,
            vibrancy = 0,
            adaptive_dim = 0,
        },
        light = {
            brightness = 1.0,
            contrast = 1.0,
            saturation = 1.0,
            vibrancy = 0,
            adaptive_boost = 0,
        },
    })
end
```

切换方案只改 `default_preset`，然后 `hyprctl reload`。预设值的解析顺序是：主题变体（`dark` / `light` 表）→ 预设共享值 → `inherits` 链 → 全局主题覆盖 → 全局值 → 内置默认，所以 `crystal` 只需覆盖与 `liquid` 不同的部分。

关键参数的作用（对照源码与默认值）：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `blur_strength` | `2.0` | 模糊半径 = 值 × 12px（值 ≥ 0.35 时还有 2 倍降采样），0 即不模糊 |
| `blur_iterations` | `3` | 高斯模糊遍数 1~5，越大越糊、越吃 GPU |
| `refraction_strength` | `0.6` | 边缘折射强度，像素位移 = 值 × 50px；越大边缘越像厚玻璃 |
| `chromatic_aberration` | `0.5` | 色散强度，单通道偏移 = 值 × 0.35 × 折射位移；边角容易出现彩色描边 |
| `fresnel_strength` | `0.6` | 边缘辉光，玻璃质感主要来源之一 |
| `specular_strength` | `0.8` | 顶部高光，玻璃质感主要来源之一 |
| `lens_distortion` | `0.5` | 中心球面放大，值越大中间越像透镜 |
| `glass_opacity` | `1.0` | 玻璃整体不透明度，会再乘以窗口/图层自身的 alpha |
| `edge_thickness` | `0.06` | 边缘折射带宽度，占窗口短边的比例（0~0.15） |
| `tint_color` | `0x8899aa22` | 玻璃染色，最后两位十六进制是染色强度（`00` 即不染） |

## 窗口透明度：让玻璃透出来

窗口透明度决定玻璃能透出多少。当前 `~/.config/hypr/variables.lua`：

```lua
blurEnabled  = false,   -- 原生 decoration:blur 整体关闭，背景模糊交给 HyprGlass，避免两套模糊叠加
windowOpacity = 0.98,   -- 窗口整体不透明度：越接近 1 越不透，想更明显地看到玻璃就把值往下调
```

注意 `rules.lua` 里 `foot`、图片查看器、剪辑软件等被打了 `opaque` 标签（`foot`、`equibop`、`org.quickshell`、`feh|imv|swappy`、`krita|gimp|inkscape|darktable`、`resolve|kdenlive|shotcut`、`blender|godot`），它们不会参与透明与玻璃；想让终端也有玻璃质感，把 `foot` 从 opaque 列表里删掉即可。`~/.config/foot/foot.ini` 已经按玻璃方案调好：`alpha=0.16`、`blur=no`（foot 自带模糊交给插件负责，避免双重模糊）。

## 侧边栏：图层玻璃与遮罩阈值

Caelestia 的侧边栏、顶栏、面板都在同一个 Quickshell 图层窗口里，其中 `StyledWindow.qml` 用 `WlrLayershell.namespace: \`caelestia-${name}\`` 生成命名空间，抽屉窗口的 `name` 是 `drawers`，所以图层命名空间是 `caelestia-drawers`。配置如下：

```lua
hg.layer("caelestia-drawers", {
    preset = "caelestia",
    mask_threshold = 0.008,   -- 图标层的 mask_threshold 默认是 0.001，这里故意抬高
})
```

侧边栏专用预设继承 `crystal`，并针对全屏图层单独调过：模糊保持较轻（`0.3`），折射和边缘带加宽，让底色出现明显的水滴状玻璃形变：

```lua
hg.preset("caelestia", {
    inherits = "crystal",
    blur_strength = 0.3,
    blur_iterations = 2,
    lens_distortion = 0.15,
    refraction_strength = 2.4,
    chromatic_aberration = 0,
    fresnel_strength = 0.5,
    specular_strength = 0.9,
    glass_opacity = 0.92,
    edge_thickness = 0.12,
    tint_color = 0x8899aa00,
    dark = { brightness = 1.0, contrast = 1.0, saturation = 1.0, vibrancy = 0, adaptive_dim = 0 },
    light = { brightness = 1.0, contrast = 1.0, saturation = 1.0, vibrancy = 0, adaptive_boost = 0 },
})
```

这里最大的坑是 `mask_threshold`。图层玻璃只画在「可见内容 alpha 超过阈值」的地方。当前 `~/.config/caelestia/shell.json` 的透明材质设置：

| 字段 | 当前值 | 作用 |
| --- | --- | --- |
| `appearance.transparency.base` | `0.04` | 主表面（layer 0）填充 alpha：底色保留 4%，必须高于 `mask_threshold`，玻璃才能盖满整块面板 |
| `appearance.transparency.layers` | `0.10` | 次级容器表面（layer ≥ 1）填充 alpha：卡片、列表这类表面拿 10%，比底色明显，才能浮出来 |

实测踩过的一个坑：`base` 一旦设成 `0`，面板底色就没有 alpha，玻璃遮罩只在卡片和文字附近成立，整个侧边栏看起来「只有一部分地方有模糊」。所以底色必须留一点点填充（现在 4%，安全高于 `mask_threshold = 0.008`），玻璃才能铺满整块面板。

卡片和底色的区分靠填充层级：卡片走 `layers`（0.10），明显高于底色的 0.04，于是视觉上浮在玻璃底色之上。注意 HyprGlass 一个图层只有一套模糊/折射参数，做不到「卡片比底色更糊」，能让它们拉开距离的只有填充 alpha 和颜色——所以最初把卡片压到 0.02 时，两者就糊在一起了。另外 `layers` 是全局字段，通知弹窗、仪表盘卡片、顶栏元素也会一起变明显，想只改侧边栏需要去动对应 QML。

另外为了让面板背景真正透明，把 `modules/sidebar/Content.qml` 里通知区那层 `color: Colours.tPalette.m3surfaceContainerLow` 改成了 `color: "transparent"`（上游包 `/etc/xdg/quickshell/caelestia/` 里仍是 `m3surfaceContainerLow`），否则玻璃上还盖着一层面板底色。

图层玻璃的几何是整个图层表面（`caelestia-drawers` 是全屏窗口，圆角为 0），边缘折射带宽度 = `edge_thickness × 屏幕短边`：当前 `0.12 × 1440 ≈ 173px`，正好从屏幕右缘向侧边栏里延伸一大片，所以侧边栏底色能看到明显的折射形变；顶栏贴着屏幕上边，也会吃到同样的效果（两者在同一个图层，没法只对侧边栏生效）；屏幕中间的面板则只有纯平的玻璃。

## 踩坑记录

**边角的彩色描边**：`chromatic_aberration` 会在两条边交汇的角落形成明显的 R/G/B 分离，颜色越鲜艳越显眼。个人审美上不喜欢就设 0，玻璃感靠折射 + 菲涅尔 + 高光依然成立。

**侧边栏只有一部分地方有模糊**：图层玻璃按「可见内容 alpha」遮罩，`shell.json` 里 `base = 0` 时面板底色没有 alpha，玻璃只出现在卡片和文字附近；把 `base` 留到明显高于 `mask_threshold` 的值（当前 0.04）即可铺满整块面板。

**`hyprctl getoption` 查 `blur_strength` 只看到 2.0**：这是正常的。`blur_strength`、`refraction_strength` 这类值写在预设里，不算全局值，所以 `getoption plugin:hyprglass:blur_strength` 显示的是硬编码默认（2.0，`set: false`）；能直接确认 `set: true` 的是 `default_preset`（crystal）、`default_theme`（dark）、`layers:enabled`（1）这些全局项。

**聚焦窗口出现紫色描边**：这不是玻璃，是 Hyprland 的窗口边框 `general:col:active_border` 取了动态配色里的 `primary`（比如 `c2c1ff`，当前 `activeWindowBorderColour = "rgba(" .. scheme.primary .. "e6)"`）。当前 `windowBorderSize = 2`，保留这条描边；想彻底关掉就在 `hypr-vars.lua` 里写 `windowBorderSize = 0`，它在默认配置之前合并进 `variables`，reload 也不会被覆盖回去。裸写在 `hypr-user.lua` 里的 `general = { border_size = 0 }` 实测 reload 后不生效。

**改了 QML 不生效**：Caelestia 在 `shell.qml` 里设了 `settings.watchFiles: false`，Quickshell 不会热重载，必须重启 shell：

```bash
caelestia shell -k
caelestia shell -d
```

从终端重启时注意 `XDG_STATE_HOME` 等环境变量是否被别的程序污染（会写错状态目录、丢配色），必要时用干净环境启动：

```bash
env XDG_STATE_HOME="$HOME/.local/state" caelestia shell -d
```

**性能取舍**：模糊遍数、图层 `live_resample`（壁纸动起来时每秒最多 30 次重绘，`layers:live_resample` 默认 `true`、`layers:live_resample_fps` 默认 `30`）都会影响 GPU 占用；静态壁纸下开销很低，动态壁纸 + 全屏玻璃建议先观察一下再往上堆参数。

## 参数与状态速查

```bash
hyprctl getoption plugin:hyprglass:default_preset      # 当前窗口预设
hyprctl getoption plugin:hyprglass:layers:enabled      # 图层玻璃开关
hyprctl configerrors                                   # 配置是否有错
hyprctl reload                                         # 改完 lua 配置后重载
```

最终状态：窗口默认 `crystal`（轻模糊 0.4、无染色、强折射的清透玻璃，`liquid` 微磨砂版随时可切回），窗口不透明度 0.98、边框 2；侧边栏轻模糊 0.3、无染色、强折射（2.4）与宽折射带（0.12），底色填充 4%（`base = 0.04`）、卡片填充 10%（`layers = 0.10`），`mask_threshold = 0.008` 让玻璃铺满整块面板。插件与预设相对默认值的改动都集中在 `hypr-user.lua`，`hypr-vars.lua` 目前为空；所有原始配置均有带时间戳的 `.bak` 备份，可随时回滚。
