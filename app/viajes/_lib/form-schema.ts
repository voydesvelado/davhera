import { z } from "zod";

export function normalizeWhatsapp(input: string): string {
  return input.replace(/\D+/g, "");
}

export const step1Schema = z
  .object({
    trip_slug: z.string().min(1, "Selecciona un viaje"),
    fecha_salida: z.string().min(1, "Selecciona una fecha de salida"),
    fecha_regreso: z.string().min(1, "Selecciona una fecha de regreso"),
  })
  .refine(
    (v) => new Date(v.fecha_regreso).getTime() > new Date(v.fecha_salida).getTime(),
    {
      message: "La fecha de regreso debe ser después de la salida",
      path: ["fecha_regreso"],
    },
  );

export const step2Schema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "Tu nombre completo, por favor"),
  whatsapp: z
    .string()
    .transform((v) => normalizeWhatsapp(v))
    .refine((v) => v.length === 10, {
      message: "WhatsApp a 10 dígitos (formato MX)",
    }),
  email: z.email("Correo no válido"),
});

export const step3Schema = z.object({
  personas_adultos: z.number().int().min(1, "Al menos un adulto").max(12),
  personas_ninos: z.number().int().min(0).max(8),
  presupuesto_rango: z.string().min(1, "Elige un rango"),
  notas: z.string().max(2000).optional(),
});

type StepResult =
  | { success: true }
  | { success: false; errors: Record<string, string> };

const schemas = {
  1: step1Schema,
  2: step2Schema,
  3: step3Schema,
} as const;

export function parseStep(
  step: 1 | 2 | 3,
  data: Record<string, unknown>,
): StepResult {
  const result = schemas[step].safeParse(data);
  if (result.success) return { success: true };
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}
