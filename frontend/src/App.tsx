import { useEffect, useState } from "react";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";

import { DataTable } from "@/components/DataTable.tsx";
import { RangeForm } from "@/components/RangeForm.tsx";

import type { Data, OperationalColumns, SortedColumn } from "@/lib/types.ts";
import { RangeSchemaType } from "@/lib/validator.ts";

export const App = () => {
  const [data, setData] = useState<Data[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filteredColumn, setFilteredColumn] = useState<OperationalColumns | undefined>(undefined);
  const [sortedColumn, setSortedColumn] = useState<SortedColumn>({ name: null, asc: null });

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

  const sortData = (column: OperationalColumns) => {
    const asc = sortedColumn.asc == null ? true : !sortedColumn.asc;

    if (!data || !filteredColumn) {
      getData(`?column=${column}&asc=${asc}`).then();
    } else {
      // Sorts data that has already been fetched or filtered
      setData((data) =>
        [...data].sort((x, y) => {
          if (column === "date") {
            return x[column].localeCompare(y[column]) * (asc ? 1 : -1);
          }

          return (x[column] - y[column]) * (asc ? 1 : -1);
        }),
      );
    }
    setSortedColumn({ name: column as OperationalColumns, asc: asc });
  };

  const filterData = (form: RangeSchemaType) => {
    if (!filteredColumn) {
      toast.error("Please select an attribute to filter.");
      return;
    }

    getData(`?column=${filteredColumn}&min=${form.min}&max=${form.max}`).then();
  };

  const changeFilteredColumn = (value: OperationalColumns) => {
    setFilteredColumn(value);
  };

  const columns: ColumnDef<Data>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="hover:bg-transparent align-center"
            onClick={() => sortData(column.id as OperationalColumns)}
          >
            Date
            {sortedColumn.name != column.id || sortedColumn.asc == null ? null : sortedColumn.asc ? (
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
            onClick={() => sortData(column.id as OperationalColumns)}
          >
            Revenue
            {sortedColumn.name != column.id || sortedColumn.asc == null ? null : sortedColumn.asc ? (
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
            onClick={() => sortData(column.id as OperationalColumns)}
          >
            Net Income
            {sortedColumn.name != column.id || sortedColumn.asc == null ? null : sortedColumn.asc ? (
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
          <RangeForm
            filterData={filterData}
            filteredColumn={filteredColumn}
            changeFilteredColumn={changeFilteredColumn}
          />
        </Dialog>
        <DataTable columns={columns} data={data} sortData={sortData} />
      </div>
    </div>
  );
};
