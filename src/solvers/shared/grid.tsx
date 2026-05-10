import {
	type CellState,
	type Grid,
	type ProbabilityGrid,
	type EVGrid,
	type ViewMode,
	CELL_COLORS,
} from "./types";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface SolverGridConfig {
	states: readonly CellState[];
	labels: Record<string, string>;
	gridSize: number;
	highlightRgb: readonly [number, number, number];
	targetLabel: string;
}

interface SolverGridProps {
	config: SolverGridConfig;
	grid: Grid;
	probabilities: ProbabilityGrid;
	evGrid: EVGrid;
	mode: ViewMode;
	recommendation: [number, number] | null;
	onCellChange: (row: number, col: number, state: CellState) => void;
}

export function SolverGrid({
	config,
	grid,
	probabilities,
	evGrid,
	mode,
	recommendation,
	onCellChange,
}: SolverGridProps) {
	const { states, labels, gridSize, highlightRgb, targetLabel } = config;

	const maxEv = useMemoMaxEv(evGrid);

	return (
		<div className="grid w-full max-w-[320px] grid-cols-5 gap-2">
			{Array.from({ length: gridSize * gridSize }, (_, i) => {
				const r = Math.floor(i / gridSize);
				const c = i % gridSize;
				const state = grid[r][c];
				const prob = probabilities[r][c];
				const ev = evGrid[r][c];
				const isRec = recommendation?.[0] === r && recommendation?.[1] === c;
				const isUnrevealed = state === "unrevealed";

				const bgColor = isUnrevealed
					? { backgroundColor: "#27272A" }
					: { backgroundColor: CELL_COLORS[state] };

				const outline = computeOutline(
					prob,
					ev,
					isUnrevealed,
					mode,
					highlightRgb,
					maxEv,
				);

				const recGlow = isRec
					? { boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.9)" }
					: {};

				const displayValue = computeDisplayValue(prob, ev, isUnrevealed, mode);

				return (
					<DropdownMenu key={i}>
						<Tooltip>
							<TooltipTrigger asChild>
								<DropdownMenuTrigger
									className={cn(
										"aspect-square w-full rounded-md transition-all cursor-pointer border-solid",
										"flex items-center justify-center p-0 outline-none",
										isRec && !isUnrevealed && "ring-2 ring-amber-400",
									)}
									style={{ ...bgColor, ...outline, ...recGlow }}
								>
									{displayValue !== null && (
										<span className="pointer-events-none text-[0.55rem] font-semibold leading-none text-white/80">
											{displayValue}
										</span>
									)}
								</DropdownMenuTrigger>
							</TooltipTrigger>
							<TooltipContent side="top" sideOffset={4}>
								{isUnrevealed
									? formatTooltip(prob, ev, mode, targetLabel)
									: labels[state]}
							</TooltipContent>
						</Tooltip>
						<DropdownMenuContent align="center" className="min-w-36">
							<DropdownMenuRadioGroup
								value={state}
								onValueChange={(v) => onCellChange(r, c, v as CellState)}
							>
								{states.map((s) => (
									<DropdownMenuRadioItem key={s} value={s} className="gap-2">
										<span
											className={cn(
												"inline-block size-3 shrink-0 rounded-sm",
												s === "unrevealed" && "bg-muted-foreground/30",
											)}
											style={
												s !== "unrevealed"
													? { backgroundColor: CELL_COLORS[s] }
													: undefined
											}
										/>
										{labels[s]}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			})}
		</div>
	);
}

function useMemoMaxEv(evGrid: EVGrid): number {
	let max = 0;
	for (const row of evGrid) {
		for (const v of row) {
			if (v !== null && v > max) max = v;
		}
	}
	return max;
}

function computeOutline(
	prob: number | null,
	ev: number | null,
	isUnrevealed: boolean,
	mode: ViewMode,
	highlightRgb: readonly [number, number, number],
	maxEv: number,
): React.CSSProperties {
	if (!isUnrevealed) {
		return { borderWidth: "1px", borderColor: "rgba(255,255,255,0.06)" };
	}

	if (mode === "ev" && ev !== null && maxEv > 0) {
		const intensity = ev / maxEv;
		return {
			borderWidth: `${Math.max(1, Math.round(intensity * 4))}px`,
			borderColor: `rgba(${highlightRgb[0]}, ${highlightRgb[1]}, ${highlightRgb[2]}, ${Math.max(intensity * 0.9, 0.15)})`,
		};
	}

	if (prob !== null) {
		return {
			borderWidth: `${Math.max(1, Math.round(prob * 4))}px`,
			borderColor: `rgba(${highlightRgb[0]}, ${highlightRgb[1]}, ${highlightRgb[2]}, ${Math.max(prob * 0.9, 0.15)})`,
		};
	}

	return { borderWidth: "1px", borderColor: "rgba(255,255,255,0.06)" };
}

function computeDisplayValue(
	prob: number | null,
	ev: number | null,
	isUnrevealed: boolean,
	mode: ViewMode,
): string | null {
	if (!isUnrevealed) return null;

	if (mode === "ev") {
		if (ev !== null) return Math.round(ev).toString();
		return null;
	}

	if (prob !== null) return Math.round(prob * 100).toString();
	return null;
}

function formatTooltip(
	prob: number | null,
	ev: number | null,
	mode: ViewMode,
	targetLabel: string,
): string {
	if (mode === "ev") {
		if (ev !== null) return `~${Math.round(ev)} expected points`;
		return "Click to set state";
	}

	if (prob !== null)
		return `${Math.round(prob * 100)}% chance of ${targetLabel}`;
	return "Click to set state";
}
