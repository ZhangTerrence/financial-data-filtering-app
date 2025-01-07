import { useForm } from "react-hook-form";
import { RangeSchema, RangeSchemaType } from "@/lib/validator.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

export type RangeFormProps = {
  onSubmit: (data: RangeSchemaType) => void;
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="flex space-x-2 items-center">
        <FormField
          control={form.control}
          name="min"
          render={({ field }) => (
            <FormItem className="flex items-center space-y-0 space-x-2">
              <FormLabel>Min</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="max"
          render={({ field }) => (
            <FormItem className="flex items-center space-y-0 space-x-2">
              <FormLabel>Max</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Filter</Button>
      </form>
    </Form>
  );
};
