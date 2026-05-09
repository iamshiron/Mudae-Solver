export const ALL_CELL_STATES = [
	"unrevealed",
	"blue",
	"teal",
	"green",
	"yellow",
	"orange",
	"purple",
	"red",
] as const;

export type CellState = (typeof ALL_CELL_STATES)[number];

export const CELL_COLORS: Record<CellState, string> = {
	unrevealed: "",
	blue: "#3B82F6",
	teal: "#14B8A6",
	green: "#22C55E",
	yellow: "#EAB308",
	orange: "#F97316",
	purple: "#A855F7",
	red: "#EF4444",
};

export const GRID_SIZE = 5;

export type Grid = CellState[][];
export type ProbabilityGrid = (number | null)[][];

export function createEmptyGrid(): Grid {
	return Array.from({ length: GRID_SIZE }, () =>
		Array.from<CellState>({ length: GRID_SIZE }).fill("unrevealed"),
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
