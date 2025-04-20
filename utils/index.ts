export const formatNumber = (value: number) =>
  Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatPageTitle = (title?: string) =>
  title ? `${title} - OpenClashUI` : "OpenClashUI";
