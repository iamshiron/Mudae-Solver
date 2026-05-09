import { type SolverGridConfig } from "../shared/grid";
import { OURO_QUEST_STATES, OURO_QUEST_LABELS } from "./types";

export const OURO_QUEST_CONFIG: SolverGridConfig = {
	states: OURO_QUEST_STATES,
	labels: OURO_QUEST_LABELS,
	gridSize: 5,
	highlightRgb: [168, 85, 247],
	targetLabel: "purple sphere",
};
