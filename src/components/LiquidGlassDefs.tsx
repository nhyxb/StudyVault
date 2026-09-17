/**
 * 液态玻璃的全局 SVG 滤镜定义（#lg-refract），供 global.css 中
 * `.liquid-glass::after` 的 backdrop-filter: url(#lg-refract) 引用。
 *
 * 边缘折射原理：
 * - 两张 feImage 位移贴图（水平 / 垂直各一张）：中心为中性灰 rgb(128,128,128)
 *   （feDisplacementMap 中 0.5 = 不位移），越靠近面板边缘通道值越偏向 0/255，
 *   位移量线性增大，使背景在玻璃边缘处向外“弯折”。
 * - 两级 feDisplacementMap 串联：第一级只做水平位移（R 通道），
 *   第二级只做垂直位移（G 通道），四角自然叠加出斜向折射。
 * - 贴图以 objectBoundingBox 拉伸到每个面板自身尺寸，因此任意大小的
 *   玻璃面板共用同一个滤镜。
 * 不支持 url() 滤镜或 feImage 的浏览器会自动回退到 CSS 中声明的普通模糊边缘。
 */

const NEUTRAL = 'rgb(128,128,128)'

function edgeMap(vertical: boolean): string {
  const hi = vertical ? 'rgb(128,255,128)' : 'rgb(255,128,128)'
  const lo = vertical ? 'rgb(128,0,128)' : 'rgb(0,128,128)'
  const axis = vertical ? "x1='0' y1='0' x2='0' y2='1'" : "x1='0' y1='0' x2='1' y2='0'"
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>` +
    `<defs><linearGradient id='g' ${axis}>` +
    `<stop offset='0' stop-color='${hi}'/>` +
    `<stop offset='0.09' stop-color='${NEUTRAL}'/>` +
    `<stop offset='0.91' stop-color='${NEUTRAL}'/>` +
    `<stop offset='1' stop-color='${lo}'/>` +
    `</linearGradient></defs>` +
    `<rect width='256' height='256' fill='url(#g)'/></svg>`
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

const H_MAP = edgeMap(false)
const V_MAP = edgeMap(true)

export default function LiquidGlassDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <filter
          id="lg-refract"
          colorInterpolationFilters="sRGB"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
        >
          <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="lg-h" href={H_MAP} />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lg-h"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="lg-d1"
          />
          <feImage x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="lg-v" href={V_MAP} />
          <feDisplacementMap in="lg-d1" in2="lg-v" scale="18" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}
