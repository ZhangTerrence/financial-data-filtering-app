export type Data = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
};

export type OperationalColumns = "date" | "revenue" | "netIncome";

export type SortedColumn = {
  name: OperationalColumns | null;
  asc: boolean | null;
};
