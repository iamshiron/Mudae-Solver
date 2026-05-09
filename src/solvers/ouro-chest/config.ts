import { type SolverGridConfig } from "../shared/grid";
import { OURO_CHEST_STATES, OURO_CHEST_LABELS } from "./types";

export const OURO_CHEST_CONFIG: SolverGridConfig = {
	states: OURO_CHEST_STATES,
	labels: OURO_CHEST_LABELS,
	gridSize: 5,
	highlightRgb: [239, 68, 68],
	targetLabel: "red sphere",
};
