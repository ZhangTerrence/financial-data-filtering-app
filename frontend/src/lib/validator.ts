import { z } from "zod";

export const RangeSchema = z
  .object({
    min: z.coerce
      .number({
        message: "Expected a number.",
      })
      .int({
        message: "Must be an integer.",
      }),
    max: z.coerce
      .number({
        message: "Expected a number.",
      })
      .int({
        message: "Must be an integer.",
      }),
  })
  .refine(
    (schema) => {
      return schema.min < schema.max;
    },
    {
      message: "The maximum value must be greater than the minimum value.",
    },
  );

export type RangeSchemaType = z.infer<typeof RangeSchema>;
