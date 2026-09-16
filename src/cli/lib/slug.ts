/**
 * 生成 slug：保留 Unicode 字母与数字，其余字符转为连字符。
 * 与网站 scripts/generate-content.mjs 中的 slugify 行为保持一致。
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[`*_~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
}
