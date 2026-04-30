export const formatDateTime = (value: string): string => {
  const date = new Date(value);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

export const formatPrice = (value: number): string => {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value);
};
