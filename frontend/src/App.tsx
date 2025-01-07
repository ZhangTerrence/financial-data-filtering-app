import { useApi } from "@/hooks/useApi.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable.tsx";

export type Data = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
};

export const App = () => {
  const { data, isLoading, error } = useApi<Data[]>("GET", "", null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Unable to retrieve data.</div>;
  }

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
    },
    {
      accessorKey: "netIncome",
      header: "Net Income",
    },
    {
      accessorKey: "grossProfit",
      header: "Gross Profit",
    },
    {
      accessorKey: "eps",
      header: "EPS",
    },
    {
      accessorKey: "operatingIncome",
      header: "Operating Income",
    },
  ];

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
