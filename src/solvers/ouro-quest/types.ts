export const CELL_STATES = [
	"unrevealed",
	"blue",
	"teal",
	"green",
	"yellow",
	"orange",
	"purple",
] as const;

export type CellState = (typeof CELL_STATES)[number];

export const CELL_COLORS: Record<CellState, string> = {
	unrevealed: "",
	blue: "#3B82F6",
	teal: "#14B8A6",
	green: "#22C55E",
	yellow: "#EAB308",
	orange: "#F97316",
	purple: "#A855F7",
};

export const CELL_LABELS: Record<CellState, string> = {
	unrevealed: "Unrevealed",
	blue: "Blue (0)",
	teal: "Teal (1)",
	green: "Green (2)",
	yellow: "Yellow (3)",
	orange: "Orange (4)",
	purple: "Purple Sphere",
};

export const GRID_SIZE = 5;
export const TOTAL_PURPLES = 4;
export const MAX_CLICKS = 7;

export type Grid = CellState[][];
export type ProbabilityGrid = (number | null)[][];

export function createEmptyGrid(): Grid {
	return Array.from({ length: GRID_SIZE }, () =>
		Array.from({ length: GRID_SIZE }, () => "unrevealed" as CellState),
	);
}

export function countRevealed(grid: Grid): number {
	let count = 0;
	for (const row of grid) {
		for (const cell of row) {
			if (cell !== "unrevealed") count++;
		}
	}
	return count;
}

export function countPurples(grid: Grid): number {
	let count = 0;
	for (const row of grid) {
		for (const cell of row) {
			if (cell === "purple") count++;
		}
	}
	return count;
}
