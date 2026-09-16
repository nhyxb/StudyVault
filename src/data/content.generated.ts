/* eslint-disable */
/**
 * 本文件由 scripts/generate-content.mjs 自动生成，请勿手动编辑。
 * 修改 content/ 下的 Markdown 后运行 `npm run generate` 重新生成。
 */
import type { CategoryInfo, Post, TagInfo } from '../types'

export const posts: Post[] = [
  {
    "slug": "computer-science-big-o-notation",
    "title": "算法复杂度与大 O 表示法",
    "description": "用大 O 表示法评估时间与空间复杂度，理解算法随数据规模增长的变化趋势",
    "category": "计算机科学",
    "tags": [
      "Algorithm",
      "复杂度",
      "Computer Science"
    ],
    "date": "2026-09-16",
    "updated": "2026-09-16",
    "featured": false,
    "readingTime": 1,
    "headings": [
      {
        "id": "为什么需要复杂度分析",
        "text": "为什么需要复杂度分析",
        "level": 2
      },
      {
        "id": "常见时间复杂度",
        "text": "常见时间复杂度",
        "level": 2
      },
      {
        "id": "一个直观的例子",
        "text": "一个直观的例子",
        "level": 2
      },
      {
        "id": "空间复杂度",
        "text": "空间复杂度",
        "level": 2
      },
      {
        "id": "常见误区",
        "text": "常见误区",
        "level": 2
      },
      {
        "id": "总结",
        "text": "总结",
        "level": 2
      }
    ],
    "plainText": "算法复杂度与大 O 表示法 选择算法时，我们关心两件事：它有多快（时间复杂度），它吃多少内存（空间复杂度）。大 O 表示法就是用来描述这种「增长趋势」的语言。 为什么需要复杂度分析 同一道题，暴力解可能在 1 万条数据时还很轻松，到 100 万条时就完全跑不动。复杂度分析让我们在 写代码之前 就能判断方案是否可行。 大 O 描述的是趋势，不是精确时间。常数因子在大规模数据面前往往可以忽略。 常见时间复杂度 复杂度 名称 典型例子 O(1) 常数 哈希表查找 O(log n) 对数 二分查找 O(n) 线性 遍历数组 O(n log n) 线性对数 归并排序、快排 O(n²) 平方 双重循环、冒泡排序 一个直观的例子 function findPair ( arr , target ) { const seen = new Set ( ) for ( const value of arr ) { const need = target - value if ( seen . has ( need ) ) return [ need , value ] seen . add ( value ) } return null } 上面的解法用哈希表把两数之和从 O(n²) 降到 O(n) ，代价是额外 O(n) 的空间。这是典型的「以空间换时间」。 空间复杂度 空间复杂度统计的是算法运行中 额外 使用的内存。递归调用会占用调用栈空间，这也是为什么深层递归可能导致栈溢出。 常见误区 不是所有双重循环都是 O(n²) ：内层循环次数若与 n 无关，则另当别论； 常数优化无法改变量级：把 2n 优化到 n 有意义，但量级没有变化； 最好情况与最坏情况不同：排序算法常用最坏或平均情况来比较。 总结 掌握大 O 表示法，意味着你可以把「感觉很快」变成「可以证明」。在刷题和工程中，先确定数据规模，再选择合适量级的算法，是性价比最高的习惯。",
    "html": "<h1>算法复杂度与大 O 表示法</h1>\n<p>选择算法时，我们关心两件事：它有多快（时间复杂度），它吃多少内存（空间复杂度）。大 O 表示法就是用来描述这种「增长趋势」的语言。</p>\n<h2>为什么需要复杂度分析</h2>\n<p>同一道题，暴力解可能在 1 万条数据时还很轻松，到 100 万条时就完全跑不动。复杂度分析让我们在<strong>写代码之前</strong>就能判断方案是否可行。</p>\n<blockquote>\n<p>大 O 描述的是趋势，不是精确时间。常数因子在大规模数据面前往往可以忽略。</p>\n</blockquote>\n<h2>常见时间复杂度</h2>\n<table>\n<thead>\n<tr>\n<th>复杂度</th>\n<th>名称</th>\n<th>典型例子</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>O(1)</td>\n<td>常数</td>\n<td>哈希表查找</td>\n</tr>\n<tr>\n<td>O(log n)</td>\n<td>对数</td>\n<td>二分查找</td>\n</tr>\n<tr>\n<td>O(n)</td>\n<td>线性</td>\n<td>遍历数组</td>\n</tr>\n<tr>\n<td>O(n log n)</td>\n<td>线性对数</td>\n<td>归并排序、快排</td>\n</tr>\n<tr>\n<td>O(n²)</td>\n<td>平方</td>\n<td>双重循环、冒泡排序</td>\n</tr>\n</tbody></table>\n<h2>一个直观的例子</h2>\n<pre><code class=\"language-js\"><span class=\"token keyword\">function</span> <span class=\"token function\">findPair</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">arr<span class=\"token punctuation\">,</span> target</span><span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token keyword\">const</span> seen <span class=\"token operator\">=</span> <span class=\"token keyword\">new</span> <span class=\"token class-name\">Set</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span>\n  <span class=\"token keyword\">for</span> <span class=\"token punctuation\">(</span><span class=\"token keyword\">const</span> value <span class=\"token keyword\">of</span> arr<span class=\"token punctuation\">)</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token keyword\">const</span> need <span class=\"token operator\">=</span> target <span class=\"token operator\">-</span> value\n    <span class=\"token keyword\">if</span> <span class=\"token punctuation\">(</span>seen<span class=\"token punctuation\">.</span><span class=\"token function\">has</span><span class=\"token punctuation\">(</span>need<span class=\"token punctuation\">)</span><span class=\"token punctuation\">)</span> <span class=\"token keyword\">return</span> <span class=\"token punctuation\">[</span>need<span class=\"token punctuation\">,</span> value<span class=\"token punctuation\">]</span>\n    seen<span class=\"token punctuation\">.</span><span class=\"token function\">add</span><span class=\"token punctuation\">(</span>value<span class=\"token punctuation\">)</span>\n  <span class=\"token punctuation\">}</span>\n  <span class=\"token keyword\">return</span> <span class=\"token keyword\">null</span>\n<span class=\"token punctuation\">}</span>\n</code></pre><p>上面的解法用哈希表把两数之和从 <code>O(n²)</code> 降到 <code>O(n)</code>，代价是额外 <code>O(n)</code> 的空间。这是典型的「以空间换时间」。</p>\n<h2>空间复杂度</h2>\n<p>空间复杂度统计的是算法运行中<strong>额外</strong>使用的内存。递归调用会占用调用栈空间，这也是为什么深层递归可能导致栈溢出。</p>\n<h2>常见误区</h2>\n<ul>\n<li>不是所有双重循环都是 <code>O(n²)</code>：内层循环次数若与 <code>n</code> 无关，则另当别论；</li>\n<li>常数优化无法改变量级：把 <code>2n</code> 优化到 <code>n</code> 有意义，但量级没有变化；</li>\n<li>最好情况与最坏情况不同：排序算法常用最坏或平均情况来比较。</li>\n</ul>\n<h2>总结</h2>\n<p>掌握大 O 表示法，意味着你可以把「感觉很快」变成「可以证明」。在刷题和工程中，先确定数据规模，再选择合适量级的算法，是性价比最高的习惯。</p>\n"
  },
  {
    "slug": "computer-science-http-basics",
    "title": "HTTP 请求基础",
    "description": "理解请求与响应结构、常用方法、状态码与请求头，读懂浏览器与服务器之间的对话",
    "category": "计算机网络",
    "tags": [
      "HTTP",
      "Network",
      "Web"
    ],
    "date": "2026-09-16",
    "updated": "2026-09-16",
    "featured": true,
    "readingTime": 1,
    "headings": [
      {
        "id": "请求与响应结构",
        "text": "请求与响应结构",
        "level": 2
      },
      {
        "id": "常用方法",
        "text": "常用方法",
        "level": 2
      },
      {
        "id": "状态码",
        "text": "状态码",
        "level": 2
      },
      {
        "id": "常用请求头",
        "text": "常用请求头",
        "level": 2
      },
      {
        "id": "https-与-http2",
        "text": "HTTPS 与 HTTP/2",
        "level": 2
      },
      {
        "id": "总结",
        "text": "总结",
        "level": 2
      }
    ],
    "plainText": "HTTP 请求基础 HTTP（HyperText Transfer Protocol）是 Web 的基石。浏览器输入一个地址、页面加载、接口调用，背后都是 HTTP 请求与响应。 请求与响应结构 一次 HTTP 交互由 请求 与 响应 组成。请求通常包含： 请求行 ：方法、路径、协议版本； 请求头 ：附加信息，如 Host 、 Accept 、 Content-Type ； 请求体 ：可选，常见于 POST 、 PUT 。 响应则包含 状态行 、 响应头 与 响应体 。 GET /api/posts HTTP/1.1 Host: example.com Accept: application/json 常用方法 方法 语义 是否安全 是否幂等 GET 获取资源 是 是 POST 创建资源 否 否 PUT 整体替换资源 否 是 PATCH 部分更新资源 否 否 DELETE 删除资源 否 是 安全 意味着不改变服务端状态， 幂等 意味着重复执行结果一致。理解这两个属性，有助于设计出语义正确的接口。 状态码 2xx 成功 ： 200 OK 、 201 Created 、 204 No Content ； 3xx 重定向 ： 301 Moved Permanently 、 304 Not Modified ； 4xx 客户端错误 ： 400 Bad Request 、 401 Unauthorized 、 404 Not Found ； 5xx 服务端错误 ： 500 Internal Server Error 、 503 Service Unavailable 。 状态码是结果的第一信号。调试接口时，先看状态码，再读响应体，通常能少走很多弯路。 常用请求头 Content-Type ：声明请求体的媒体类型，如 application/json ； Authorization ：携带认证信息； Cache-Control ：控制缓存策略； User-Agent ：标识客户端； Accept ：声明客户端能处理的响应类型。 HTTPS 与 HTTP/2 HTTPS 在 HTTP 之下加入 TLS 加密层，提供机密性、完整性与身份认证。HTTP/2 则通过多路复用、头部压缩与服务器推送大幅提升传输效率，如今已是主流站点的默认选择。 总结 HTTP 的知识点并不复杂，却贯穿整个 Web 开发。记住「方法 + 路径 + 头 + 状态码」这条主线，就能读懂绝大多数接口文档与抓包结果。",
    "html": "<h1>HTTP 请求基础</h1>\n<p>HTTP（HyperText Transfer Protocol）是 Web 的基石。浏览器输入一个地址、页面加载、接口调用，背后都是 HTTP 请求与响应。</p>\n<h2>请求与响应结构</h2>\n<p>一次 HTTP 交互由<strong>请求</strong>与<strong>响应</strong>组成。请求通常包含：</p>\n<ul>\n<li><strong>请求行</strong>：方法、路径、协议版本；</li>\n<li><strong>请求头</strong>：附加信息，如 <code>Host</code>、<code>Accept</code>、<code>Content-Type</code>；</li>\n<li><strong>请求体</strong>：可选，常见于 <code>POST</code>、<code>PUT</code>。</li>\n</ul>\n<p>响应则包含<strong>状态行</strong>、<strong>响应头</strong>与<strong>响应体</strong>。</p>\n<pre><code class=\"language-http\">GET /api/posts HTTP/1.1\nHost: example.com\nAccept: application/json\n</code></pre><h2>常用方法</h2>\n<table>\n<thead>\n<tr>\n<th>方法</th>\n<th>语义</th>\n<th>是否安全</th>\n<th>是否幂等</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>GET</td>\n<td>获取资源</td>\n<td>是</td>\n<td>是</td>\n</tr>\n<tr>\n<td>POST</td>\n<td>创建资源</td>\n<td>否</td>\n<td>否</td>\n</tr>\n<tr>\n<td>PUT</td>\n<td>整体替换资源</td>\n<td>否</td>\n<td>是</td>\n</tr>\n<tr>\n<td>PATCH</td>\n<td>部分更新资源</td>\n<td>否</td>\n<td>否</td>\n</tr>\n<tr>\n<td>DELETE</td>\n<td>删除资源</td>\n<td>否</td>\n<td>是</td>\n</tr>\n</tbody></table>\n<p><strong>安全</strong>意味着不改变服务端状态，<strong>幂等</strong>意味着重复执行结果一致。理解这两个属性，有助于设计出语义正确的接口。</p>\n<h2>状态码</h2>\n<ul>\n<li><strong>2xx 成功</strong>：<code>200 OK</code>、<code>201 Created</code>、<code>204 No Content</code>；</li>\n<li><strong>3xx 重定向</strong>：<code>301 Moved Permanently</code>、<code>304 Not Modified</code>；</li>\n<li><strong>4xx 客户端错误</strong>：<code>400 Bad Request</code>、<code>401 Unauthorized</code>、<code>404 Not Found</code>；</li>\n<li><strong>5xx 服务端错误</strong>：<code>500 Internal Server Error</code>、<code>503 Service Unavailable</code>。</li>\n</ul>\n<blockquote>\n<p>状态码是结果的第一信号。调试接口时，先看状态码，再读响应体，通常能少走很多弯路。</p>\n</blockquote>\n<h2>常用请求头</h2>\n<ul>\n<li><code>Content-Type</code>：声明请求体的媒体类型，如 <code>application/json</code>；</li>\n<li><code>Authorization</code>：携带认证信息；</li>\n<li><code>Cache-Control</code>：控制缓存策略；</li>\n<li><code>User-Agent</code>：标识客户端；</li>\n<li><code>Accept</code>：声明客户端能处理的响应类型。</li>\n</ul>\n<h2>HTTPS 与 HTTP/2</h2>\n<p>HTTPS 在 HTTP 之下加入 TLS 加密层，提供机密性、完整性与身份认证。HTTP/2 则通过多路复用、头部压缩与服务器推送大幅提升传输效率，如今已是主流站点的默认选择。</p>\n<h2>总结</h2>\n<p>HTTP 的知识点并不复杂，却贯穿整个 Web 开发。记住「方法 + 路径 + 头 + 状态码」这条主线，就能读懂绝大多数接口文档与抓包结果。</p>\n"
  },
  {
    "slug": "frontend-css-grid-complete-guide",
    "title": "CSS Grid 布局完全指南",
    "description": "从轨道、网格线与 fr 单位入手，掌握 CSS Grid 的核心概念与常见布局模式",
    "category": "前端",
    "tags": [
      "CSS",
      "Layout",
      "Frontend"
    ],
    "date": "2026-09-16",
    "updated": "2026-09-16",
    "featured": true,
    "readingTime": 2,
    "headings": [
      {
        "id": "grid-容器与项目",
        "text": "Grid 容器与项目",
        "level": 2
      },
      {
        "id": "理解-fr-单位",
        "text": "理解 fr 单位",
        "level": 2
      },
      {
        "id": "网格线与区域",
        "text": "网格线与区域",
        "level": 2
      },
      {
        "id": "常见布局模式",
        "text": "常见布局模式",
        "level": 2
      },
      {
        "id": "圣杯布局",
        "text": "圣杯布局",
        "level": 3
      },
      {
        "id": "响应式卡片墙",
        "text": "响应式卡片墙",
        "level": 3
      },
      {
        "id": "对齐与间距",
        "text": "对齐与间距",
        "level": 2
      },
      {
        "id": "总结",
        "text": "总结",
        "level": 2
      }
    ],
    "plainText": "CSS Grid 布局完全指南 CSS Grid 是目前最强大的二维布局系统。它让「先设计行与列，再放置元素」成为可能，非常适合页面骨架、卡片墙与仪表盘布局。 Grid 容器与项目 设置 display: grid 后，元素成为 网格容器 ，其直接子元素成为 网格项目 。容器上定义轨道，项目默认按顺序自动流入单元格。 .container { display : grid ; grid-template-columns : 200px 1fr 1fr ; gap : 16px ; } 上面的代码创建了三列：第一列固定 200px ，后两列平分剩余空间。 理解 fr 单位 fr （fraction）表示「一份剩余空间」。与百分比不同，它是在扣除固定尺寸与间距之后再分配，因此更稳定。 .grid { display : grid ; grid-template-columns : repeat ( 3 , 1fr ) ; } repeat(3, 1fr) 等价于 1fr 1fr 1fr ，是等宽三列的惯用写法。 网格线与区域 每条轨道之间都有编号的 网格线 。借助 grid-column 与 grid-row ，可以让项目跨越多条轨道： .hero { grid-column : 1 / -1 ; /* 横跨整行 */ } .sidebar { grid-row : 1 / 3 ; /* 纵向跨越两行 */ } -1 指向最后一条网格线，常用于「通栏」布局。 常见布局模式 圣杯布局 .layout { display : grid ; grid-template-columns : 240px 1fr 240px ; grid-template-areas : 'header header header' 'sidebar main aside' 'footer footer footer' ; min-height : 100vh ; } 使用 grid-template-areas 后，每个项目只需声明 grid-area 即可落位，语义清晰、易于维护。 响应式卡片墙 .cards { display : grid ; grid-template-columns : repeat ( auto-fill , minmax ( 280px , 1fr ) ) ; gap : 20px ; } auto-fill 配合 minmax() 会根据容器宽度自动计算列数，无需任何媒体查询即可在手机与桌面之间平滑切换。 对齐与间距 justify-content / align-content ：控制整个网格在容器内的对齐； justify-items / align-items ：控制项目在各自单元格内的对齐； gap ：同时设置行间距与列间距。 总结 Grid 适合「整体骨架」，Flexbox 适合「局部一维排列」。二者组合使用，能覆盖绝大多数布局需求。建议从 grid-template-columns 、 fr 与 minmax() 这三个概念开始练习，它们能解决 80% 的日常布局问题。",
    "html": "<h1>CSS Grid 布局完全指南</h1>\n<p>CSS Grid 是目前最强大的二维布局系统。它让「先设计行与列，再放置元素」成为可能，非常适合页面骨架、卡片墙与仪表盘布局。</p>\n<h2>Grid 容器与项目</h2>\n<p>设置 <code>display: grid</code> 后，元素成为<strong>网格容器</strong>，其直接子元素成为<strong>网格项目</strong>。容器上定义轨道，项目默认按顺序自动流入单元格。</p>\n<pre><code class=\"language-css\"><span class=\"token selector\">.container</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">display</span><span class=\"token punctuation\">:</span> grid<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">grid-template-columns</span><span class=\"token punctuation\">:</span> 200px 1fr 1fr<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">gap</span><span class=\"token punctuation\">:</span> 16px<span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span>\n</code></pre><p>上面的代码创建了三列：第一列固定 <code>200px</code>，后两列平分剩余空间。</p>\n<h2>理解 fr 单位</h2>\n<p><code>fr</code>（fraction）表示「一份剩余空间」。与百分比不同，它是在扣除固定尺寸与间距之后再分配，因此更稳定。</p>\n<pre><code class=\"language-css\"><span class=\"token selector\">.grid</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">display</span><span class=\"token punctuation\">:</span> grid<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">grid-template-columns</span><span class=\"token punctuation\">:</span> <span class=\"token function\">repeat</span><span class=\"token punctuation\">(</span>3<span class=\"token punctuation\">,</span> 1fr<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span>\n</code></pre><p><code>repeat(3, 1fr)</code> 等价于 <code>1fr 1fr 1fr</code>，是等宽三列的惯用写法。</p>\n<h2>网格线与区域</h2>\n<p>每条轨道之间都有编号的<strong>网格线</strong>。借助 <code>grid-column</code> 与 <code>grid-row</code>，可以让项目跨越多条轨道：</p>\n<pre><code class=\"language-css\"><span class=\"token selector\">.hero</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">grid-column</span><span class=\"token punctuation\">:</span> 1 / -1<span class=\"token punctuation\">;</span> <span class=\"token comment\">/* 横跨整行 */</span>\n<span class=\"token punctuation\">}</span>\n<span class=\"token selector\">.sidebar</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">grid-row</span><span class=\"token punctuation\">:</span> 1 / 3<span class=\"token punctuation\">;</span> <span class=\"token comment\">/* 纵向跨越两行 */</span>\n<span class=\"token punctuation\">}</span>\n</code></pre><p><code>-1</code> 指向最后一条网格线，常用于「通栏」布局。</p>\n<h2>常见布局模式</h2>\n<h3>圣杯布局</h3>\n<pre><code class=\"language-css\"><span class=\"token selector\">.layout</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">display</span><span class=\"token punctuation\">:</span> grid<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">grid-template-columns</span><span class=\"token punctuation\">:</span> 240px 1fr 240px<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">grid-template-areas</span><span class=\"token punctuation\">:</span>\n    <span class=\"token string\">'header header header'</span>\n    <span class=\"token string\">'sidebar main aside'</span>\n    <span class=\"token string\">'footer footer footer'</span><span class=\"token punctuation\">;</span>\n  <span class=\"token property\">min-height</span><span class=\"token punctuation\">:</span> 100vh<span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span>\n</code></pre><p>使用 <code>grid-template-areas</code> 后，每个项目只需声明 <code>grid-area</code> 即可落位，语义清晰、易于维护。</p>\n<h3>响应式卡片墙</h3>\n<pre><code class=\"language-css\"><span class=\"token selector\">.cards</span> <span class=\"token punctuation\">{</span>\n  <span class=\"token property\">display</span><span class=\"token punctuation\">:</span> grid<span class=\"token punctuation\">;</span>\n  <span class=\"token property\">grid-template-columns</span><span class=\"token punctuation\">:</span> <span class=\"token function\">repeat</span><span class=\"token punctuation\">(</span>auto-fill<span class=\"token punctuation\">,</span> <span class=\"token function\">minmax</span><span class=\"token punctuation\">(</span>280px<span class=\"token punctuation\">,</span> 1fr<span class=\"token punctuation\">)</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n  <span class=\"token property\">gap</span><span class=\"token punctuation\">:</span> 20px<span class=\"token punctuation\">;</span>\n<span class=\"token punctuation\">}</span>\n</code></pre><p><code>auto-fill</code> 配合 <code>minmax()</code> 会根据容器宽度自动计算列数，无需任何媒体查询即可在手机与桌面之间平滑切换。</p>\n<h2>对齐与间距</h2>\n<ul>\n<li><code>justify-content</code> / <code>align-content</code>：控制整个网格在容器内的对齐；</li>\n<li><code>justify-items</code> / <code>align-items</code>：控制项目在各自单元格内的对齐；</li>\n<li><code>gap</code>：同时设置行间距与列间距。</li>\n</ul>\n<h2>总结</h2>\n<p>Grid 适合「整体骨架」，Flexbox 适合「局部一维排列」。二者组合使用，能覆盖绝大多数布局需求。建议从 <code>grid-template-columns</code>、<code>fr</code> 与 <code>minmax()</code> 这三个概念开始练习，它们能解决 80% 的日常布局问题。</p>\n"
  },
  {
    "slug": "javascript-understanding-javascript-event-loop",
    "title": "理解 JavaScript Event Loop",
    "description": "从调用栈、宏任务与微任务的角度，梳理浏览器事件循环如何调度 JavaScript 异步代码",
    "category": "JavaScript",
    "tags": [
      "JavaScript",
      "Async",
      "Browser"
    ],
    "date": "2026-09-16",
    "updated": "2026-09-16",
    "featured": true,
    "readingTime": 2,
    "headings": [
      {
        "id": "为什么需要-event-loop",
        "text": "为什么需要 Event Loop",
        "level": 2
      },
      {
        "id": "调用栈与任务队列",
        "text": "调用栈与任务队列",
        "level": 2
      },
      {
        "id": "宏任务与微任务",
        "text": "宏任务与微任务",
        "level": 2
      },
      {
        "id": "一段代码看执行顺序",
        "text": "一段代码看执行顺序",
        "level": 2
      },
      {
        "id": "浏览器渲染与事件循环",
        "text": "浏览器渲染与事件循环",
        "level": 2
      },
      {
        "id": "总结",
        "text": "总结",
        "level": 2
      }
    ],
    "plainText": "理解 JavaScript Event Loop JavaScript 是单线程语言，却能在浏览器里同时处理网络请求、定时器与用户交互。让这一切成为可能的，正是 事件循环（Event Loop） 与它背后的任务调度机制。 为什么需要 Event Loop JavaScript 引擎一次只能执行一段同步代码。如果某个操作需要等待（例如网络响应），直接阻塞主线程会让页面完全卡死。浏览器解决这个问题的方式是：把耗时操作交给宿主环境（如浏览器或 Node.js），主线程继续执行后续代码，等异步结果就绪后再通过回调回到主线程。 事件循环不是语言本身的一部分，而是宿主环境为 JavaScript 提供的调度机制。 调用栈与任务队列 调用栈（Call Stack） ：记录当前正在执行的函数。栈为空时，事件循环才会取下一个任务。 任务队列（Task Queue） ：存放等待执行的宏任务（如 setTimeout 回调、事件回调）。 微任务队列（Microtask Queue） ：存放 Promise.then 、 queueMicrotask 等微任务，优先级高于宏任务。 每一轮事件循环大致遵循以下步骤： 从宏任务队列取出一个任务执行； 执行过程中产生的微任务依次清空； 浏览器在合适时机更新渲染； 进入下一轮循环。 宏任务与微任务 类型 常见来源 执行时机 宏任务 setTimeout 、 setInterval 、I/O、UI 事件 每轮循环执行一个 微任务 Promise.then/catch/finally 、 queueMicrotask 当前任务结束后、渲染前清空 微任务可以插队：即使它是在本轮循环中途才加入，也会在渲染之前被执行完。 一段代码看执行顺序 console . log ( '1: 同步开始' ) setTimeout ( ( ) => { console . log ( '4: 宏任务 setTimeout' ) } , 0 ) Promise . resolve ( ) . then ( ( ) => { console . log ( '3: 微任务 Promise' ) } ) console . log ( '2: 同步结束' ) 输出顺序是 1 → 2 → 3 → 4 。原因是同步代码先全部执行，之后微任务队列被清空，最后才轮到宏任务队列里的 setTimeout 。 浏览器渲染与事件循环 浏览器并非每执行完一个宏任务就立刻渲染。它会在一次事件循环中完成「取宏任务 → 清空微任务 → 判断是否需要渲染」的过程，再决定是否更新页面。 这也解释了为什么在同一个宏任务里连续修改 DOM 多次，浏览器通常只进行一次渲染——渲染时机由事件循环统一调度。 总结 同步代码优先，调用栈清空后事件循环才介入； 微任务优先于宏任务，且在渲染前清空； setTimeout(0) 不代表立即执行，只是尽快把回调放入宏任务队列； 理解事件循环，是写出可预测异步代码的基础。 掌握这套机制后，再看 async/await 、 requestAnimationFrame 与 queueMicrotask 的差别，就会清晰很多。",
    "html": "<h1>理解 JavaScript Event Loop</h1>\n<p>JavaScript 是单线程语言，却能在浏览器里同时处理网络请求、定时器与用户交互。让这一切成为可能的，正是 <strong>事件循环（Event Loop）</strong> 与它背后的任务调度机制。</p>\n<h2>为什么需要 Event Loop</h2>\n<p>JavaScript 引擎一次只能执行一段同步代码。如果某个操作需要等待（例如网络响应），直接阻塞主线程会让页面完全卡死。浏览器解决这个问题的方式是：把耗时操作交给宿主环境（如浏览器或 Node.js），主线程继续执行后续代码，等异步结果就绪后再通过回调回到主线程。</p>\n<blockquote>\n<p>事件循环不是语言本身的一部分，而是宿主环境为 JavaScript 提供的调度机制。</p>\n</blockquote>\n<h2>调用栈与任务队列</h2>\n<ul>\n<li><strong>调用栈（Call Stack）</strong>：记录当前正在执行的函数。栈为空时，事件循环才会取下一个任务。</li>\n<li><strong>任务队列（Task Queue）</strong>：存放等待执行的宏任务（如 <code>setTimeout</code> 回调、事件回调）。</li>\n<li><strong>微任务队列（Microtask Queue）</strong>：存放 <code>Promise.then</code>、<code>queueMicrotask</code> 等微任务，优先级高于宏任务。</li>\n</ul>\n<p>每一轮事件循环大致遵循以下步骤：</p>\n<ol>\n<li>从宏任务队列取出一个任务执行；</li>\n<li>执行过程中产生的微任务依次清空；</li>\n<li>浏览器在合适时机更新渲染；</li>\n<li>进入下一轮循环。</li>\n</ol>\n<h2>宏任务与微任务</h2>\n<table>\n<thead>\n<tr>\n<th>类型</th>\n<th>常见来源</th>\n<th>执行时机</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>宏任务</td>\n<td><code>setTimeout</code>、<code>setInterval</code>、I/O、UI 事件</td>\n<td>每轮循环执行一个</td>\n</tr>\n<tr>\n<td>微任务</td>\n<td><code>Promise.then/catch/finally</code>、<code>queueMicrotask</code></td>\n<td>当前任务结束后、渲染前清空</td>\n</tr>\n</tbody></table>\n<p>微任务可以插队：即使它是在本轮循环中途才加入，也会在渲染之前被执行完。</p>\n<h2>一段代码看执行顺序</h2>\n<pre><code class=\"language-js\">console<span class=\"token punctuation\">.</span><span class=\"token function\">log</span><span class=\"token punctuation\">(</span><span class=\"token string\">'1: 同步开始'</span><span class=\"token punctuation\">)</span>\n\n<span class=\"token function\">setTimeout</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token operator\">=></span> <span class=\"token punctuation\">{</span>\n  console<span class=\"token punctuation\">.</span><span class=\"token function\">log</span><span class=\"token punctuation\">(</span><span class=\"token string\">'4: 宏任务 setTimeout'</span><span class=\"token punctuation\">)</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">,</span> <span class=\"token number\">0</span><span class=\"token punctuation\">)</span>\n\nPromise<span class=\"token punctuation\">.</span><span class=\"token function\">resolve</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span><span class=\"token punctuation\">.</span><span class=\"token function\">then</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">(</span><span class=\"token punctuation\">)</span> <span class=\"token operator\">=></span> <span class=\"token punctuation\">{</span>\n  console<span class=\"token punctuation\">.</span><span class=\"token function\">log</span><span class=\"token punctuation\">(</span><span class=\"token string\">'3: 微任务 Promise'</span><span class=\"token punctuation\">)</span>\n<span class=\"token punctuation\">}</span><span class=\"token punctuation\">)</span>\n\nconsole<span class=\"token punctuation\">.</span><span class=\"token function\">log</span><span class=\"token punctuation\">(</span><span class=\"token string\">'2: 同步结束'</span><span class=\"token punctuation\">)</span>\n</code></pre><p>输出顺序是 <code>1 → 2 → 3 → 4</code>。原因是同步代码先全部执行，之后微任务队列被清空，最后才轮到宏任务队列里的 <code>setTimeout</code>。</p>\n<h2>浏览器渲染与事件循环</h2>\n<p>浏览器并非每执行完一个宏任务就立刻渲染。它会在一次事件循环中完成「取宏任务 → 清空微任务 → 判断是否需要渲染」的过程，再决定是否更新页面。</p>\n<p>这也解释了为什么在同一个宏任务里连续修改 DOM 多次，浏览器通常只进行一次渲染——渲染时机由事件循环统一调度。</p>\n<h2>总结</h2>\n<ul>\n<li>同步代码优先，调用栈清空后事件循环才介入；</li>\n<li>微任务优先于宏任务，且在渲染前清空；</li>\n<li><code>setTimeout(0)</code> 不代表立即执行，只是尽快把回调放入宏任务队列；</li>\n<li>理解事件循环，是写出可预测异步代码的基础。</li>\n</ul>\n<p>掌握这套机制后，再看 <code>async/await</code>、<code>requestAnimationFrame</code> 与 <code>queueMicrotask</code> 的差别，就会清晰很多。</p>\n"
  },
  {
    "slug": "mathematics-vectors-and-matrices",
    "title": "向量与矩阵：机器学习的基础语言",
    "description": "从向量的几何意义与矩阵乘法入手，建立线性代数与数据表示之间的直觉",
    "category": "数学",
    "tags": [
      "线性代数",
      "数学",
      "Machine Learning"
    ],
    "date": "2026-09-16",
    "updated": "2026-09-16",
    "featured": false,
    "readingTime": 1,
    "headings": [
      {
        "id": "向量是什么",
        "text": "向量是什么",
        "level": 2
      },
      {
        "id": "线性组合与基",
        "text": "线性组合与基",
        "level": 2
      },
      {
        "id": "矩阵乘法",
        "text": "矩阵乘法",
        "level": 2
      },
      {
        "id": "线性变换的视角",
        "text": "线性变换的视角",
        "level": 2
      },
      {
        "id": "在机器学习中的角色",
        "text": "在机器学习中的角色",
        "level": 2
      },
      {
        "id": "总结",
        "text": "总结",
        "level": 2
      }
    ],
    "plainText": "向量与矩阵：机器学习的基础语言 在机器学习中，数据通常被组织成向量与矩阵。理解它们，不只是为了会算，更是为了建立 几何直觉 。 向量是什么 向量可以看作一组有序的数字，也可以看作空间中的一个箭头。一个样本的特征常被写成一个行向量： sample = [ 5.1 , 3.5 , 1.4 , 0.2 ] # 鸢尾花的一条记录 从几何视角看，向量有 长度 与 方向 。两个向量的点积越大，它们的方向越接近——这正是很多相似度计算的核心。 线性组合与基 给定一组向量，对它们做「数乘再相加」，得到的就是 线性组合 。如果一组向量能线性组合出空间中的任意向量，它们就构成一组 基 。 线性代数的很多结论，本质上都在回答同一个问题：这组向量能张成多大的空间？ 矩阵乘法 矩阵乘法的每一格，都是「左矩阵的行」与「右矩阵的列」的点积。它同时完成了 变换 与 组合 两件事。 import numpy as np A = np . array ( [ [ 1 , 2 ] , [ 3 , 4 ] ] ) B = np . array ( [ [ 5 , 6 ] , [ 7 , 8 ] ] ) C = A @ B # [[19, 22], # [43, 50]] 注意：矩阵乘法不满足交换律， A @ B 与 B @ A 通常不同。 线性变换的视角 把矩阵看作一个 函数 ：输入一个向量，输出一个新向量。矩阵乘向量，就是对空间做一次「拉伸、旋转或投影」。神经网络的每一层，本质上就是对前一层的向量做一次线性变换，再加上非线性激活。 在机器学习中的角色 数据矩阵 ：每一行是一个样本，每一列是一个特征； 权重矩阵 ：定义层与层之间的变换； 协方差矩阵 ：描述特征之间的相关关系； 奇异值分解 ：用于降维与推荐系统。 总结 学习线性代数时，不要只停留在计算。多问「这个运算在空间中做了什么」，几何直觉建立起来之后，很多公式会变得自然。",
    "html": "<h1>向量与矩阵：机器学习的基础语言</h1>\n<p>在机器学习中，数据通常被组织成向量与矩阵。理解它们，不只是为了会算，更是为了建立<strong>几何直觉</strong>。</p>\n<h2>向量是什么</h2>\n<p>向量可以看作一组有序的数字，也可以看作空间中的一个箭头。一个样本的特征常被写成一个行向量：</p>\n<pre><code class=\"language-python\">sample <span class=\"token operator\">=</span> <span class=\"token punctuation\">[</span><span class=\"token number\">5.1</span><span class=\"token punctuation\">,</span> <span class=\"token number\">3.5</span><span class=\"token punctuation\">,</span> <span class=\"token number\">1.4</span><span class=\"token punctuation\">,</span> <span class=\"token number\">0.2</span><span class=\"token punctuation\">]</span>  <span class=\"token comment\"># 鸢尾花的一条记录</span>\n</code></pre><p>从几何视角看，向量有<strong>长度</strong>与<strong>方向</strong>。两个向量的点积越大，它们的方向越接近——这正是很多相似度计算的核心。</p>\n<h2>线性组合与基</h2>\n<p>给定一组向量，对它们做「数乘再相加」，得到的就是<strong>线性组合</strong>。如果一组向量能线性组合出空间中的任意向量，它们就构成一组<strong>基</strong>。</p>\n<blockquote>\n<p>线性代数的很多结论，本质上都在回答同一个问题：这组向量能张成多大的空间？</p>\n</blockquote>\n<h2>矩阵乘法</h2>\n<p>矩阵乘法的每一格，都是「左矩阵的行」与「右矩阵的列」的点积。它同时完成了<strong>变换</strong>与<strong>组合</strong>两件事。</p>\n<pre><code class=\"language-python\"><span class=\"token keyword\">import</span> numpy <span class=\"token keyword\">as</span> np\n\nA <span class=\"token operator\">=</span> np<span class=\"token punctuation\">.</span>array<span class=\"token punctuation\">(</span><span class=\"token punctuation\">[</span><span class=\"token punctuation\">[</span><span class=\"token number\">1</span><span class=\"token punctuation\">,</span> <span class=\"token number\">2</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n              <span class=\"token punctuation\">[</span><span class=\"token number\">3</span><span class=\"token punctuation\">,</span> <span class=\"token number\">4</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">)</span>\nB <span class=\"token operator\">=</span> np<span class=\"token punctuation\">.</span>array<span class=\"token punctuation\">(</span><span class=\"token punctuation\">[</span><span class=\"token punctuation\">[</span><span class=\"token number\">5</span><span class=\"token punctuation\">,</span> <span class=\"token number\">6</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">,</span>\n              <span class=\"token punctuation\">[</span><span class=\"token number\">7</span><span class=\"token punctuation\">,</span> <span class=\"token number\">8</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">]</span><span class=\"token punctuation\">)</span>\n\nC <span class=\"token operator\">=</span> A @ B\n<span class=\"token comment\"># [[19, 22],</span>\n<span class=\"token comment\">#  [43, 50]]</span>\n</code></pre><p>注意：矩阵乘法不满足交换律，<code>A @ B</code> 与 <code>B @ A</code> 通常不同。</p>\n<h2>线性变换的视角</h2>\n<p>把矩阵看作一个<strong>函数</strong>：输入一个向量，输出一个新向量。矩阵乘向量，就是对空间做一次「拉伸、旋转或投影」。神经网络的每一层，本质上就是对前一层的向量做一次线性变换，再加上非线性激活。</p>\n<h2>在机器学习中的角色</h2>\n<ul>\n<li><strong>数据矩阵</strong>：每一行是一个样本，每一列是一个特征；</li>\n<li><strong>权重矩阵</strong>：定义层与层之间的变换；</li>\n<li><strong>协方差矩阵</strong>：描述特征之间的相关关系；</li>\n<li><strong>奇异值分解</strong>：用于降维与推荐系统。</li>\n</ul>\n<h2>总结</h2>\n<p>学习线性代数时，不要只停留在计算。多问「这个运算在空间中做了什么」，几何直觉建立起来之后，很多公式会变得自然。</p>\n"
  }
]

export const categories: CategoryInfo[] = [
  {
    "name": "计算机科学",
    "count": 1
  },
  {
    "name": "计算机网络",
    "count": 1
  },
  {
    "name": "前端",
    "count": 1
  },
  {
    "name": "数学",
    "count": 1
  },
  {
    "name": "JavaScript",
    "count": 1
  }
]

export const tags: TagInfo[] = [
  {
    "name": "复杂度",
    "count": 1
  },
  {
    "name": "数学",
    "count": 1
  },
  {
    "name": "线性代数",
    "count": 1
  },
  {
    "name": "Algorithm",
    "count": 1
  },
  {
    "name": "Async",
    "count": 1
  },
  {
    "name": "Browser",
    "count": 1
  },
  {
    "name": "Computer Science",
    "count": 1
  },
  {
    "name": "CSS",
    "count": 1
  },
  {
    "name": "Frontend",
    "count": 1
  },
  {
    "name": "HTTP",
    "count": 1
  },
  {
    "name": "JavaScript",
    "count": 1
  },
  {
    "name": "Layout",
    "count": 1
  },
  {
    "name": "Machine Learning",
    "count": 1
  },
  {
    "name": "Network",
    "count": 1
  },
  {
    "name": "Web",
    "count": 1
  }
]
