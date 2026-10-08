const formateurPrix = new Intl.NumberFormat('fr-BE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

export function formaterPrix(montant) {
  return formateurPrix.format(montant)
}
