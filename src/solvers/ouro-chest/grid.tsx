import type { CellState, Grid, ProbabilityGrid } from "../shared/types";
import { SolverGrid } from "../shared/grid";
import { OURO_CHEST_CONFIG } from "./config";

interface OuroChestGridProps {
	grid: Grid;
	probabilities: ProbabilityGrid;
	recommendation: [number, number] | null;
	onCellChange: (row: number, col: number, state: CellState) => void;
}

export function OuroChestGrid(props: OuroChestGridProps) {
	return <SolverGrid config={OURO_CHEST_CONFIG} {...props} />;
}
