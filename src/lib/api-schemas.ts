import { z } from "zod";

const trimmed = z.string().trim();

export const orderStatusValues = [
  "new",
  "in_progress",
  "ready",
  "completed",
  "canceled",
] as const;
export const messageStatusValues = ["new", "responded", "archived"] as const;

export const orderStatusSchema = z.enum(orderStatusValues);
export const messageStatusSchema = z.enum(messageStatusValues);

const orderInputBaseSchema = z.object({
  name: trimmed.min(1, "Name is required"),
  email: trimmed.email("Invalid email address"),
  phone: trimmed.min(1, "Phone number is required"),
  service: trimmed.min(1, "Service is required"),
  deliveryMethod: trimmed.min(1, "Delivery method is required"),
  address: z
    .string()
    .optional()
    .transform((value) => (value ? value.trim() : undefined)),
  details: trimmed.min(1, "Details are required"),
});

export const orderInputSchema = orderInputBaseSchema.refine(
  (data) =>
    data.deliveryMethod !== "Delivery" || (data.address && data.address.length > 0),
  {
    message: "Address is required for delivery",
    path: ["address"],
  }
);

export const orderRecordSchema = orderInputBaseSchema.safeExtend({
  id: z.number().int().positive(),
  createdAt: z.string(),
  status: orderStatusSchema,
  adminNotes: z.string(),
});

export const orderUpdateSchema = z
  .object({
    id: z.number().int().positive(),
    status: orderStatusSchema.optional(),
    adminNotes: z.string().max(2000).optional(),
  })
  .refine((data) => data.status !== undefined || data.adminNotes !== undefined, {
    message: "No updates provided",
  });

export const messageInputSchema = z.object({
  name: trimmed.min(1, "Name is required"),
  email: trimmed.email("Invalid email address"),
  interest: trimmed.min(1, "Consultation focus is required"),
  siteType: trimmed.min(1, "Site type is required"),
  message: trimmed.min(1, "Message is required"),
});

export const messageRecordSchema = messageInputSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.string(),
  status: messageStatusSchema,
  adminNotes: z.string(),
});

export const messageUpdateSchema = z
  .object({
    id: z.number().int().positive(),
    status: messageStatusSchema.optional(),
    adminNotes: z.string().max(2000).optional(),
  })
  .refine((data) => data.status !== undefined || data.adminNotes !== undefined, {
    message: "No updates provided",
  });

export type OrderInput = z.infer<typeof orderInputSchema>;
export type OrderRecord = z.infer<typeof orderRecordSchema>;
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export type MessageInput = z.infer<typeof messageInputSchema>;
export type MessageRecord = z.infer<typeof messageRecordSchema>;
export type MessageStatus = z.infer<typeof messageStatusSchema>;
