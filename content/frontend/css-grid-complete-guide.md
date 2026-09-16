---
title: "CSS Grid 布局完全指南"
description: "从轨道、网格线与 fr 单位入手，掌握 CSS Grid 的核心概念与常见布局模式"
category: "前端"
tags:
  - CSS
  - Layout
  - Frontend
date: "2026-09-16"
updated: "2026-09-16"
featured: true
---

# CSS Grid 布局完全指南

CSS Grid 是目前最强大的二维布局系统。它让「先设计行与列，再放置元素」成为可能，非常适合页面骨架、卡片墙与仪表盘布局。

## Grid 容器与项目

设置 `display: grid` 后，元素成为**网格容器**，其直接子元素成为**网格项目**。容器上定义轨道，项目默认按顺序自动流入单元格。

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  gap: 16px;
}
```

上面的代码创建了三列：第一列固定 `200px`，后两列平分剩余空间。

## 理解 fr 单位

`fr`（fraction）表示「一份剩余空间」。与百分比不同，它是在扣除固定尺寸与间距之后再分配，因此更稳定。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

`repeat(3, 1fr)` 等价于 `1fr 1fr 1fr`，是等宽三列的惯用写法。

## 网格线与区域

每条轨道之间都有编号的**网格线**。借助 `grid-column` 与 `grid-row`，可以让项目跨越多条轨道：

```css
.hero {
  grid-column: 1 / -1; /* 横跨整行 */
}
.sidebar {
  grid-row: 1 / 3; /* 纵向跨越两行 */
}
```

`-1` 指向最后一条网格线，常用于「通栏」布局。

## 常见布局模式

### 圣杯布局

```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr 240px;
  grid-template-areas:
    'header header header'
    'sidebar main aside'
    'footer footer footer';
  min-height: 100vh;
}
```

使用 `grid-template-areas` 后，每个项目只需声明 `grid-area` 即可落位，语义清晰、易于维护。

### 响应式卡片墙

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
```

`auto-fill` 配合 `minmax()` 会根据容器宽度自动计算列数，无需任何媒体查询即可在手机与桌面之间平滑切换。

## 对齐与间距

- `justify-content` / `align-content`：控制整个网格在容器内的对齐；
- `justify-items` / `align-items`：控制项目在各自单元格内的对齐；
- `gap`：同时设置行间距与列间距。

## 总结

Grid 适合「整体骨架」，Flexbox 适合「局部一维排列」。二者组合使用，能覆盖绝大多数布局需求。建议从 `grid-template-columns`、`fr` 与 `minmax()` 这三个概念开始练习，它们能解决 80% 的日常布局问题。
