import {
	type CellState,
	type Grid,
	type ProbabilityGrid,
	GRID_SIZE,
} from "../shared/types";
import { TOTAL_PURPLES } from "./types";

const STATE_TO_COUNT: Partial<Record<CellState, number>> = {
	blue: 0,
	teal: 1,
	green: 2,
	yellow: 3,
	orange: 4,
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
	validConfigs: number;
	recommendation: [number, number] | null;
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
			} else if (state in STATE_TO_COUNT) {
				revealed.push({
					count: STATE_TO_COUNT[state]!,
					neighbors: NEIGHBOR_FLAT[idx],
				});
			} else {
				unrevealedIndices.push(idx);
			}
		}
	}

	const remainingPurples = TOTAL_PURPLES - fixedPurples.length;
	const emptyResult: ProbabilityGrid = Array.from({ length: GRID_SIZE }, () =>
		Array<number | null>(GRID_SIZE).fill(null),
	);

	if (remainingPurples < 0 || remainingPurples > unrevealedIndices.length) {
		return {
			probabilities: emptyResult,
			validConfigs: 0,
			recommendation: null,
		};
	}

	const fixedPurpleSet = new Set(fixedPurples);

	let totalValid = 0;
	const purpleCounts = new Map<number, number>();
	for (const idx of unrevealedIndices) {
		purpleCounts.set(idx, 0);
	}

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
		}
	}

	const probabilities: ProbabilityGrid = Array.from({ length: GRID_SIZE }, () =>
		Array<number | null>(GRID_SIZE).fill(null),
	);

	let bestProb = -1;
	let recommendation: [number, number] | null = null;

	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c] === "unrevealed") {
				const idx = r * GRID_SIZE + c;
				const count = purpleCounts.get(idx) ?? 0;
				const prob = totalValid > 0 ? count / totalValid : 0;
				probabilities[r][c] = prob;

				if (prob > bestProb) {
					bestProb = prob;
					recommendation = [r, c];
				}
			}
		}
	}

	return { probabilities, validConfigs: totalValid, recommendation };
}
