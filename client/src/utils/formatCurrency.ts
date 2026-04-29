export const formatILS = (price: number | string | null | undefined): string => {
  if (price === null || price === undefined || price === "") {
    return "Free";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "Free";
  }

  if (numericPrice === 0) {
    return "Free";
  }

  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(numericPrice);
};
