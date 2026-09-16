---
title: "HTTP 请求基础"
description: "理解请求与响应结构、常用方法、状态码与请求头，读懂浏览器与服务器之间的对话"
category: "计算机网络"
tags:
  - HTTP
  - Network
  - Web
date: "2026-09-16"
updated: "2026-09-16"
featured: true
---

# HTTP 请求基础

HTTP（HyperText Transfer Protocol）是 Web 的基石。浏览器输入一个地址、页面加载、接口调用，背后都是 HTTP 请求与响应。

## 请求与响应结构

一次 HTTP 交互由**请求**与**响应**组成。请求通常包含：

- **请求行**：方法、路径、协议版本；
- **请求头**：附加信息，如 `Host`、`Accept`、`Content-Type`；
- **请求体**：可选，常见于 `POST`、`PUT`。

响应则包含**状态行**、**响应头**与**响应体**。

```http
GET /api/posts HTTP/1.1
Host: example.com
Accept: application/json
```

## 常用方法

| 方法 | 语义 | 是否安全 | 是否幂等 |
| --- | --- | --- | --- |
| GET | 获取资源 | 是 | 是 |
| POST | 创建资源 | 否 | 否 |
| PUT | 整体替换资源 | 否 | 是 |
| PATCH | 部分更新资源 | 否 | 否 |
| DELETE | 删除资源 | 否 | 是 |

**安全**意味着不改变服务端状态，**幂等**意味着重复执行结果一致。理解这两个属性，有助于设计出语义正确的接口。

## 状态码

- **2xx 成功**：`200 OK`、`201 Created`、`204 No Content`；
- **3xx 重定向**：`301 Moved Permanently`、`304 Not Modified`；
- **4xx 客户端错误**：`400 Bad Request`、`401 Unauthorized`、`404 Not Found`；
- **5xx 服务端错误**：`500 Internal Server Error`、`503 Service Unavailable`。

> 状态码是结果的第一信号。调试接口时，先看状态码，再读响应体，通常能少走很多弯路。

## 常用请求头

- `Content-Type`：声明请求体的媒体类型，如 `application/json`；
- `Authorization`：携带认证信息；
- `Cache-Control`：控制缓存策略；
- `User-Agent`：标识客户端；
- `Accept`：声明客户端能处理的响应类型。

## HTTPS 与 HTTP/2

HTTPS 在 HTTP 之下加入 TLS 加密层，提供机密性、完整性与身份认证。HTTP/2 则通过多路复用、头部压缩与服务器推送大幅提升传输效率，如今已是主流站点的默认选择。

## 总结

HTTP 的知识点并不复杂，却贯穿整个 Web 开发。记住「方法 + 路径 + 头 + 状态码」这条主线，就能读懂绝大多数接口文档与抓包结果。
