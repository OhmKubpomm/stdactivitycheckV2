import { z } from "zod";

export const formSchema = z.object({
  ActivityFormname: z.string().min(4),
  ActivityDescription: z.string().optional(),
});

export type formSchemaType = z.infer<typeof formSchema>;
