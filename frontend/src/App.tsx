import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable.tsx";
import { ArrowDownIcon, ArrowUpIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useEffect, useState } from "react";
import { RangeForm } from "@/components/RangeForm.tsx";
import { RangeSchemaType } from "@/lib/validator.ts";
import { Toaster } from "@/components/ui/sonner.tsx";
import { toast } from "sonner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";

export type Data = {
  date: string;
  revenue: number;
  netIncome: number;
  grossProfit: number;
  eps: number;
  operatingIncome: number;
};

export type OperationStates = "date" | "revenue" | "netIncome";

type SortState = {
  column: OperationStates | null;
  asc: boolean | null;
};

export const App = () => {
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<OperationStates | undefined>(undefined);
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

      if (!data) {
        toast("Uh oh. Something went wrong.", {
          description: "Unable to get data.",
        });
        return;
      }

      setData(data as Data[]);
    } catch (e) {
      toast.error("Uh oh. Something went wrong.", {
        description: (e as Error).message,
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData().then();
  }, []);

  const sortData = (column: OperationStates) => {
    const toggleAsc = sort.asc == null ? true : !sort.asc;

    if (!data || !filter) {
      getData(`?column=${column}&asc=${toggleAsc}`).then();
    } else {
      setData((data) =>
        [...data].sort((x, y) => {
          if (column === "date") {
            return x[column].localeCompare(y[column]) * (toggleAsc ? 1 : -1);
          }

          return (x[column] - y[column]) * (toggleAsc ? 1 : -1);
        }),
      );
    }
    setSort({
      column: column as OperationStates,
      asc: toggleAsc,
    });
  };

  const filterData = (form: RangeSchemaType) => {
    if (filter) {
      getData(`?column=${filter}&min=${form.min}&max=${form.max}`).then();
      return;
    }

    toast.error("Please select an attribute to filter.");
  };

  const changeFilter = (value: OperationStates) => {
    setFilter(value);
  };

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-transparent align-center"
            onClick={() => sortData(column.id as OperationStates)}
          >
            Date
            {sort.column != column.id || sort.asc == null ? null : sort.asc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div className="font-medium text-center">{row.getValue("date")}</div>;
      },
    },
    {
      accessorKey: "revenue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            onClick={() => sortData(column.id as OperationStates)}
          >
            Revenue
            {sort.column != column.id || sort.asc == null ? null : sort.asc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("revenue"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium text-center">{formatted}</div>;
      },
    },
    {
      accessorKey: "netIncome",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-transparent"
            onClick={() => sortData(column.id as OperationStates)}
          >
            Net Income
            {sort.column != column.id || sort.asc == null ? null : sort.asc ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("netIncome"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium text-center">{formatted}</div>;
      },
    },
    {
      accessorKey: "grossProfit",
      header: "Gross Profit",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("grossProfit"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium text-center">{formatted}</div>;
      },
    },
    {
      accessorKey: "eps",
      header: "EPS",
      cell: ({ row }) => {
        return <div className="font-medium text-center">{row.getValue("date")}</div>;
      },
    },
    {
      accessorKey: "operatingIncome",
      header: "Operating Income",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("operatingIncome"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium text-center">{formatted}</div>;
      },
    },
  ];

  return (
    <div className="min-h-screen w-screen relative p-4">
      {isLoading && <LoaderCircleIcon className="absolute absolute-center" />}
      <Toaster />
      <div className="flex flex-col gap-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Filter</Button>
          </DialogTrigger>
          <RangeForm onSubmit={filterData} filter={filter} changeFilter={changeFilter} />
        </Dialog>
        <DataTable columns={columns} data={data} sort={sortData} />
      </div>
    </div>
  );
};
