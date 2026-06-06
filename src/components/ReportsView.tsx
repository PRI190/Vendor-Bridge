import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Layers, 
  Users, 
  Clock, 
  CheckSquare, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';

export default function ReportsView() {
  const [selectedMonth, setSelectedMonth] = useState('May 2025');

  const handleExport = () => {
    alert(`VendorBridge ERP Engine:\nPreparing spreadsheet dataset for cycle [${selectedMonth}]...\nExcel workbook export dispatched to download buffer.`);
  };

  const spendCategories = [
    { name: 'IT Hardware', amount: '₹4.8L', percentage: 75, color: '#2563eb' },
    { name: 'Furniture', amount: '₹3.2L', percentage: 55, color: '#059669' },
    { name: 'Stationery', amount: '₹2.1L', percentage: 38, color: '#eab308' },
    { name: 'Logistics', amount: '₹2.3L', percentage: 42, color: '#f97316' }
  ];

  const topVendors = [
    { name: 'TechCore Ltd', spend: '4,20,000', pos: 6 },
    { name: 'Infra Supplies', spend: '3,10,000', pos: 4 },
    { name: 'FastLog', spend: '1,90,000', pos: 3 }
  ];

  const monthlyTrends = [
    { month: 'Dec', height: 'h-16', active: false },
    { month: 'Jan', height: 'h-24', active: false },
    { month: 'Feb', height: 'h-18', active: false },
    { month: 'Mar', height: 'h-32', active: false },
    { month: 'Apr', height: 'h-28', active: false },
    { month: 'May', height: 'h-36', active: true } // Highlighted May as blue!
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Target Title bar & Controls Screen 11 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            Reports & Analytics
          </h1>
          <p className="text-sm text-slate-400">
            Procurement Insights &mdash; {selectedMonth} Audit Summary.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 border border-slate-800 rounded-xl w-fit self-end">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-900 text-slate-300 font-bold font-mono text-[11px] p-2 rounded-lg border border-slate-800"
          >
            <option value="May 2025">May 2025</option>
            <option value="April 2025">April 2025</option>
            <option value="Q1 Consolidated">Q1 Consolidated</option>
          </select>
          
          <button
            onClick={handleExport}
            className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 p-2 px-4 rounded-lg text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-slate-950 stroke-[2.3]" />
            EXPORT
          </button>
        </div>
      </div>

      {/* Screen 11 customized Top Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 - Total Spend */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Total Spend</p>
          <p className="text-3xl font-black text-blue-400 font-mono mt-2">12.4 L</p>
          <p className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">Allocated corporate budget limits</p>
        </div>

        {/* KPI 2 - Active Vendors */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Active Vendors</p>
          <p className="text-3xl font-black text-emerald-400 font-mono mt-2">28</p>
          <p className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">Verified GSTIN compliant pools</p>
        </div>

        {/* KPI 3 - PO Fulfillment */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono font-bold">PO Fulfillment</p>
          <p className="text-3xl font-black text-amber-500 font-mono mt-2">94%</p>
          <p className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">Logistics SLAs successfully cleared</p>
        </div>

        {/* KPI 4 - Overdue Invoices */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Overdue Invoices</p>
          <p className="text-3xl font-black text-rose-500 font-mono mt-2">3</p>
          <p className="text-[10px] text-slate-500 font-mono mt-1 font-semibold">Settlements queue exceed limits</p>
        </div>

      </div>

      {/* Main core layout of Screen 11 report page */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Card: SPEND BY CATEGORY - 6 columns */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="font-display font-black text-white text-base uppercase tracking-wider text-xs font-mono text-slate-400">
              Spend by Category
            </h3>
            <p className="text-xs text-slate-500">Corporate resource allocation comparison</p>
          </div>

          <div className="space-y-5">
            {spendCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{cat.name}</span>
                  <span className="font-mono font-bold text-slate-300">{cat.amount}</span>
                </div>
                
                {/* Simulated progress bar */}
                <div className="w-full h-2.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side group containing Vendor List and Monthly Trend - 6 columns */}
        <div className="lg:col-span-6 grid grid-cols-1 gap-6">
          
          {/* Top segment: TOP VENDORS BY SPEND list */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="font-display font-black text-white text-base uppercase tracking-wider text-xs font-mono text-slate-400">
                Top Vendors by Spend
              </h3>
              <p className="text-xs text-slate-500">Highest value strategic suppliers and purchase count</p>
            </div>

            <div className="overflow-x-auto border border-slate-850 rounded-xl">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                    <th className="p-3">Vendor</th>
                    <th className="p-3 text-center">Spend (₹)</th>
                    <th className="p-3 text-right">POs Cleared</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 font-mono text-slate-350">
                  {topVendors.map((v, i) => (
                    <tr key={i} className="hover:bg-slate-800/15">
                      <td className="p-3 font-sans font-bold text-slate-200">{v.name}</td>
                      <td className="p-3 text-center text-slate-300 font-bold">₹{v.spend}</td>
                      <td className="p-3 text-right text-emerald-400 font-extrabold">{v.pos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Segment: Monthly Trend Bar Chart Screen 11 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="font-display font-black text-white text-base uppercase tracking-wider text-xs font-mono text-slate-400">
                Monthly Spend Trend
              </h3>
              <p className="text-xs text-slate-500">Spend trajectories across the last fiscal quarters</p>
            </div>

            {/* Simulated pure CSS vertical columns */}
            <div className="flex items-end justify-between h-40 max-w-sm mx-auto pt-4 relative">
              
              {/* Horizontal rule guide lines */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-slate-800" />
              <div className="absolute inset-x-0 bottom-1/4 h-px bg-slate-800/40 border-dotted" />
              <div className="absolute inset-x-0 bottom-2/4 h-px bg-slate-800/40 border-dotted" />
              <div className="absolute inset-x-0 bottom-3/4 h-px bg-slate-800/40 border-dotted" />

              {monthlyTrends.map((t, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group z-10">
                  <div 
                    className={`w-10 rounded-t-lg transition-all duration-350 ${
                      t.active 
                        ? 'bg-blue-600 shadow-lg shadow-blue-500/25 ring-2 ring-blue-500/10' 
                        : 'bg-emerald-800/40 group-hover:bg-emerald-800/60'
                    } ${t.height}`} 
                  />
                  <span className={`text-[10px] font-mono font-bold ${t.active ? 'text-blue-400' : 'text-slate-500'}`}>
                    {t.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
