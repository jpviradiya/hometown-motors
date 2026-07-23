/**
 * Formats a numeric price value into USD currency format (e.g. $25,000)
 */
export function formatCurrency(
  amount: number | string,
  currency: string = "USD",
  maximumFractionDigits: number = 0
): string {
  const numericAmount = typeof amount === "string" ? Number(amount) : amount;
  
  if (isNaN(numericAmount)) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits,
  }).format(numericAmount);
}

export default formatCurrency;
