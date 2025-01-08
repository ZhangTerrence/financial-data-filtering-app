import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button.tsx";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

import type { OperationalColumns } from "@/lib/types.ts";
import { RangeSchema, RangeSchemaType } from "@/lib/validator.ts";

export type RangeFormProps = {
  filterData: (data: RangeSchemaType) => void;
  filteredColumn: OperationalColumns | undefined;
  changeFilteredColumn: (value: OperationalColumns) => void;
  resetFilter: () => Promise<void>;
};

export const RangeForm = (props: RangeFormProps) => {
  const form = useForm<RangeSchemaType>({
    resolver: zodResolver(RangeSchema),
    defaultValues: {
      min: 0,
      max: 0,
    },
  });

  return (
    <DialogContent className="flex flex-col space-y-2">
      <DialogHeader>
        <DialogTitle>Filter</DialogTitle>
      </DialogHeader>
      <div className="flex space-x-2">
        <Label className="flex items-center space-x-2">
          <p>Filter By</p>
        </Label>
        <Select
          defaultValue={props.filteredColumn}
          onValueChange={(value) => props.changeFilteredColumn(value as OperationalColumns)}
        >
          <SelectTrigger className="w-[180px] grow">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="netIncome">Net Income</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(props.filterData)} className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-2 items-center">
                  <FormLabel>Min</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem>
                <div className="flex space-x-2 items-center">
                  <FormLabel>Max</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              className="grow"
              onClick={async (e) => {
                e.preventDefault();
                form.reset();
                await props.resetFilter();
              }}
            >
              Remove Filter
            </Button>
            <Button className="grow" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
