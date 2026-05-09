import { useState } from "react";
import { OuroQuestSolver } from "@/solvers/ouro-quest";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TABS = [{ id: "ouro-quest", label: "Ouro Quest" }] as const;
type TabId = (typeof TABS)[number]["id"];

export function App() {
	const [activeTab, setActiveTab] = useState<TabId>("ouro-quest");

	return (
		<div className="flex min-h-svh flex-col items-center p-4 sm:p-6">
			<div className="flex w-full max-w-md flex-col gap-3">
				<div className="flex flex-col gap-2">
					<div className="px-1 text-sm font-medium">Mudae Solvers</div>
					<div className="flex gap-1">
						{TABS.map((tab) => (
							<Button
								key={tab.id}
								variant={activeTab === tab.id ? "secondary" : "ghost"}
								size="sm"
								onClick={() => setActiveTab(tab.id)}
							>
								{tab.label}
							</Button>
						))}
					</div>
					<Separator />
				</div>

				{activeTab === "ouro-quest" && <OuroQuestSolver />}
			</div>
		</div>
	);
}

export default App;
