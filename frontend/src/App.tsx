import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable.tsx";
import { ArrowDownIcon, ArrowUpIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label.tsx";
import { RangeForm } from "@/components/RangeForm.tsx";
import { RangeSchemaType } from "@/lib/validator.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

export type Data = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
};

type OperationStates = "date" | "revenue" | "netIncome";

type SortState = {
  column: OperationStates | null;
  asc: boolean | null;
};

export const App = () => {
  const [data, setData] = useState<Data[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OperationStates>("date");
  const [sort, setSort] = useState<SortState>({
    column: null,
    asc: null,
  });

  const getData = async (query: string = "") => {
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${query}`, {
        method: "GET",
      });
      const data = await response.json();
      setData(data as Data[]);
    } catch (e) {
      setError((e as Error).message);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData().then();
  }, []);

  const sortData = (column: OperationStates) => {
    const toggleAsc = sort.asc == null ? true : !sort.asc;

    if (!data) {
      getData(`?column=${column}&asc=${toggleAsc}`).then();
    } else {
      setData((data) =>
        data
          ? [...data].sort((x, y) => {
              if (column === "date") {
                return x[column].localeCompare(y[column]) * (toggleAsc ? 1 : -1);
              }

              return (x[column] - y[column]) * (toggleAsc ? 1 : -1);
            })
          : null,
      );
    }
    setSort({
      column: column as OperationStates,
      asc: toggleAsc,
    });
  };

  const filterData = (data: RangeSchemaType) => {
    getData(`?column=${filter}&min=${data.min}&max=${data.max}`).then();
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Unable to retrieve data.</div>;
  }

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => sortData(column.id as OperationStates)}>
            Date
            {sort.column != column.id || sort.asc == null ? null : sort.asc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "revenue",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => sortData(column.id as OperationStates)}>
            Revenue
            {sort.column != column.id || sort.asc == null ? null : sort.asc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "netIncome",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => sortData(column.id as OperationStates)}>
            Net Income
            {sort.column != column.id || sort.asc == null ? null : sort.asc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
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
    <div className="min-h-screen w-screen relative">
      {isLoading && <LoaderCircleIcon className="absolute absolute-center" />}
      <div>
        <div className="flex items-center py-4 justify-center space-x-4">
          <Label htmlFor="revenue-filter" className="flex items-center space-x-2">
            <p>Filter By</p>
            <Select defaultValue={filter} onValueChange={(value) => setFilter(value as OperationStates)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="netIncome">Net Income</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <RangeForm onSubmit={filterData} />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
