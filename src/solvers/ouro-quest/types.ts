import type { CellState } from "../shared/types";

export const OURO_QUEST_STATES: readonly CellState[] = [
	"unrevealed",
	"blue",
	"teal",
	"green",
	"yellow",
	"orange",
	"purple",
];

export const OURO_QUEST_LABELS: Record<string, string> = {
	unrevealed: "Unrevealed",
	blue: "Blue (0)",
	teal: "Teal (1)",
	green: "Green (2)",
	yellow: "Yellow (3)",
	orange: "Orange (4)",
	purple: "Purple Sphere",
};

export const TOTAL_PURPLES = 4;
export const MAX_CLICKS = 7;
