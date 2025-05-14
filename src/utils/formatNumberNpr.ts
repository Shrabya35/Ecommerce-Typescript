export const formatNumberNPR = (number: number | null | undefined): string => {
  if (number == null) return "0";
  return number.toLocaleString("en-IN");
};
