export const toDateInputValue = (value: Date | string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
};

export const isSameDate = (a: Date | string, b: Date | string): boolean => {
  return toDateInputValue(a) === toDateInputValue(b);
};

export const formatEventDate = (value: Date | string): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
};