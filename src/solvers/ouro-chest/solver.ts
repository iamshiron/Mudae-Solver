import {
	type CellState,
	type Grid,
	type ProbabilityGrid,
	type ColorDistributionGrid,
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

function getColorForPosition(
	tileR: number,
	tileC: number,
	redR: number,
	redC: number,
): CellState {
	if (tileR === redR && tileC === redC) return "red";
	if (isAdjacent(tileR, tileC, redR, redC)) return "orange";
	if (isOnDiagonal(tileR, tileC, redR, redC)) return "yellow";
	if (tileR === redR || tileC === redC) return "green";
	if (isInLine(tileR, tileC, redR, redC)) return "teal";
	return "blue";
}

export interface SolveResult {
	probabilities: ProbabilityGrid;
	colorDistributions: ColorDistributionGrid;
	validPositions: number;
}

export function solve(grid: Grid): SolveResult {
	const emptyGrid = <T>(fill: T): T[][] =>
		Array.from({ length: GRID_SIZE }, () =>
			Array.from<T>({ length: GRID_SIZE }).fill(fill),
		);

	let foundRed: [number, number] | null = null;
	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c] === "red") {
				if (foundRed !== null) {
					return {
						probabilities: emptyGrid(null),
						colorDistributions: emptyGrid(null),
						validPositions: 0,
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

	const probabilities: ProbabilityGrid = emptyGrid(null);
	const colorDistributions: ColorDistributionGrid = emptyGrid(null);

	const total = validPositions.length;

	for (let r = 0; r < GRID_SIZE; r++) {
		for (let c = 0; c < GRID_SIZE; c++) {
			if (grid[r][c] !== "unrevealed") continue;

			const counts: Record<string, number> = {};

			for (const [vr, vc] of validPositions) {
				if (vr === r && vc === c) {
					counts["red"] = (counts["red"] ?? 0) + 1;
				} else {
					const color = getColorForPosition(r, c, vr, vc);
					counts[color] = (counts[color] ?? 0) + 1;
				}
			}

			const dist: Record<string, number> = {};
			for (const [color, count] of Object.entries(counts)) {
				dist[color] = total > 0 ? count / total : 0;
			}

			probabilities[r][c] = dist["red"] ?? 0;
			colorDistributions[r][c] = dist;
		}
	}

	return {
		probabilities,
		colorDistributions,
		validPositions: total,
	};
}
