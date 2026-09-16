const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR

function paint(open: string, close: string) {
  return (text: string) => (useColor ? `\u001b[${open}m${text}\u001b[${close}m` : text)
}

export const color = {
  green: paint('32', '39'),
  red: paint('31', '39'),
  yellow: paint('33', '39'),
  cyan: paint('36', '39'),
  gray: paint('90', '39'),
  bold: paint('1', '22'),
}

export function ensureTTY(what: string): void {
  if (!process.stdin.isTTY) {
    throw new Error(`需要交互式终端：${what}（请使用命令行参数补齐，或通过 --help 查看用法）`)
  }
}

export function success(message: string): void {
  console.log(`${color.green('✓')} ${message}`)
}

export function error(message: string): void {
  console.error(`${color.red('✗')} ${message}`)
}

export function warn(message: string): void {
  console.error(`${color.yellow('!')} ${message}`)
}

export function info(message: string): void {
  console.log(`${color.cyan('ℹ')} ${message}`)
}

const wideChar =
  /[\u1100-\u115f\u2e80-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe30-\ufe4f\uff00-\uff60\uffe0-\uffe6]/

export function displayWidth(text: string): number {
  let width = 0
  for (const char of text) {
    width += wideChar.test(char) ? 2 : 1
  }
  return width
}

function pad(text: string, width: number): string {
  return `${text}${' '.repeat(Math.max(0, width - displayWidth(text)))}`
}

export function printTable(headers: string[], rows: string[][]): void {
  const widths = headers.map((header, index) =>
    Math.max(displayWidth(header), ...rows.map((row) => displayWidth(row[index] ?? ''))),
  )
  console.log(headers.map((header, index) => pad(header, widths[index])).join('  '))
  for (const row of rows) {
    console.log(row.map((cell, index) => pad(cell, widths[index])).join('  '))
  }
}
