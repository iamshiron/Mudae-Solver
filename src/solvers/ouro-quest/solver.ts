import {
	type CellState,
	type Grid,
	type ProbabilityGrid,
	type ColorDistributionGrid,
	GRID_SIZE,
} from "../shared/types";
import { TOTAL_PURPLES } from "./types";

const COUNT_TO_COLOR: Record<number, CellState> = {
	0: "blue",
	1: "teal",
	2: "green",
	3: "yellow",
	4: "orange",
};

const CELL_COUNT = GRID_SIZE * GRID_SIZE;

const NEIGHBOR_FLAT: number[][] = Array.from(
	{ length: CELL_COUNT },
	(_, idx) => {
		const r = Math.floor(idx / GRID_SIZE);
		const c = idx % GRID_SIZE;
		const neighbors: number[] = [];
		for (let dr = -1; dr <= 1; dr++) {
			for (let dc = -1; dc <= 1; dc++) {
				if (dr === 0 && dc === 0) continue;
				const nr = r + dr;
				const nc = c + dc;
				if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
					neighbors.push(nr * GRID_SIZE + nc);
				}
			}
		}
		return neighbors;
	},
);

function* combinations(arr: number[], k: number): Generator<number[]> {
	if (k === 0) {
		yield [];
		return;
	}
	for (let i = 0; i <= arr.length - k; i++) {
		for (const rest of combinations(arr.slice(i + 1), k - 1)) {
			yield [arr[i], ...rest];
		}
	}
}

export interface SolveResult {
	probabilities: ProbabilityGrid;
	colorDistributions: ColorDistributionGrid;
	validConfigs: number;
}

export function solve(grid: Grid): SolveResult {
	const fixedPurples: number[] = [];
	const revealed: { count: number; neighbors: number[] }[] = [];
	const unrevealedIndices: number[] = [];

	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			const idx = r * GRID_SIZE + c;
			const state = grid[r][c];
			if (state === "purple") {
				fixedPurples.push(idx);
			} else {
				const countMap: Partial<Record<CellState, number>> = {
					blue: 0,
					teal: 1,
					green: 2,
					yellow: 3,
					orange: 4,
				};
				if (state in countMap) {
					revealed.push({
						count: countMap[state as CellState]!,
						neighbors: NEIGHBOR_FLAT[idx],
					});
				} else {
					unrevealedIndices.push(idx);
				}
			}
		}
	}

	const remainingPurples = TOTAL_PURPLES - fixedPurples.length;

	const emptyGrid = <T>(fill: T): T[][] =>
		Array.from({ length: GRID_SIZE }, () =>
			Array.from<T>({ length: GRID_SIZE }).fill(fill),
		);

	if (remainingPurples < 0 || remainingPurples > unrevealedIndices.length) {
		return {
			probabilities: emptyGrid(null),
			colorDistributions: emptyGrid(null),
			validConfigs: 0,
		};
	}

	const fixedPurpleSet = new Set(fixedPurples);

	const purpleCounts = new Map<number, number>();
	const colorCounts = new Map<number, Map<string, number>>();
	for (const idx of unrevealedIndices) {
		purpleCounts.set(idx, 0);
		colorCounts.set(idx, new Map());
	}

	let totalValid = 0;

	for (const combo of combinations(unrevealedIndices, remainingPurples)) {
		const currentPurpleSet = new Set([...fixedPurpleSet, ...combo]);

		let valid = true;
		for (const { count, neighbors } of revealed) {
			let actualCount = 0;
			for (const nIdx of neighbors) {
				if (currentPurpleSet.has(nIdx)) {
					actualCount++;
				}
			}
			if (actualCount !== count) {
				valid = false;
				break;
			}
		}

		if (valid) {
			totalValid++;
			for (const idx of combo) {
				purpleCounts.set(idx, (purpleCounts.get(idx) ?? 0) + 1);
			}
			for (const idx of unrevealedIndices) {
				const counts = colorCounts.get(idx)!;
				if (currentPurpleSet.has(idx)) {
					counts.set("purple", (counts.get("purple") ?? 0) + 1);
				} else {
					let neighborPurples = 0;
					for (const nIdx of NEIGHBOR_FLAT[idx]) {
						if (currentPurpleSet.has(nIdx)) neighborPurples++;
					}
					const color = COUNT_TO_COLOR[neighborPurples] ?? "orange";
					counts.set(color, (counts.get(color) ?? 0) + 1);
				}
			}
		}
	}

	const probabilities: ProbabilityGrid = emptyGrid(null);
	const colorDistributions: ColorDistributionGrid = emptyGrid(null);

	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c] === "unrevealed") {
				const idx = r * GRID_SIZE + c;
				const pCount = purpleCounts.get(idx) ?? 0;
				probabilities[r][c] = totalValid > 0 ? pCount / totalValid : 0;

				const dist: Record<string, number> = {};
				const counts = colorCounts.get(idx)!;
				for (const [color, count] of counts) {
					dist[color] = totalValid > 0 ? count / totalValid : 0;
				}
				colorDistributions[r][c] = dist;
			}
		}
	}

	return { probabilities, colorDistributions, validConfigs: totalValid };
}
