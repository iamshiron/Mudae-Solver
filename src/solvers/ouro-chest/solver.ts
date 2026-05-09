import {
	type CellState,
	type Grid,
	type ProbabilityGrid,
	GRID_SIZE,
} from "../shared/types";

function isOnDiagonal(r1: number, c1: number, r2: number, c2: number): boolean {
	return Math.abs(r1 - r2) === Math.abs(c1 - c2);
}

function isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
	return (
		Math.abs(r1 - r2) <= 1 &&
		Math.abs(c1 - c2) <= 1 &&
		!(r1 === r2 && c1 === c2)
	);
}

function isInLine(r1: number, c1: number, r2: number, c2: number): boolean {
	return r1 === r2 || c1 === c2 || isOnDiagonal(r1, c1, r2, c2);
}

function isConsistent(
	redR: number,
	redC: number,
	tileR: number,
	tileC: number,
	displayed: CellState,
): boolean {
	switch (displayed) {
		case "red":
			return tileR === redR && tileC === redC;
		case "orange":
			return isAdjacent(tileR, tileC, redR, redC);
		case "yellow":
			return isOnDiagonal(tileR, tileC, redR, redC);
		case "green":
			return tileR === redR || tileC === redC;
		case "teal":
			return isInLine(tileR, tileC, redR, redC);
		case "blue":
			return !isInLine(tileR, tileC, redR, redC);
		default:
			return true;
	}
}

export interface SolveResult {
	probabilities: ProbabilityGrid;
	validPositions: number;
	recommendation: [number, number] | null;
}

export function solve(grid: Grid): SolveResult {
	const emptyResult: ProbabilityGrid = Array.from({ length: GRID_SIZE }, () =>
		Array<number | null>(GRID_SIZE).fill(null),
	);

	let foundRed: [number, number] | null = null;
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c] === "red") {
				if (foundRed !== null) {
					return {
						probabilities: emptyResult,
						validPositions: 0,
						recommendation: null,
					};
				}
				foundRed = [r, c];
			}
		}
	}

	const validPositions: [number, number][] = [];

	if (foundRed !== null) {
		const [fr, fc] = foundRed;
		let valid = true;
		for (let tr = 0; tr < GRID_SIZE && valid; tr++) {
			for (let tc = 0; tc < GRID_SIZE && valid; tc++) {
				const state = grid[tr][tc];
				if (state === "unrevealed" || state === "red") continue;
				if (!isConsistent(fr, fc, tr, tc, state)) {
					valid = false;
				}
			}
		}
		if (valid) {
			validPositions.push(foundRed);
		}
	} else {
		for (let r = 0; r < GRID_SIZE; r++) {
			for (let c = 0; c < GRID_SIZE; c++) {
				if (r === 2 && c === 2) continue;

				let valid = true;
				for (let tr = 0; tr < GRID_SIZE && valid; tr++) {
					for (let tc = 0; tc < GRID_SIZE && valid; tc++) {
						const state = grid[tr][tc];
						if (state === "unrevealed") continue;
						if (!isConsistent(r, c, tr, tc, state)) {
							valid = false;
						}
					}
				}

				if (valid) {
					validPositions.push([r, c]);
				}
			}
		}
	}

	const probabilities: ProbabilityGrid = Array.from({ length: GRID_SIZE }, () =>
		Array<number | null>(GRID_SIZE).fill(null),
	);

	const posCounts = new Map<string, number>();
	for (const [vr, vc] of validPositions) {
		const key = `${vr},${vc}`;
		posCounts.set(key, (posCounts.get(key) ?? 0) + 1);
	}

	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c] === "unrevealed") {
				const count = posCounts.get(`${r},${c}`) ?? 0;
				probabilities[r][c] =
					validPositions.length > 0 ? count / validPositions.length : 0;
			}
		}
	}

	let bestProb = -1;
	let recommendation: [number, number] | null = null;

	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (probabilities[r][c] !== null && probabilities[r][c]! > bestProb) {
				bestProb = probabilities[r][c]!;
				recommendation = [r, c];
			}
		}
	}

	return {
		probabilities,
		validPositions: validPositions.length,
		recommendation,
	};
}
