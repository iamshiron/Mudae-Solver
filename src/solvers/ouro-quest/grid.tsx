import type { CellState } from "../shared/types";
import { SolverGrid } from "../shared/grid";
import { OURO_QUEST_CONFIG } from "./config";
import type { Grid, ProbabilityGrid } from "../shared/types";

interface OuroQuestGridProps {
	grid: Grid;
	probabilities: ProbabilityGrid;
	recommendation: [number, number] | null;
	onCellChange: (row: number, col: number, state: CellState) => void;
}

export function OuroQuestGrid(props: OuroQuestGridProps) {
	return <SolverGrid config={OURO_QUEST_CONFIG} {...props} />;
}
