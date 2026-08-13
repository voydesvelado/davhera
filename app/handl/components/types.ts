export type ScreenId =
  | "entry"
  | "capture"
  | "processing"
  | "confirm"
  | "options"
  | "estimate"
  | "estimateWide"
  | "booking"
  | "checkin"
  | "receipt"
  | "describe"
  | "question"
  | "recovery"
  | "directSearch"
  | "chatMaria"
  | "mariaPlan";

export type SheetId = "breakdown" | "ranking";

export interface Nav {
  go: (id: ScreenId) => void;
  back: () => void;
  openSheet: (id: SheetId) => void;
  closeSheet: () => void;
}
