"use client";

import { useState } from "react";
import { FileText, AlertTriangle, CheckCircle, Clock, Calendar } from "lucide-react";

export default function Dashboard() {
  // Mock Data: You will replace this with Supabase fetches later
  const mockKPIs = {
    totalContracts: 12,
    activeObligations: 8,
    dueThisWeek: 3,
    overdue: 1,
    completed: 45
  };

  const mockObligations = [
    { id: 1, contract: "ABC - XYZ Service Agreement", description: "Equipment delivery", due: "2026-10-21", status: "UPCOMING" },
    { id: 2, contract: "DEF/GHI License Setup", description: "Payment of ₦5,000,000", due: "2026-10-05", status: "OVERDUE" },
    { id: 3, contract: "Vendor Alpha Supply", description: "Submit SLA Report", due: "2026-10-08", status: "PENDING" },
    { id: 4, contract: "TechCorp NDA", description: "Renew Annual License", due: "2026-10-31", status: "UPCOMING" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'OVERDUE': return 'bg-red-100 text-red-800 border-red-200';
      case 'UPCOMING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PENDING': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ESCALATED': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'DUE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contract Intelligence Dashboard</h1>
            <p className="text-gray-500 mt-1">Group 10 Compliance & Obligation Monitoring Engine</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <FileText className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-sm text-gray-500 font-medium">TOTAL CONTRACTS</p>
            <p className="text-2xl font-bold text-gray-900">{mockKPIs.totalContracts}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Clock className="w-8 h-8 text-purple-500 mb-2" />
            <p className="text-sm text-gray-500 font-medium">ACTIVE OBLIGATIONS</p>
            <p className="text-2xl font-bold text-gray-900">{mockKPIs.activeObligations}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <Calendar className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-sm text-gray-500 font-medium">DUE THIS WEEK</p>
            <p className="text-2xl font-bold text-gray-900">{mockKPIs.dueThisWeek}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex flex-col items-center text-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm text-red-500 font-medium">OVERDUE</p>
            <p className="text-2xl font-bold text-red-700">{mockKPIs.overdue}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-sm text-gray-500 font-medium">COMPLETED</p>
            <p className="text-2xl font-bold text-gray-900">{mockKPIs.completed}</p>
          </div>
        </div>

        {/* Obligations Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Current & Upcoming Obligations</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Contract</th>
                  <th className="p-4 font-medium">Obligation</th>
                  <th className="p-4 font-medium">Due Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockObligations.map((ob) => (
                  <tr key={ob.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{ob.contract}</td>
                    <td className="p-4 text-sm text-gray-600">{ob.description}</td>
                    <td className="p-4 text-sm text-gray-600">{ob.due}</td>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(ob.status)}`}>
                        {ob.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}