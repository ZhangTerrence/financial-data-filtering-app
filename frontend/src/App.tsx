import { useApi } from "@/hooks/useApi.tsx";

export type Data = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
};

export const App = () => {
  const { data, isLoading, error } = useApi<Data>("GET", "", null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Unable to retrieve data.</div>;
  }

  console.log(data);

  return <div>Hello, world.</div>;
};
