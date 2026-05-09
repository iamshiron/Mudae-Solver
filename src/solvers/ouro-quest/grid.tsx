import {
	type CellState,
	type Grid,
	type ProbabilityGrid,
	CELL_STATES,
	CELL_COLORS,
	CELL_LABELS,
	GRID_SIZE,
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

interface OuroQuestGridProps {
	grid: Grid;
	probabilities: ProbabilityGrid;
	recommendation: [number, number] | null;
	onCellChange: (row: number, col: number, state: CellState) => void;
}

export function OuroQuestGrid({
	grid,
	probabilities,
	recommendation,
	onCellChange,
}: OuroQuestGridProps) {
	return (
		<div className="grid w-full max-w-[320px] grid-cols-5 gap-2">
			{Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
				const r = Math.floor(i / GRID_SIZE);
				const c = i % GRID_SIZE;
				const state = grid[r][c];
				const prob = probabilities[r][c];
				const isRecommended =
					recommendation !== null &&
					recommendation[0] === r &&
					recommendation[1] === c;

				return (
					<CellTile
						key={i}
						row={r}
						col={c}
						state={state}
						probability={prob}
						isRecommended={isRecommended}
						onChange={onCellChange}
					/>
				);
			})}
		</div>
	);
}

interface CellTileProps {
	row: number;
	col: number;
	state: CellState;
	probability: number | null;
	isRecommended: boolean;
	onChange: (row: number, col: number, state: CellState) => void;
}

function CellTile({
	row,
	col,
	state,
	probability,
	isRecommended,
	onChange,
}: CellTileProps) {
	const isUnrevealed = state === "unrevealed";

	const bgColor = isUnrevealed
		? { backgroundColor: "#27272A" }
		: { backgroundColor: CELL_COLORS[state] };

	const probOutline =
		probability !== null && isUnrevealed
			? {
					borderWidth: `${Math.max(1, Math.round(probability * 4))}px`,
					borderColor: `rgba(168, 85, 247, ${Math.max(probability * 0.9, 0.15)})`,
				}
			: { borderWidth: "1px", borderColor: "rgba(255,255,255,0.06)" };

	const recommendedGlow = isRecommended
		? { boxShadow: "0 0 0 2px rgba(245, 158, 11, 0.9)" }
		: {};

	return (
		<DropdownMenu>
			<Tooltip>
				<TooltipTrigger asChild>
					<DropdownMenuTrigger
						className={cn(
							"aspect-square w-full cursor-pointer rounded-md border-solid transition-all",
							"flex items-center justify-center p-0 outline-none",
							isRecommended && !isUnrevealed && "ring-2 ring-amber-400",
						)}
						style={{ ...bgColor, ...probOutline, ...recommendedGlow }}
					>
						{probability !== null && isUnrevealed && (
							<span className="pointer-events-none text-[0.55rem] leading-none font-semibold text-white/80">
								{Math.round(probability * 100)}
							</span>
						)}
					</DropdownMenuTrigger>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={4}>
					{isUnrevealed
						? probability !== null
							? `${Math.round(probability * 100)}% chance of purple sphere`
							: "Click to set state"
						: CELL_LABELS[state]}
				</TooltipContent>
			</Tooltip>
			<DropdownMenuContent align="center" className="min-w-36">
				<DropdownMenuRadioGroup
					value={state}
					onValueChange={(v) => onChange(row, col, v as CellState)}
				>
					{CELL_STATES.map((s) => (
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
							{CELL_LABELS[s]}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
