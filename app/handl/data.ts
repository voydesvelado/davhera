export type Confidence = "high" | "moderate";

export interface Deductible {
  used: number;
  total: number;
  coinsurance: number; // 0.15 = plan pays 85%, member pays 15%
}

export interface Provider {
  id: string;
  name: string;
  facility: string;
  type?: string;
  photo: string;
  quality: string;
  qualityTone: "ok" | "lav";
  cost: number; // contracted rate (total, before insurance)
  typical?: number; // local typical total
  distance: string;
  availability?: string;
  estimate?: [number, number]; // member out-of-pocket range
  confidence?: Confidence;
}

export interface NavigatorInfo {
  name: string;
  initials: string;
  photo: string;
}

export const DATA = {
  user: {
    name: "Jenny",
    initials: "JM",
    plan: "Acme PPO",
    deductible: { used: 800, total: 1500, coinsurance: 0.15 } as Deductible,
  },
  procedure: {
    friendly: "Knee arthroscopy",
    billing: "arthroscopy, knee, surgical",
    networkCount: 16,
    areaRange: [2900, 6400] as [number, number],
  },
  providers: [
    {
      id: "adams",
      name: "Dr. Adams",
      facility: "Lakeside Surgical Center",
      type: "standalone facility",
      photo: "/handl/img/dr-adams.jpg",
      quality: "Excellent outcomes",
      qualityTone: "ok" as const,
      cost: 3292,
      typical: 6200,
      distance: "15 min",
      availability: "this week",
      estimate: [1380, 1640] as [number, number],
      confidence: "high" as Confidence,
    },
    {
      id: "chen",
      name: "Dr. Chen",
      facility: "Northside Ortho",
      type: "surgery center",
      photo: "/handl/img/dr-chen.jpg",
      quality: "High quality",
      qualityTone: "ok" as const,
      cost: 4110,
      typical: 6200,
      distance: "9 min",
      availability: "in 2 weeks",
      estimate: [1500, 1780] as [number, number],
      confidence: "high" as Confidence,
    },
    {
      id: "moore",
      name: "Dr. Moore",
      facility: "St. Vincent",
      type: "hospital outpatient",
      photo: "/handl/img/dr-moore.jpg",
      quality: "Hospital-based",
      qualityTone: "lav" as const,
      cost: 6312,
      typical: 6200,
      distance: "12 min",
      availability: "in 3 weeks",
      estimate: [1100, 2900] as [number, number],
      confidence: "moderate" as Confidence,
    },
  ] as Provider[],
  navigator: {
    name: "Maria Torres",
    initials: "MT",
    photo: "/handl/img/maria.jpg",
  } as NavigatorInfo,
  finalBill: 1512,
};

export const DEFAULT_PROVIDER = DATA.providers[0]; // Dr. Adams

/**
 * Ledger math, computed from DATA (never hardcoded).
 *
 *   remaining     = deductible.total - deductible.used
 *   planBase      = cost - remaining              (subject to coinsurance)
 *   yourShare     = round(planBase * coinsurance)  (your 15% portion)
 *
 * The displayed "your total" range is DATA.estimate, which already folds in
 * the stated unknowns (anesthesia, additional findings). The intermediate
 * lines must reconcile: cost = remaining + planBase, and planBase is what the
 * 85/15 split applies to.
 */
export function breakdownMath(provider: Provider) {
  const { deductible } = DATA.user;
  const remaining = deductible.total - deductible.used;
  const planBase = provider.cost - remaining;
  const yourShare = Math.round(planBase * deductible.coinsurance);
  return {
    contracted: provider.cost,
    remaining,
    planBase,
    yourShare,
    coinsurancePct: Math.round((1 - deductible.coinsurance) * 100), // 85
  };
}

/** True when the final bill lands inside the estimated range (receipt beat). */
export function isInsideRange(bill: number, range: [number, number]) {
  return bill >= range[0] && bill <= range[1];
}

export function money(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}
