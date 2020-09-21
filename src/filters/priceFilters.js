export function priceFormat(value) {
  return value ? `${value.toFixed(2)} €` : ''
}