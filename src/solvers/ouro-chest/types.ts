import type { CellState } from "../shared/types";

export const OURO_CHEST_STATES: readonly CellState[] = [
	"unrevealed",
	"blue",
	"teal",
	"green",
	"yellow",
	"orange",
	"red",
];

export const OURO_CHEST_LABELS: Record<string, string> = {
	unrevealed: "Unrevealed",
	blue: "Blue (not in line)",
	teal: "Teal (in line)",
	green: "Green (row/col)",
	yellow: "Yellow (diagonal)",
	orange: "Orange (adjacent)",
	red: "Red Sphere",
};

export const MAX_CLICKS = 5;
