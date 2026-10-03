"use client";

import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Clock, Activity } from "lucide-react";
import Link from "next/link";

export default function ContractDetails() {
  // Mock Data: To be replaced with Member 3's Supabase data
  const contract = {
    title: "ABC - XYZ Service Agreement",
    parties: ["ABC Ltd", "XYZ Ltd"],
    effectiveDate: "2026-10-01",
    expirationDate: "2026-12-31",
    status: "ACTIVE",
  };

  const obligations = [
    { id: 1, desc: "Pay XYZ Ltd ₦5,000,000", deadline: "2026-10-31", status: "PENDING" },
    { id: 2, desc: "Deliver equipment", deadline: "2026-10-21", status: "UPCOMING" }
  ];

  const auditLogs = [
    { id: 101, time: "2026-10-01 09:00", event: "Contract Uploaded", status: "SUCCESS" },
    { id: 102, time: "2026-10-01 09:05", event: "AI Extraction Completed", status: "SUCCESS" },
    { id: 103, time: "2026-10-01 09:06", event: "Obligations Created", status: "SUCCESS" },
    { id: 104, time: "2026-10-18 08:00", event: "DEADLINE_CHECK", details: "Equipment delivery due in 3 days", status: "SUCCESS" },
    { id: 105, time: "2026-10-18 08:01", event: "Telegram Reminder Sent", status: "SUCCESS" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-500" />
              {contract.title}
            </h1>
            <p className="text-gray-500 mt-2">Parties: {contract.parties.join(" & ")}</p>
          </div>
          <span className="bg-green-100 text-green-800 border border-green-200 text-xs font-semibold px-4 py-2 rounded-full">
            {contract.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Details & Obligations */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Dates */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Effective Date</p>
                <p className="text-lg font-semibold text-gray-900">{contract.effectiveDate}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 font-medium">Expiration Date</p>
                <p className="text-lg font-semibold text-gray-900">{contract.expirationDate}</p>
              </div>
            </div>

            {/* Obligations List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Tracked Obligations</h2>
              </div>
              <div className="p-6 space-y-4">
                {obligations.map((ob) => (
                  <div key={ob.id} className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{ob.desc}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" /> Due: {ob.deadline}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {ob.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Audit Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Audit Log</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6 border-l-2 border-gray-100 ml-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white"></span>
                    <p className="text-sm font-medium text-gray-900">{log.event}</p>
                    {log.details && <p className="text-xs text-gray-500 mt-1">{log.details}</p>}
                    <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}