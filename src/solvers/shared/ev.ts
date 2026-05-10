import { type ColorDistributionGrid, type EVGrid, POINT_VALUES } from "./types";

export function computeEV(
	dist: Record<string, number>,
	pointOverrides?: Partial<Record<string, number>>,
): number {
	let ev = 0;
	for (const [color, prob] of Object.entries(dist)) {
		const value = pointOverrides?.[color] ?? POINT_VALUES[color] ?? 0;
		ev += prob * value;
	}
	return ev;
}

export function computeEVGrid(
	distributions: ColorDistributionGrid,
	pointOverrides?: Partial<Record<string, number>>,
): EVGrid {
	const size = distributions.length;
	const evGrid: EVGrid = Array.from({ length: size }, () =>
		Array.from<number | null>({ length: size }).fill(null),
	);

	let maxEv = 0;
	for (let r = 0; r < size; r++) {
		for (let c = 0; c < size; c++) {
			const dist = distributions[r][c];
			if (dist) {
				const ev = computeEV(dist, pointOverrides);
				evGrid[r][c] = ev;
				if (ev > maxEv) maxEv = ev;
			}
		}
	}

	return evGrid;
}

export function findEVRecommendation(evGrid: EVGrid): [number, number] | null {
	let bestEv = -1;
	let best: [number, number] | null = null;

	for (let r = 0; r < evGrid.length; r++) {
		for (let c = 0; c < evGrid[r].length; c++) {
			const ev = evGrid[r][c];
			if (ev !== null && ev > bestEv) {
				bestEv = ev;
				best = [r, c];
			}
		}
	}

	return best;
}
