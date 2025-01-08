import { useForm } from "react-hook-form";
import { RangeSchema, RangeSchemaType } from "@/lib/validator.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { OperationStates } from "@/App.tsx";

export type RangeFormProps = {
  onSubmit: (data: RangeSchemaType) => void;
  filter: OperationStates | undefined;
  changeFilter: (value: OperationStates) => void;
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
        <Select defaultValue={props.filter} onValueChange={(value) => props.changeFilter(value as OperationStates)}>
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
        <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex flex-col space-y-4">
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </DialogContent>
  );
};
