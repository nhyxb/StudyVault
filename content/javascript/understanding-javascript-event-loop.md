---
title: "理解 JavaScript Event Loop"
description: "从调用栈、宏任务与微任务的角度，梳理浏览器事件循环如何调度 JavaScript 异步代码"
category: "JavaScript"
tags:
  - JavaScript
  - Async
  - Browser
date: "2026-09-16"
updated: "2026-09-16"
featured: true
---

# 理解 JavaScript Event Loop

JavaScript 是单线程语言，却能在浏览器里同时处理网络请求、定时器与用户交互。让这一切成为可能的，正是 **事件循环（Event Loop）** 与它背后的任务调度机制。

## 为什么需要 Event Loop

JavaScript 引擎一次只能执行一段同步代码。如果某个操作需要等待（例如网络响应），直接阻塞主线程会让页面完全卡死。浏览器解决这个问题的方式是：把耗时操作交给宿主环境（如浏览器或 Node.js），主线程继续执行后续代码，等异步结果就绪后再通过回调回到主线程。

> 事件循环不是语言本身的一部分，而是宿主环境为 JavaScript 提供的调度机制。

## 调用栈与任务队列

- **调用栈（Call Stack）**：记录当前正在执行的函数。栈为空时，事件循环才会取下一个任务。
- **任务队列（Task Queue）**：存放等待执行的宏任务（如 `setTimeout` 回调、事件回调）。
- **微任务队列（Microtask Queue）**：存放 `Promise.then`、`queueMicrotask` 等微任务，优先级高于宏任务。

每一轮事件循环大致遵循以下步骤：

1. 从宏任务队列取出一个任务执行；
2. 执行过程中产生的微任务依次清空；
3. 浏览器在合适时机更新渲染；
4. 进入下一轮循环。

## 宏任务与微任务

| 类型 | 常见来源 | 执行时机 |
| --- | --- | --- |
| 宏任务 | `setTimeout`、`setInterval`、I/O、UI 事件 | 每轮循环执行一个 |
| 微任务 | `Promise.then/catch/finally`、`queueMicrotask` | 当前任务结束后、渲染前清空 |

微任务可以插队：即使它是在本轮循环中途才加入，也会在渲染之前被执行完。

## 一段代码看执行顺序

```js
console.log('1: 同步开始')

setTimeout(() => {
  console.log('4: 宏任务 setTimeout')
}, 0)

Promise.resolve().then(() => {
  console.log('3: 微任务 Promise')
})

console.log('2: 同步结束')
```

输出顺序是 `1 → 2 → 3 → 4`。原因是同步代码先全部执行，之后微任务队列被清空，最后才轮到宏任务队列里的 `setTimeout`。

## 浏览器渲染与事件循环

浏览器并非每执行完一个宏任务就立刻渲染。它会在一次事件循环中完成「取宏任务 → 清空微任务 → 判断是否需要渲染」的过程，再决定是否更新页面。

这也解释了为什么在同一个宏任务里连续修改 DOM 多次，浏览器通常只进行一次渲染——渲染时机由事件循环统一调度。

## 总结

- 同步代码优先，调用栈清空后事件循环才介入；
- 微任务优先于宏任务，且在渲染前清空；
- `setTimeout(0)` 不代表立即执行，只是尽快把回调放入宏任务队列；
- 理解事件循环，是写出可预测异步代码的基础。

掌握这套机制后，再看 `async/await`、`requestAnimationFrame` 与 `queueMicrotask` 的差别，就会清晰很多。
