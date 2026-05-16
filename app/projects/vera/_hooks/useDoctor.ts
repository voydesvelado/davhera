"use client";

import { ALL_DOCTORS } from "../_lib/seed";
import type { Doctor } from "../_lib/types";

export function useDoctor(slug: string): Doctor | null {
  return ALL_DOCTORS.find((d) => d.slug === slug) ?? null;
}

export function useDoctorById(id: string): Doctor | null {
  return ALL_DOCTORS.find((d) => d.id === id) ?? null;
}
