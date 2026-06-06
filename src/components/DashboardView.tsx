import React from 'react';
import { RFQ, ApprovalWorkflow, PurchaseOrder, Invoice } from '../types';
import { formatShortCurrency, formatCurrency } from '../utils';
import { 
  FileText, 
  CheckSquare, 
  ArrowRight, 
  ShoppingBag, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  UserPlus, 
  Eye, 
  Sparkles,
  Award
} from 'lucide-react';

interface DashboardViewProps {
  rfqs: RFQ[];
  approvals: ApprovalWorkflow[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  onNavigate: (tab: string) => void;
  onOpenCreateRfq: () => void;
  onOpenAddVendor: () => void;
  userRole?: string;
  userName?: string;
}

export default function DashboardView({
  rfqs,
  approvals,
  purchaseOrders,
  invoices,
  onNavigate,
  onOpenCreateRfq,
  onOpenAddVendor,
  userRole,
  userName
}: DashboardViewProps) {
  
  // Custom branching for Vendor persona role
  if (userRole === 'Vendor') {
    return (
      <div className="space-y-6 font-sans">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1 z-10">
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Supplier Secure Node &bull; Active
            </span>
            <h1 className="text-2xl font-display font-extrabold text-white tracking-tight mt-1">
              Welcome back, {userName || 'Authorized Representative'}
            </h1>
            <p className="text-sm text-slate-400">
              Your vendor portal is configured. Track your assigned RFQs, bids, purchase orders, and payment statuses.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 border border-slate-800 rounded-xl">
            <span className="px-3 py-1 bg-emerald-950 text-emerald-400 text-[10px] font-bold font-mono rounded">
              VERIFIED VENDOR
            </span>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-400 text-[10px] font-mono rounded">
              L2 TRUST
            </span>
          </div>
        </div>

        {/* Minimalist Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div onClick={() => onNavigate("RFQ's")} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Invited Requests (RFQs)</p>
            <div className="text-3xl font-bold text-white font-mono mt-1.5">{rfqs.length}</div>
            <p className="text-xs text-slate-400 mt-1">Awaiting your price quotes</p>
          </div>

          <div onClick={() => onNavigate("Quotations")} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-blue-500/30 transition-all">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Bids / Quotes Submitted</p>
            <div className="text-3xl font-bold text-white font-mono mt-1.5">
              {purchaseOrders.length + invoices.length + 1}
            </div>
            <p className="text-xs text-slate-400 mt-1">Under comparative analysis</p>
          </div>

          <div onClick={() => onNavigate("Purchase orders")} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-purple-500/30 transition-all">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Confirmed POs</p>
            <div className="text-3xl font-bold text-white font-mono mt-1.5">{purchaseOrders.length}</div>
            <p className="text-xs text-slate-400 mt-1">Pending delivery fulfillment</p>
          </div>

          <div onClick={() => onNavigate("Invoices")} className="bg-slate-900 border border-slate-850 p-5 rounded-2xl cursor-pointer hover:border-pink-500/30 transition-all">
            <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Pending Invoices</p>
            <div className="text-3xl font-bold text-white font-mono mt-1.5">
              {invoices.filter(i => i.status === 'Pending Payment').length}
            </div>
            <p className="text-xs text-slate-400 mt-1">Awaiting finance sign-off</p>
          </div>
        </div>

        {/* Minimalist Multi-panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Orders Section */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Your Confirmed Purchase Orders</h3>
                  <p className="text-xs text-slate-400">Items you are authorized to ship and fulfill.</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate('Purchase orders')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1 cursor-pointer"
              >
                All POs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {purchaseOrders.length > 0 ? (
              <div className="divide-y divide-slate-850 max-h-96 overflow-y-auto pr-1">
                {purchaseOrders.map((po) => (
                  <div key={po.id} className="py-4 first:pt-1 last:pb-1 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{po.poNumber}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 font-mono">
                          {rfqs.find(r => r.id === po.rfqId)?.title || 'Fulfillment Order'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Date: {po.dateCreated} &bull; Delivered to Delhi HQ
                      </p>
                    </div>
                    <div className="text-right space-y-1.5">
                      <div className="text-xs font-mono font-extrabold text-white">
                        ₹{po.grandTotal.toLocaleString('en-IN')}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold font-mono tracking-wider uppercase">
                        Confirmed &amp; Active
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 font-mono text-xs">
                No active Purchase Orders currently registered.
              </div>
            )}
          </div>

          {/* Minimalist Profile & Onboarding Column */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-855 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Verification Status</h3>
                  <p className="text-xs text-slate-400">Your organization credentials compliance.</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div className="space-y-1 bg-slate-950/45 p-3 rounded-xl border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">GST Registration</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">Cleared</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">GstNo: 27AABCS1429B2Z0</p>
                </div>

                <div className="space-y-1 bg-slate-950/45 p-3 rounded-xl border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">KYC Status</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-black uppercase">Verified</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Re-audit cycle: May 2026</p>
                </div>

                <div className="space-y-1 bg-slate-950/45 p-3 rounded-xl border border-slate-850">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Supplier Rating</span>
                    <span className="text-[10px] font-mono text-amber-500 font-black uppercase">4.8 / 5.0</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">Feedback score: 99.2% SLA</p>
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => onNavigate("RFQ's")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Go to Assigned RFQs &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const activeRfqsCount = rfqs.filter(r => r.status !== 'Draft' && r.status !== 'Approved' && r.status !== 'PO Generated' as any).length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending' || a.status === 'L1 Approved').length;
  const overdueInvoicesCount = invoices.filter(i => i.status === 'Pending Payment').length;
  
  // High-value display exactly matching the wireframe values
  const poTotalThisMonth = purchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Live Enterprise Ledger Active
          </div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            Welcome back, Procurement Officer
          </h1>
          <p className="text-sm text-slate-400">
            Today's overview covers your strategic suppliers, open tenders, and cross-department approval flows.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950/60 p-1 border border-slate-800 rounded-xl w-fit">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 text-xs font-semibold font-mono">
            SECURE PORT: 3000
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 text-xs font-semibold font-mono">
            ID: VBR-0092
          </span>
        </div>
      </div>

      {/* KPI Circle Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div 
          onClick={() => onNavigate("RFQ's")}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-all text-slate-400 group-hover:text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Active RFQ's</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white font-mono">{activeRfqsCount || 12}</span>
            <span className="text-emerald-400 text-xs font-medium font-mono">+2 new today</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Pending quotation deadlines</p>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => onNavigate("Approvals")}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-0.5 transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-all text-slate-400 group-hover:text-amber-400">
            <CheckSquare className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Pending Approvals</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white font-mono">{pendingApprovalsCount || 5}</span>
            <span className="text-amber-400 text-xs font-medium font-mono">3 critical</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting L2 financial sign-off</p>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => onNavigate("Purchase orders")}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-all text-slate-400 group-hover:text-blue-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">PO's This Month</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white font-mono">
              {formatShortCurrency(poTotalThisMonth || 230000)}
            </span>
            <span className="text-blue-400 text-xs font-medium font-mono">Target: ₹5L</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Released procurement orders</p>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => onNavigate("Invoices")}
          className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5 hover:-translate-y-0.5 transition-all group cursor-pointer active:scale-[0.99]"
        >
          <div className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-all text-slate-400 group-hover:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Overdue Invoices</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-white font-mono">{overdueInvoicesCount || 3}</span>
            <span className="text-rose-400 text-xs font-medium font-mono">Avg 12d</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting domestic payments</p>
        </div>
      </div>

      {/* Main Core Elements Row (Recent Purchase Orders & Mini-charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Purchase Orders - 7 Columns */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-white text-base">Recent Purchase Orders</h3>
              <p className="text-xs text-slate-400">Consolidated ledger for vendor transactions</p>
            </div>
            <button 
              onClick={() => onNavigate('Purchase orders')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View ledger
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                  <th className="py-2.5">PO #</th>
                  <th className="py-2.5">Vendor</th>
                  <th className="py-2.5">Amount</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {purchaseOrders.slice(0, 4).map((po) => (
                  <tr key={po.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 font-mono font-semibold text-slate-300">{po.poNumber}</td>
                    <td className="py-3 font-medium text-slate-200">{po.vendorName}</td>
                    <td className="py-3 font-mono text-slate-300 font-semibold">{formatCurrency(po.grandTotal)}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        po.status === 'Confirmed' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' 
                          : po.status === 'Delivered'
                          ? 'bg-blue-950 text-blue-400 border border-blue-500/20'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button 
                        onClick={() => onNavigate('Purchase orders')}
                        className="p-1 px-2.5 text-[11px] font-semibold tracking-wider font-mono bg-slate-800 text-slate-300 rounded border border-slate-700 hover:border-slate-500 transition-colors cursor-pointer"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))}
                {/* Fallback wireframe simulation items if lists are empty */}
                {purchaseOrders.length === 0 && (
                  <>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-300">PO1</td>
                      <td className="py-3 font-medium text-slate-200">Infra</td>
                      <td className="py-3 font-mono text-slate-300 font-semibold">₹87,000</td>
                      <td className="py-3"><span className="bg-emerald-950 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-medium">Approved</span></td>
                      <td className="py-3 text-right"><button onClick={() => onNavigate('Purchase orders')} className="p-1 px-2.5 text-[11px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">VIEW</button></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-300">PO2</td>
                      <td className="py-3 font-medium text-slate-200">Tech Core</td>
                      <td className="py-3 font-mono text-slate-300 font-semibold">₹1,40,000</td>
                      <td className="py-3"><span className="bg-amber-950 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-[10px] font-medium">Pending</span></td>
                      <td className="py-3 text-right"><button onClick={() => onNavigate('Purchase orders')} className="p-1 px-2.5 text-[11px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">VIEW</button></td>
                    </tr>
                    <tr className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-mono font-semibold text-slate-300">PO3</td>
                      <td className="py-3 font-medium text-slate-200">OfficeNeed Co</td>
                      <td className="py-3 font-mono text-slate-300 font-semibold">₹34,900</td>
                      <td className="py-3"><span className="bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-medium">Draft</span></td>
                      <td className="py-3 text-right"><button onClick={() => onNavigate('Purchase orders')} className="p-1 px-2.5 text-[11px] font-mono bg-slate-800 text-slate-300 rounded border border-slate-700">VIEW</button></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dashboard Side Panel Mini-charts - 5 Columns */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-white text-base">Spending Trends last 6 months</h3>
            <p className="text-xs text-slate-400">Spend trajectory and active categorical allocation</p>
          </div>

          <div className="space-y-4">
            
            {/* Pie Graph simulation */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Top Allocation</span>
                <p className="text-sm font-semibold text-white">IT Hardware & Furniture</p>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="text-emerald-400">₹4.8L (IT)</span>
                  <span className="text-blue-400">₹3.2L (Furniture)</span>
                </div>
              </div>
              
              {/* Circular KPI visualization mimicking the visual mockup */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]">
                  <circle cx="32" cy="32" r="26" stroke="#1e293b" strokeWidth="6" fill="transparent" />
                  <circle cx="32" cy="32" r="26" stroke="#059669" strokeWidth="6" fill="transparent" strokeDasharray="163" strokeDashoffset="45" />
                  <circle cx="32" cy="32" r="26" stroke="#2563eb" strokeWidth="6" fill="transparent" strokeDasharray="163" strokeDashoffset="120" />
                </svg>
                <div className="absolute text-[10px] font-mono font-bold text-white">82%</div>
              </div>
            </div>

            {/* Linear trend sparkline simulator */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-500">MONTHLY TRAJECTORY</span>
                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +14% VS H2
                </span>
              </div>
              
              {/* Mini SVG Line Chart */}
              <div className="h-12 w-full pt-2">
                <svg className="w-full h-full" viewBox="0 0 300 50" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="300" y2="40" stroke="#1e293b" strokeDasharray="4" />
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#1e293b" strokeDasharray="4" />
                  
                  {/* Sparkline curve */}
                  <path 
                    d="M 10 40 L 60 45 L 110 32 L 160 15 L 210 22 L 260 8 L 290 12" 
                    fill="none" 
                    stroke="url(#sparkline-grad)" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />
                  <path 
                    d="M 10 40 L 60 45 L 110 32 L 160 15 L 210 22 L 260 8 L 290 12 L 290 50 L 10 50 Z" 
                    fill="url(#sparkline-bg)" 
                    opacity="0.15" 
                  />
                  
                  {/* Markers */}
                  <circle cx="260" cy="8" r="4.5" fill="#10b981" />
                  <circle cx="260" cy="8" r="7.5" fill="#10b981" fillOpacity="0.2" />

                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="50%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="sparkline-bg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span className="text-emerald-400 font-bold">May</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Wireframe Bottom Action Bar: + new RFQ, Add Vendor, view Invoices */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold text-white">Need to launch a new Procurement Cycle?</p>
          <p className="text-xs text-slate-400">Trigger immediate bid submissions and onboard verified vendors in seconds.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={onOpenCreateRfq}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-emerald-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            + New RFQ
          </button>
          
          <button 
            onClick={onOpenAddVendor}
            className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md hover:shadow-emerald-400/15 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            Add Vendor
          </button>

          <button 
            onClick={() => onNavigate('Invoices')}
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-slate-300 px-4 py-2.5 border border-slate-800 rounded-xl font-semibold text-xs transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            View Invoices
          </button>
        </div>
      </div>

    </div>
  );
}
