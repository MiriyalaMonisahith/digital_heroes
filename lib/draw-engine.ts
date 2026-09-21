import type { DrawType, MatchTier } from "@/types/database";

export const NUMBER_MIN = 1;
export const NUMBER_MAX = 45;
export const NUMBERS_PER_ENTRY = 5;

/** Mock currency contributed to the prize pool per active, entered subscriber. */
export const POOL_CONTRIBUTION_PER_ENTRANT = 200;

export const POOL_SHARE: Record<MatchTier, number> = {
  "5": 0.4,
  "4": 0.35,
  "3": 0.25,
};

export interface Entrant {
  userId: string;
  /** The user's own numbers, derived from their latest stored scores. */
  numbers: number[];
}

export interface DrawWinner {
  userId: string;
  tier: MatchTier;
  prizeAmount: number;
}

export interface DrawSimulation {
  winningNumbers: number[];
  entrantCount: number;
  poolTotal: number;
  pool5: number;
  pool4: number;
  pool3: number;
  jackpotRolloverIn: number;
  jackpotRolloverOut: number;
  winnersByTier: Record<MatchTier, DrawWinner[]>;
  results: { userId: string; tier: MatchTier | null; prizeAmount: number }[];
}

/** Converts a user's raw scores into their unique draw numbers (order-insensitive). */
export function toEntryNumbers(scores: number[]): number[] {
  return Array.from(new Set(scores)).sort((a, b) => a - b);
}

function randomInt(maxExclusive: number): number {
  return Math.floor(Math.random() * maxExclusive);
}

export function generateRandomNumbers(): number[] {
  const pool: number[] = [];
  for (let n = NUMBER_MIN; n <= NUMBER_MAX; n++) pool.push(n);

  const picked: number[] = [];
  for (let i = 0; i < NUMBERS_PER_ENTRY && pool.length > 0; i++) {
    const idx = randomInt(pool.length);
    picked.push(pool[idx]);
    pool.splice(idx, 1);
  }
  return picked.sort((a, b) => a - b);
}

/**
 * Weighted-without-replacement draw: numbers subscribers enter more often are
 * more likely to be picked. Every number 1-45 keeps a baseline weight of 1 so
 * numbers nobody entered can still be drawn.
 */
export function generateAlgorithmicNumbers(allEntryNumbers: number[][]): number[] {
  const weights = new Map<number, number>();
  for (let n = NUMBER_MIN; n <= NUMBER_MAX; n++) weights.set(n, 1);

  for (const numbers of allEntryNumbers) {
    for (const n of numbers) {
      weights.set(n, (weights.get(n) ?? 1) + 1);
    }
  }

  const remaining = new Map(weights);
  const picked: number[] = [];

  for (let i = 0; i < NUMBERS_PER_ENTRY && remaining.size > 0; i++) {
    const entries = Array.from(remaining.entries());
    const totalWeight = entries.reduce((sum, [, w]) => sum + w, 0);
    let roll = Math.random() * totalWeight;

    let chosen = entries[entries.length - 1][0];
    for (const [num, w] of entries) {
      roll -= w;
      if (roll <= 0) {
        chosen = num;
        break;
      }
    }

    picked.push(chosen);
    remaining.delete(chosen);
  }

  return picked.sort((a, b) => a - b);
}

export function matchTier(userNumbers: number[], winningNumbers: number[]): MatchTier | null {
  const winningSet = new Set(winningNumbers);
  const matches = userNumbers.filter((n) => winningSet.has(n)).length;

  if (matches >= 5) return "5";
  if (matches === 4) return "4";
  if (matches === 3) return "3";
  return null;
}

export function pickWinningNumbers(entrants: Entrant[], drawType: DrawType): number[] {
  return drawType === "algorithmic"
    ? generateAlgorithmicNumbers(entrants.map((e) => e.numbers))
    : generateRandomNumbers();
}

/**
 * Resolves a draw against an already-chosen set of winning numbers. Used both
 * by simulate() (numbers picked fresh) and publish() (numbers reused from the
 * simulation the admin already previewed, re-resolved against current entrants).
 */
export function resolveDraw(
  entrants: Entrant[],
  winningNumbers: number[],
  jackpotRolloverIn: number
): DrawSimulation {
  const entrantCount = entrants.length;
  const baseTotal = entrantCount * POOL_CONTRIBUTION_PER_ENTRANT;

  const pool5 = baseTotal * POOL_SHARE["5"] + jackpotRolloverIn;
  const pool4 = baseTotal * POOL_SHARE["4"];
  const pool3 = baseTotal * POOL_SHARE["3"];

  const tiersOf = entrants.map((e) => ({
    userId: e.userId,
    tier: matchTier(e.numbers, winningNumbers),
  }));

  const winnersByTier: Record<MatchTier, DrawWinner[]> = { "5": [], "4": [], "3": [] };

  (["5", "4", "3"] as MatchTier[]).forEach((tier) => {
    const winnersInTier = tiersOf.filter((t) => t.tier === tier);
    const tierPool = tier === "5" ? pool5 : tier === "4" ? pool4 : pool3;
    const prizeEach = winnersInTier.length > 0 ? tierPool / winnersInTier.length : 0;

    winnersByTier[tier] = winnersInTier.map((w) => ({
      userId: w.userId,
      tier,
      prizeAmount: Math.round(prizeEach * 100) / 100,
    }));
  });

  const jackpotRolloverOut = winnersByTier["5"].length === 0 ? pool5 : 0;

  const prizeByUser = new Map<string, number>();
  (["5", "4", "3"] as MatchTier[]).forEach((tier) => {
    winnersByTier[tier].forEach((w) => prizeByUser.set(w.userId, w.prizeAmount));
  });

  const results = tiersOf.map((t) => ({
    userId: t.userId,
    tier: t.tier,
    prizeAmount: prizeByUser.get(t.userId) ?? 0,
  }));

  return {
    winningNumbers,
    entrantCount,
    poolTotal: Math.round((pool5 + pool4 + pool3) * 100) / 100,
    pool5: Math.round(pool5 * 100) / 100,
    pool4: Math.round(pool4 * 100) / 100,
    pool3: Math.round(pool3 * 100) / 100,
    jackpotRolloverIn,
    jackpotRolloverOut: Math.round(jackpotRolloverOut * 100) / 100,
    winnersByTier,
    results,
  };
}

export function simulateDraw(
  entrants: Entrant[],
  drawType: DrawType,
  jackpotRolloverIn: number
): DrawSimulation {
  const winningNumbers = pickWinningNumbers(entrants, drawType);
  return resolveDraw(entrants, winningNumbers, jackpotRolloverIn);
}
