export const formatCurrency = (
  amountInKobo: number,
  currency: string = "NGN"
) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amountInKobo); // Convert kobo to naira
};
