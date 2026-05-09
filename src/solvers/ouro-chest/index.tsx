import { useMemo, useState } from "react";
import {
	type CellState,
	type Grid,
	CELL_COLORS,
	countRevealed,
	createEmptyGrid,
} from "../shared/types";
import { MAX_CLICKS, OURO_CHEST_LABELS } from "./types";
import { solve } from "./solver";
import { OuroChestGrid } from "./grid";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ArrowCounterClockwise } from "@phosphor-icons/react";

export function OuroChestSolver() {
	const [grid, setGrid] = useState<Grid>(createEmptyGrid);
	const result = useMemo(() => solve(grid), [grid]);
	const clicks = countRevealed(grid);

	const hasRed = grid.some((row) => row.some((c) => c === "red"));

	const handleCellChange = (row: number, col: number, state: CellState) => {
		setGrid((prev) => {
			const next = prev.map((r) => [...r]);
			next[row][col] = state;
			return next;
		});
	};

	const handleReset = () => {
		setGrid(createEmptyGrid());
	};

	const overClicks = clicks > MAX_CLICKS;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ouro Chest</CardTitle>
				<CardDescription>
					Find the red sphere in 5 clicks. Colors indicate the tile&apos;s
					relationship to the red sphere.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-1.5 text-[0.65rem]">
					{(["orange", "yellow", "green", "teal", "blue"] as CellState[]).map(
						(s) => (
							<Badge key={s} variant="outline" className="gap-1">
								<span
									className="inline-block size-2 rounded-sm"
									style={{ backgroundColor: CELL_COLORS[s] }}
								/>
								{OURO_CHEST_LABELS[s]}
							</Badge>
						),
					)}
				</div>

				<div className="flex justify-center">
					<OuroChestGrid
						grid={grid}
						probabilities={result.probabilities}
						recommendation={result.recommendation}
						onCellChange={handleCellChange}
					/>
				</div>

				<Separator />

				<div className="flex flex-wrap items-center gap-2">
					<Badge variant={overClicks ? "destructive" : "outline"}>
						Clicks: {clicks}/{MAX_CLICKS}
					</Badge>
					<Badge variant="outline">
						{result.validPositions} valid position
						{result.validPositions !== 1 ? "s" : ""}
					</Badge>
					<Button
						variant="outline"
						size="sm"
						onClick={handleReset}
						className="ml-auto"
					>
						<ArrowCounterClockwise className="size-3.5" />
						Reset
					</Button>
				</div>

				{overClicks && (
					<Badge variant="destructive" className="self-start">
						Over the click limit!
					</Badge>
				)}

				{hasRed && (
					<Badge variant="default" className="self-start">
						Red sphere found!
					</Badge>
				)}
			</CardContent>
		</Card>
	);
}
