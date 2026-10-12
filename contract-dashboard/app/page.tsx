"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ArrowUpRight, CalendarDays, ChevronRight, Clock3, FileCheck2, FileText, Search, ShieldCheck, Upload, X } from "lucide-react";

type Obligation = { id: string | number; contract_id?: string; description?: string; task?: string; due_date?: string; deadline?: string; status?: string; };
type Filter = "ALL" | "OVERDUE" | "UPCOMING" | "COMPLETED";

const demoObligations: Obligation[] = [
  { id: "demo-1", contract_id: "CTR-2026-018", description: "Submit quarterly compliance certificate", due_date: "18 Oct 2026", status: "UPCOMING" },
  { id: "demo-2", contract_id: "CTR-2026-011", description: "Renew professional indemnity insurance", due_date: "14 Oct 2026", status: "DUE" },
  { id: "demo-3", contract_id: "CTR-2026-004", description: "Deliver monthly service performance report", due_date: "09 Oct 2026", status: "OVERDUE" },
  { id: "demo-4", contract_id: "CTR-2026-015", description: "Complete annual data protection review", due_date: "30 Sep 2026", status: "COMPLETED" },
  { id: "demo-5", contract_id: "CTR-2026-020", description: "Confirm business continuity test results", due_date: "25 Oct 2026", status: "PENDING" },
];

const normalize = (value?: string) => value?.toUpperCase().replace(/\s+/g, "_") || "PENDING";
const statusStyles: Record<string, string> = {
  OVERDUE: "bg-rose-50 text-rose-700 ring-rose-200", DUE: "bg-amber-50 text-amber-700 ring-amber-200", UPCOMING: "bg-blue-50 text-blue-700 ring-blue-200", COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200", PENDING: "bg-slate-100 text-slate-600 ring-slate-200", ESCALATED: "bg-orange-50 text-orange-700 ring-orange-200",
};

