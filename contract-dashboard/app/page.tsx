"use client";

import { useEffect, useState } from "react";
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	FileText,
	Upload,
} from "lucide-react";
import Link from "next/link";

type Obligation = {
	id: string | number;
	contract_id?: string;
	description?: string;
	task?: string;
	due_date?: string;
	deadline?: string;
	status?: string;
};

type Kpis = {
	totalContracts: number;
	activeObligations: number;
	dueThisWeek: number;
	overdue: number;
	completed: number;
};

const initialKpis: Kpis = {
	totalContracts: 0,
	activeObligations: 0,
	dueThisWeek: 0,
	overdue: 0,
	completed: 0,
};

export default function Dashboard() {
	const [obligations, setObligations] = useState<Obligation[]>([]);
	const [kpis, setKpis] = useState<Kpis>(initialKpis);
	const [loading, setLoading] = useState(true);
	const webhookUrl = "https://martin7animashaun.app.n8n.cloud/webhook/contract-upload";
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

	useEffect(() => {
		const fetchLiveObligations = async () => {
			if (!supabaseUrl || !supabaseKey) {
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(`${supabaseUrl}/rest/v1/obligations?select=*`, {
					headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
				});
				if (!response.ok) throw new Error("Unable to fetch obligations");
				const data: unknown = await response.json();

				if (Array.isArray(data)) {
					const rows = data as Obligation[];
					const completed = rows.filter((ob) => ob.status?.toUpperCase() === "COMPLETED").length;
					setObligations(rows);
					setKpis({
						totalContracts: new Set(rows.map((ob) => ob.contract_id).filter(Boolean)).size,
						activeObligations: rows.length - completed,
						dueThisWeek: rows.filter((ob) => ob.status?.toUpperCase() === "UPCOMING").length,
						overdue: rows.filter((ob) => ob.status?.toUpperCase() === "OVERDUE").length,
						completed,
					});
				}
			} catch (error) {
				console.error("Error fetching Supabase data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLiveObligations();
	}, [supabaseKey, supabaseUrl]);

	const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);
		try {
			const response = await fetch(webhookUrl, { method: "POST", body: formData });
			if (!response.ok) throw new Error("Upload failed");
			alert("Contract sent successfully to Member 1's AI Engine!");
		} catch {
			alert("Error uploading contract.");
		} finally {
			event.target.value = "";
		}
	};

	const getStatusColor = (status?: string) => {
		switch (status?.toUpperCase()) {
			case "OVERDUE": return "bg-red-100 text-red-800 border-red-200";
			case "UPCOMING": return "bg-blue-100 text-blue-800 border-blue-200";
			case "PENDING": return "bg-gray-100 text-gray-800 border-gray-200";
			case "ESCALATED": return "bg-orange-100 text-orange-800 border-orange-200";
			case "DUE": return "bg-yellow-100 text-yellow-800 border-yellow-200";
			case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
			default: return "bg-gray-100 text-gray-800 border-gray-200";
		}
	};

	const cards = [
		[FileText, "TOTAL CONTRACTS", kpis.totalContracts, "text-blue-500"],
		[Clock, "ACTIVE OBLIGATIONS", kpis.activeObligations, "text-purple-500"],
		[Calendar, "DUE THIS WEEK", kpis.dueThisWeek, "text-yellow-500"],
		[AlertTriangle, "OVERDUE", kpis.overdue, "text-red-500"],
		[CheckCircle, "COMPLETED", kpis.completed, "text-green-500"],
	] as const;

	return (
		<main className="min-h-screen bg-gray-50 p-8 font-sans">
			<div className="mx-auto max-w-7xl space-y-8">
				<header className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Contract Intelligence Dashboard</h1>
						<p className="mt-1 text-gray-500">Group 10 Compliance &amp; Obligation Monitoring Engine</p>
					</div>
					<label className="flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700">
						<Upload className="mr-2 h-5 w-5" /> Upload Contract
						<input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx" />
					</label>
				</header>

				<section className="grid grid-cols-1 gap-4 md:grid-cols-5">
					{cards.map(([Icon, label, value, color]) => (
						<div key={label} className="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
							<Icon className={`mb-2 h-8 w-8 ${color}`} />
							<p className="text-sm font-medium text-gray-500">{label}</p>
							<p className="text-2xl font-bold text-gray-900">{value}</p>
						</div>
					))}
				</section>

				<section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
					<div className="border-b border-gray-100 p-6"><h2 className="text-lg font-semibold text-gray-900">Live Obligations Tracker</h2></div>
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-left">
							<thead><tr className="border-b border-gray-100 bg-gray-50 text-sm text-gray-500">
								{['Reference ID', 'Obligation Task', 'Deadline', 'Current Status', 'Action'].map((heading) => <th key={heading} className="p-4 font-medium">{heading}</th>)}
							</tr></thead>
							<tbody className="divide-y divide-gray-100">
								{loading ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">Syncing with Member 3&apos;s Database...</td></tr> : obligations.length === 0 ? <tr><td colSpan={5} className="p-8 text-center text-gray-500">No live obligations found. Use the Upload Contract button above to trigger Member 1&apos;s AI Engine.</td></tr> : obligations.map((ob) => {
									const reference = ob.contract_id || `SYS-${ob.id}`;
									return <tr key={ob.id} className="transition-colors hover:bg-gray-50">
										<td className="p-4 text-sm font-medium text-gray-900">{reference}</td>
										<td className="p-4 text-sm text-gray-600">{ob.description || ob.task || "—"}</td>
										<td className="p-4 text-sm text-gray-600">{ob.due_date || ob.deadline || "Pending Calc"}</td>
										<td className="p-4"><span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(ob.status)}`}>{ob.status || "PENDING"}</span></td>
										<td className="p-4"><Link href={`/contract/${reference}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">View Log</Link></td>
									</tr>;
								})}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</main>
	);
}
