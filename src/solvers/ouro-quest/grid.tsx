import type {
	CellState,
	Grid,
	ProbabilityGrid,
	ColorDistributionGrid,
	EVGrid,
	ViewMode,
} from "../shared/types";
import { SolverGrid } from "../shared/grid";
import { OURO_QUEST_CONFIG } from "./config";

interface OuroQuestGridProps {
	grid: Grid;
	probabilities: ProbabilityGrid;
	colorDistributions: ColorDistributionGrid;
	evGrid: EVGrid;
	mode: ViewMode;
	recommendation: [number, number] | null;
	onCellChange: (row: number, col: number, state: CellState) => void;
}

export function OuroQuestGrid(props: OuroQuestGridProps) {
	return <SolverGrid config={OURO_QUEST_CONFIG} {...props} />;
}
