import { useMemo, useState } from "react";
import {
	type CellState,
	type Grid,
	CELL_COLORS,
	MAX_CLICKS,
	TOTAL_PURPLES,
	countPurples,
	countRevealed,
	createEmptyGrid,
} from "./types";
import { solve } from "./solver";
import { OuroQuestGrid } from "./grid";
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

export function OuroQuestSolver() {
	const [grid, setGrid] = useState<Grid>(createEmptyGrid);
	const result = useMemo(() => solve(grid), [grid]);
	const clicks = countRevealed(grid);
	const purples = countPurples(grid);

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

	const purplesFound = purples >= 3;
	const overClicks = clicks > MAX_CLICKS;
	const allFound = purples >= TOTAL_PURPLES;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ouro Quest</CardTitle>
				<CardDescription>
					Find 3 of 4 purple spheres in 7 clicks. Click tiles to set their
					revealed state.
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="flex flex-wrap items-center gap-1.5 text-[0.65rem]">
					{(["blue", "teal", "green", "yellow", "orange"] as CellState[]).map(
						(s) => (
							<Badge key={s} variant="outline" className="gap-1">
								<span
									className="inline-block size-2 rounded-sm"
									style={{ backgroundColor: CELL_COLORS[s] }}
								/>
								{s.charAt(0).toUpperCase() + s.slice(1)}=
								{s === "blue"
									? "0"
									: s === "teal"
										? "1"
										: s === "green"
											? "2"
											: s === "yellow"
												? "3"
												: "4"}
							</Badge>
						),
					)}
				</div>

				<div className="flex justify-center">
					<OuroQuestGrid
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
					<Badge variant={purplesFound ? "default" : "secondary"}>
						Purples: {purples}/{TOTAL_PURPLES}
					</Badge>
					<Badge variant="outline">
						{result.validConfigs.toLocaleString()} valid config
						{result.validConfigs !== 1 ? "s" : ""}
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

				{allFound && (
					<Badge variant="default" className="self-start">
						All purple spheres found!
					</Badge>
				)}
			</CardContent>
		</Card>
	);
}
