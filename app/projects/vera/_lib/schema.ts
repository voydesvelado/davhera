import { z } from "zod";

export const LocationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("in_person"),
    address: z.string(),
    city: z.string(),
    mapsUrl: z.string(),
  }),
  z.object({
    type: z.literal("online"),
    platform: z.string(),
    joinUrl: z.string().optional(),
  }),
]);

export const BookingStatusSchema = z.enum(["confirmed", "cancelled"]);

export const BookingSchema = z.object({
  token: z.string().min(3),
  doctorId: z.string().min(1),
  serviceId: z.string().min(1),
  startsAt: z.string(),
  endsAt: z.string(),
  status: BookingStatusSchema,
  patientName: z.string(),
  patientPhone: z.string(),
  patientEmail: z.string(),
  patientNote: z.string().optional(),
  createdAt: z.string(),
  cancelledAt: z.string().optional(),
  isSeed: z.boolean(),
});

export const VisitorDataSchema = z.object({
  version: z.number(),
  bookings: z.array(BookingSchema),
});

export type ParsedVisitorData = z.infer<typeof VisitorDataSchema>;
