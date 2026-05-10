import { useMemo, useState } from "react";
import {
	type CellState,
	type Grid,
	type ViewMode,
	CELL_COLORS,
	createEmptyGrid,
} from "../shared/types";
import { computeEVGrid, findEVRecommendation } from "../shared/ev";
import { MAX_CLICKS, TOTAL_PURPLES } from "./types";
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
	const [mode, setMode] = useState<ViewMode>("probability");
	const result = useMemo(() => solve(grid), [grid]);

	const purples = (() => {
		let count = 0;
		for (const row of grid) for (const c of row) if (c === "purple") count++;
		return count;
	})();

	const pointOverrides = useMemo(() => {
		const remaining = Math.max(1, 3 - purples);
		return {
			purple: 9 + 154 / remaining,
		};
	}, [purples]);

	const evGrid = useMemo(
		() => computeEVGrid(result.colorDistributions, pointOverrides),
		[result.colorDistributions, pointOverrides],
	);

	const recommendation = useMemo(() => findEVRecommendation(evGrid), [evGrid]);

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

	const nonPurpleClicks = (() => {
		let count = 0;
		for (const row of grid)
			for (const c of row) if (c !== "unrevealed" && c !== "purple") count++;
		return count;
	})();

	const purplesFound = purples >= 3;
	const overClicks = nonPurpleClicks > MAX_CLICKS;
	const allFound = purples >= TOTAL_PURPLES;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Ouro Quest</CardTitle>
				<CardDescription>
					Find 3 of 4 purple spheres in 7 clicks. Purple clicks are free. Click
					tiles to set their revealed state.
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

				<div className="flex items-center gap-1">
					<Button
						variant={mode === "probability" ? "secondary" : "ghost"}
						size="xs"
						onClick={() => setMode("probability")}
					>
						Prob %
					</Button>
					<Button
						variant={mode === "ev" ? "secondary" : "ghost"}
						size="xs"
						onClick={() => setMode("ev")}
					>
						EV pts
					</Button>
				</div>

				<div className="flex justify-center">
					<OuroQuestGrid
						grid={grid}
						probabilities={result.probabilities}
						colorDistributions={result.colorDistributions}
						evGrid={evGrid}
						mode={mode}
						recommendation={recommendation}
						onCellChange={handleCellChange}
					/>
				</div>

				<Separator />

				<div className="flex flex-wrap items-center gap-2">
					<Badge variant={overClicks ? "destructive" : "outline"}>
						Clicks: {nonPurpleClicks}/{MAX_CLICKS}
					</Badge>
					<Badge variant={purplesFound ? "default" : "secondary"}>
						Purples: {purples}/{TOTAL_PURPLES}
					</Badge>
					<Badge variant="outline">
						{result.validConfigs.toLocaleString()} config
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
