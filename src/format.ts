const rub = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 })

export function formatRub(value: number) {
  return `${rub.format(value)} ₽`
}
