export const DIFFICULTY_WEIGHTS = {
  EASY: 0,
  MEDIUM: 1,
  HARD: 2,
  VERY_HARD: 3,
} as const;
export type WeightValues =
  (typeof DIFFICULTY_WEIGHTS)[keyof typeof DIFFICULTY_WEIGHTS];
interface PointsValue {
  increase: number;
  decrease: number;
}

export const DIFFICULTY_NAMES = new Map<number, string>([
  [0, "Fácil"],
  [1, "Médio"],
  [2, "Difícil"],
  [3, "Muito Difícil"],
]);

export const POINTS_MAP = new Map<WeightValues, PointsValue>();
POINTS_MAP.set(DIFFICULTY_WEIGHTS.EASY, {
  increase: 10,
  decrease: 5,
});
POINTS_MAP.set(DIFFICULTY_WEIGHTS.MEDIUM, {
  increase: 25,
  decrease: 10,
});
POINTS_MAP.set(DIFFICULTY_WEIGHTS.HARD, {
  increase: 50,
  decrease: 25,
});
POINTS_MAP.set(DIFFICULTY_WEIGHTS.VERY_HARD, {
  increase: 75,
  decrease: 50,
});

export const BADGE_SELECT = {
  id: true,
  name: true,
  icon: true,
  criteria: true,
  threshold: true,
};