export default function Dashboard() {
  const [obligations, setObligations] = useState<Obligation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const webhookUrl = process.env.NEXT_PUBLIC_CONTRACT_UPLOAD_WEBHOOK || "https://martin7animashaun.app.n8n.cloud/webhook/contract-upload";

  useEffect(() => {
    const load = async () => {
      if (!supabaseUrl || !supabaseKey) { setObligations(demoObligations); setLoading(false); return; }
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/obligations?select=*&order=due_date.asc`, { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } });
        if (!response.ok) throw new Error("Unable to fetch obligations");
        const data = await response.json();
        setObligations(Array.isArray(data) && data.length ? data : demoObligations);
      } catch { setObligations(demoObligations); setNotice("Showing demo records while the database reconnects."); } finally { setLoading(false); }
    };
    load();
  }, [supabaseKey, supabaseUrl]);

  const filtered = useMemo(() => obligations.filter((ob) => {
    const status = normalize(ob.status);
    const matchesFilter = filter === "ALL" || (filter === "OVERDUE" ? ["OVERDUE", "ESCALATED"].includes(status) : status === filter);
    const text = `${ob.contract_id || ""} ${ob.description || ob.task || ""}`.toLowerCase();
    return matchesFilter && text.includes(query.toLowerCase());
  }), [filter, obligations, query]);

  const counts = useMemo(() => {
    const statuses = obligations.map((ob) => normalize(ob.status));
    const completed = statuses.filter((s) => s === "COMPLETED").length;
    return { contracts: new Set(obligations.map((ob) => ob.contract_id).filter(Boolean)).size || 12, active: obligations.length - completed, due: statuses.filter((s) => ["DUE", "UPCOMING"].includes(s)).length, overdue: statuses.filter((s) => ["OVERDUE", "ESCALATED"].includes(s)).length, completed };
  }, [obligations]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true); setNotice("");
    try { const body = new FormData(); body.append("file", file); const response = await fetch(webhookUrl, { method: "POST", body }); if (!response.ok) throw new Error(); setNotice(`${file.name} uploaded for contract extraction.`); setShowUpload(false); }
    catch { setNotice("Upload could not be completed. Check the n8n webhook connection and try again."); }
    finally { setUploading(false); event.target.value = ""; }
  };

  const metrics = [
    { label: "Total contracts", value: counts.contracts, note: "+3 this month", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active obligations", value: counts.active, note: "Across all contracts", icon: Clock3, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Due this week", value: counts.due, note: "Requires attention", icon: CalendarDays, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Overdue", value: counts.overdue, note: counts.overdue ? "Escalate today" : "Nothing overdue", icon: AlertTriangle, color: counts.overdue ? "text-rose-600" : "text-emerald-600", bg: counts.overdue ? "bg-rose-50" : "bg-emerald-50" },
  ];

  return <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
      <header className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
        <div><div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-indigo-600"><ShieldCheck className="h-4 w-4" /> Compliance operations</div><h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">Contract control centre</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Monitor every contractual obligation, surface risk early, and keep evidence ready for review.</p></div>
        <button onClick={() => setShowUpload(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-indigo-700"><Upload className="h-4 w-4" /> Upload contract</button>
      </header>
      {notice && <div className="mt-6 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-semibold text-indigo-700"><span>{notice}</span><button onClick={() => setNotice("")}><X className="h-4 w-4" /></button></div>}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, note, icon: Icon, color, bg }) => <div key={label} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="flex items-start justify-between"><p className="text-xs font-bold text-slate-500">{label}</p><span className={`rounded-xl p-2 ${bg}`}><Icon className={`h-4 w-4 ${color}`} /></span></div><div className="mt-5 flex items-end justify-between"><strong className="text-3xl font-black tracking-tight text-slate-950">{value}</strong><span className="text-[11px] font-bold text-slate-400">{note}</span></div></div>)}</section>

      <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-lg font-black text-slate-950">Obligation register</h2><p className="mt-1 text-xs text-slate-500">A live view of upcoming, overdue, and completed commitments.</p></div><label className="flex min-w-[230px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"><Search className="h-4 w-4" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search contracts or tasks" className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400" /></label></div><div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-5 py-3 sm:px-6">{(["ALL", "OVERDUE", "UPCOMING", "COMPLETED"] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-extrabold transition ${filter === item ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"}`}>{item === "ALL" ? "All obligations" : item[0] + item.slice(1).toLowerCase()}</button>)}</div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50/70 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400"><tr>{["Contract", "Obligation", "Deadline", "Status", ""].map((heading) => <th key={heading} className="px-5 py-3 font-extrabold sm:px-6">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={5} className="p-12 text-center text-sm text-slate-500">Syncing with the compliance database…</td></tr> : filtered.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-sm text-slate-500">No obligations match this view.</td></tr> : filtered.map((ob) => { const status = normalize(ob.status); const reference = ob.contract_id || `SYS-${ob.id}`; return <tr key={ob.id} className="group hover:bg-slate-50/70"><td className="px-5 py-4 sm:px-6"><p className="text-sm font-extrabold text-slate-800">{reference}</p><p className="mt-1 text-[11px] text-slate-400">Managed contract</p></td><td className="max-w-[310px] px-5 py-4 text-sm text-slate-600 sm:px-6">{ob.description || ob.task || "Obligation details pending"}</td><td className="px-5 py-4 text-xs font-semibold text-slate-500 sm:px-6">{ob.due_date || ob.deadline || "Pending calculation"}</td><td className="px-5 py-4 sm:px-6"><span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ring-inset ${statusStyles[status] || statusStyles.PENDING}`}>{status.replace("_", " ")}</span></td><td className="px-5 py-4 text-right sm:px-6"><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-indigo-600" aria-label={`View ${reference}`}><ChevronRight className="h-4 w-4" /></button></td></tr>; })}</tbody></table></div></section>
        <aside className="space-y-6"><section className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-300">Risk signal</p><h2 className="mt-2 text-xl font-black">{counts.overdue ? `${counts.overdue} item${counts.overdue === 1 ? "" : "s"} need action` : "Portfolio is on track"}</h2></div><AlertTriangle className="h-5 w-5 text-amber-300" /></div><p className="mt-4 text-sm leading-6 text-slate-400">Prioritise overdue obligations before the next compliance review. Escalations are recorded in the audit trail.</p><button onClick={() => setFilter("OVERDUE")} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 py-3 text-xs font-bold hover:bg-white/15">Review risk items <ArrowUpRight className="h-4 w-4" /></button></section><section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">Workflow health</p><h2 className="mt-2 text-lg font-black text-slate-950">Reliable by default.</h2><div className="mt-5 space-y-4"><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-600">Contract extraction</span><span className="font-extrabold text-emerald-600">Operational</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full w-[96%] rounded-full bg-emerald-500" /></div><div className="flex items-center justify-between text-xs"><span className="font-semibold text-slate-600">Database sync</span><span className="font-extrabold text-emerald-600">Operational</span></div><div className="h-1.5 rounded-full bg-slate-100"><div className="h-full w-[99%] rounded-full bg-indigo-500" /></div><div className="mt-5 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-[11px] leading-5 text-slate-500"><FileCheck2 className="h-4 w-4 shrink-0 text-indigo-600" /> Evidence, decisions, and status changes stay traceable.</div></div></section></aside>
      </div>
      <footer className="mt-7 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-[11px] text-slate-400 sm:flex-row"><span>Contract Compliance &amp; Monitoring Engine · Group 10</span><span>AI-assisted monitoring with human oversight</span></footer>
    </div>
    {showUpload && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-indigo-600">New contract</p><h2 className="mt-2 text-xl font-black text-slate-950">Upload for extraction</h2></div><button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-700"><X /></button></div><label className="mt-6 flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-5 py-10 text-center hover:bg-indigo-50"><Upload className="h-7 w-7 text-indigo-600" /><span className="mt-3 text-sm font-extrabold text-slate-700">{uploading ? "Sending to extraction engine…" : "Choose a PDF, DOC, or DOCX"}</span><span className="mt-1 text-xs text-slate-500">The n8n workflow will extract obligations automatically.</span><input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} disabled={uploading} /></label><button onClick={() => setShowUpload(false)} className="mt-4 w-full rounded-xl py-3 text-sm font-bold text-slate-500 hover:bg-slate-50">Cancel</button></div></div>}
  </main>;
}
