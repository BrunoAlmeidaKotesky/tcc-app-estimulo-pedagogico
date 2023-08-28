

export const DIFFICULTY_WEIGHTS = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    VERY_HARD: 4
} as const;
export type WeightValues = typeof DIFFICULTY_WEIGHTS[keyof typeof DIFFICULTY_WEIGHTS]
interface PointsValue {
    increase: number;
    decrease: number;
}

export const POINTS_MAP = new Map<WeightValues, PointsValue>();
POINTS_MAP.set(DIFFICULTY_WEIGHTS.EASY, {
    increase: 10,
    decrease: 5,
});
POINTS_MAP.set(DIFFICULTY_WEIGHTS.MEDIUM, {
    increase: 20,
    decrease: 10,
});
POINTS_MAP.set(DIFFICULTY_WEIGHTS.HARD, {
    increase: 30,
    decrease: 15,
});
POINTS_MAP.set(DIFFICULTY_WEIGHTS.VERY_HARD, {
    increase: 40,
    decrease: 20,   
});

export const BADGE_SELECT = {
    id: true,
    name: true,
    icon: true,
    criteria: true,
    threshold: true
}