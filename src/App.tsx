import React, { useState, useEffect } from 'react';
import { UserRole, Vendor, RFQ, Quotation, ApprovalWorkflow, PurchaseOrder, Invoice, ActivityLog } from './types';
import { 
  INITIAL_VENDORS, 
  INITIAL_RFQS, 
  INITIAL_QUOTATIONS, 
  INITIAL_APPROVALS, 
  INITIAL_POS, 
  INITIAL_INVOICES, 
  INITIAL_ACTIVITIES 
} from './data/initialData';
import LoginScreen from './components/LoginScreen';
import DashboardView from './components/DashboardView';
import VendorsView from './components/VendorsView';
import RfqsView from './components/RfqsView';
import QuotationsView from './components/QuotationsView';
import ApprovalsView from './components/ApprovalsView';
import InvoicesView from './components/InvoicesView';
import ReportsView from './components/ReportsView';
import ActivityView from './components/ActivityView';
import { generateId } from './utils';

// Lucide Icons for high-fidelity sidebar & nav
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ShoppingBag, 
  Receipt, 
  BarChart3, 
  Clock, 
  ChevronRight, 
  LogOut, 
  Sparkles, 
  Search, 
  User, 
  Plus, 
  ShieldCheck, 
  Building2,
  Calendar
} from 'lucide-react';

export default function App() {
  // Session User State
  const [sessionUser, setSessionUser] = useState<{ name: string; email: string; role: UserRole } | null>({
    name: 'Rahul Mehta',
    email: 'rahul.mehta@vendorbridge.com',
    role: 'Procurement Officer'
  });

  // Global ERP Ledger States with immediate browser cache recovery
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const cached = localStorage.getItem('vendorbridge_vendors');
    return cached ? JSON.parse(cached) : INITIAL_VENDORS;
  });
  const [rfqs, setRfqs] = useState<RFQ[]>(() => {
    const cached = localStorage.getItem('vendorbridge_rfqs');
    return cached ? JSON.parse(cached) : INITIAL_RFQS;
  });
  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const cached = localStorage.getItem('vendorbridge_quotations');
    return cached ? JSON.parse(cached) : INITIAL_QUOTATIONS;
  });
  const [approvals, setApprovals] = useState<ApprovalWorkflow[]>(() => {
    const cached = localStorage.getItem('vendorbridge_approvals');
    return cached ? JSON.parse(cached) : INITIAL_APPROVALS;
  });
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const cached = localStorage.getItem('vendorbridge_purchase_orders');
    return cached ? JSON.parse(cached) : INITIAL_POS;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const cached = localStorage.getItem('vendorbridge_invoices');
    return cached ? JSON.parse(cached) : INITIAL_INVOICES;
  });
  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const cached = localStorage.getItem('vendorbridge_activities');
    return cached ? JSON.parse(cached) : INITIAL_ACTIVITIES;
  });

  // State synchronization with browser LocalStorage
  useEffect(() => {
    localStorage.setItem('vendorbridge_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_rfqs', JSON.stringify(rfqs));
  }, [rfqs]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_purchase_orders', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('vendorbridge_activities', JSON.stringify(activities));
  }, [activities]);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('Dashboard');
  
  // Sub-navigation triggers
  const [rfqSubTab, setRfqSubTab] = useState<'list' | 'create'>('list');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Find or compile the active vendor record if current user is Vendor
  const currentVendor = sessionUser?.role === 'Vendor'
    ? (vendors.find(v => v.name.toLowerCase().includes(sessionUser.name.toLowerCase()) || v.email === sessionUser?.email) || vendors[1] /* default SuperTech V2 */)
    : null;

  // Live filter selectors based on globalSearchQuery and role isolation security
  const baseVendors = sessionUser?.role === 'Vendor' && currentVendor
    ? vendors.filter(v => v.id === currentVendor.id)
    : vendors;

  const filteredVendors = baseVendors.filter(v => 
    v.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    v.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    (v.about && v.about.toLowerCase().includes(globalSearchQuery.toLowerCase()))
  );

  const baseRfqs = sessionUser?.role === 'Vendor' && currentVendor
    ? rfqs.filter(r => r.assignedVendors.includes(currentVendor.id) || r.assignedVendors.length === 0 || quotations.some(q => q.rfqId === r.id && q.vendorId === currentVendor.id))
    : rfqs;

  const filteredRfqs = baseRfqs.filter(r => 
    r.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    r.id.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const baseQuotations = sessionUser?.role === 'Vendor' && currentVendor
    ? quotations.filter(q => q.vendorId === currentVendor.id)
    : quotations;

  const filteredQuotations = baseQuotations.filter(q => 
    q.vendorName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    q.rfqTitle.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    (q.notes && q.notes.toLowerCase().includes(globalSearchQuery.toLowerCase()))
  );

  const filteredApprovals = approvals.filter(a => 
    a.rfqTitle.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    a.vendorName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const basePurchaseOrders = sessionUser?.role === 'Vendor' && currentVendor
    ? purchaseOrders.filter(po => po.vendorId === currentVendor.id)
    : purchaseOrders;

  const filteredPurchaseOrders = basePurchaseOrders.filter(po => 
    po.vendorName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    po.id.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    po.poNumber.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const baseInvoices = sessionUser?.role === 'Vendor' && currentVendor
    ? invoices.filter(inv => inv.vendorId === currentVendor.id)
    : invoices;

  const filteredInvoices = baseInvoices.filter(inv => 
    inv.vendorName.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  const filteredActivities = activities.filter(act => 
    act.message.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    act.type.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
    act.user.toLowerCase().includes(globalSearchQuery.toLowerCase())
  );

  // Load persistence if exists
  useEffect(() => {
    const cached = localStorage.getItem('vendorbridge_session');
    if (cached) {
      try {
        setSessionUser(JSON.parse(cached));
      } catch (e) {
        // Safe bypass
      }
    }
  }, []);

  // Helper inside state updates: add logs
  const logActivity = (type: ActivityLog['type'], message: string, user: string) => {
    const newLog: ActivityLog = {
      id: generateId('ACT'),
      type,
      message,
      user,
      timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + `, ${new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    };
    setActivities(prev => [newLog, ...prev]);
  };

  const handleLogin = (user: { name: string; email: string; role: UserRole }) => {
    setSessionUser(user);
    localStorage.setItem('vendorbridge_session', JSON.stringify(user));
    logActivity('Vendor', `User signed in securely as ${user.role}`, user.name);
    setActiveTab('Dashboard');
  };

  const handleLogout = () => {
    if (sessionUser) {
      logActivity('Vendor', `User logged off session securely`, sessionUser.name);
    }
    setSessionUser(null);
    localStorage.removeItem('vendorbridge_session');
  };

  // Add Vendor Action with smart compliance and risk assessment scoring
  const handleAddVendor = (newVendor: Omit<Vendor, 'id' | 'rating'>) => {
    const id = `V${vendors.length + 1}`;
    
    // Auto calculate trust score with AI Risk Engine heuristic
    let baseScore = 90;
    const isFreeEmail = /@(gmail|yahoo|outlook|hotmail|live|mailinator)\./i.test(newVendor.email);
    const countryNotIndia = newVendor.country.toLowerCase() !== 'india';
    
    if (isFreeEmail) baseScore -= 30; // Deduct for unauthenticated public inbox
    if (countryNotIndia) baseScore -= 10; // Extra inspection required for international
    
    // Prevent index string manipulation if name contains suspicious words
    const containsSuspiciousKeywords = /fake|dummy|test|shell|apex|phantom|trustee/i.test(newVendor.name);
    if (containsSuspiciousKeywords) baseScore -= 20;

    const trustScore = Math.max(10, Math.min(100, baseScore));
    let riskCategory: Vendor['riskCategory'] = 'Low Risk';
    if (trustScore < 45) {
      riskCategory = 'Suspicious (Fake)';
    } else if (trustScore < 70) {
      riskCategory = 'High Risk';
    } else if (trustScore < 85) {
      riskCategory = 'Medium Risk';
    }

    const isFakeVendor = trustScore < 45;
    const compiled: Vendor = {
      id,
      ...newVendor,
      rating: isFakeVendor ? 1.5 : 4.0,
      trustScore,
      riskCategory,
      isFakeVendor,
      onTimeDeliveryRate: isFakeVendor ? 18 : 94,
      complianceCleared: !isFakeVendor
    };

    setVendors(prev => [...prev, compiled]);
    logActivity('Vendor', `Compliance appraisal complete. Created ${newVendor.name} with Trust Score: ${trustScore}%, Risk Index: ${riskCategory}.`, sessionUser?.name || 'Compliance Audit Engine');
  };

  // Update Vendor Status Action
  const handleUpdateVendorStatus = (id: string, status: Vendor['status']) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
    const vName = vendors.find(v => v.id === id)?.name || 'Supplier';
    logActivity('Vendor', `Compliance Status of ${vName} updated to [${status}]`, sessionUser?.name || 'Compliance Officer');
  };

  // Create RFQ Action
  const handleCreateRfq = (newRfq: Omit<RFQ, 'id' | 'dateCreated'>) => {
    const id = `RFQ-2025-000${rfqs.length + 1}`;
    const compiled: RFQ = {
      id,
      dateCreated: new Date().toISOString().split('T')[0],
      ...newRfq
    };
    setRfqs(prev => [compiled, ...prev]);
    logActivity('RFQ', `RFQ published - ${newRfq.title} sent to ${newRfq.assignedVendors.length} vendors`, sessionUser?.name || 'Procurement officer');
  };

  // Submit Quotation
  const handleSubmitQuotation = (newQuotation: Omit<Quotation, 'id'>) => {
    const id = `Q-00${quotations.length + 1}`;
    const compiled: Quotation = {
      id,
      ...newQuotation
    };
    setQuotations(prev => [compiled, ...prev]);
    logActivity('Quotation', `Quotation submitted by ${newQuotation.vendorName} for RFQ ${newQuotation.rfqId} - Amount: ₹${newQuotation.grandTotal.toLocaleString('en-IN')}`, newQuotation.vendorName);
  };

  // Select Quotation Side-by-side & Approve trigger (Switches to Approval screen L2)
  const handleSelectQuotationForApproval = (quote: Quotation) => {
    // 1. Transition RFQ status
    setRfqs(prev => prev.map(r => r.id === quote.rfqId ? { ...r, status: 'Under Review' } : r));
    
    // 2. Instantiate dynamic workflow item
    const flowId = generateId('APP');
    const newFlow: ApprovalWorkflow = {
      id: flowId,
      rfqId: quote.rfqId,
      rfqTitle: quote.rfqTitle,
      quotationId: quote.id,
      vendorId: quote.vendorId,
      vendorName: quote.vendorName,
      grandTotal: quote.grandTotal,
      deliveryDays: quote.deliveryDays,
      rating: quote.rating || 4.2,
      status: 'Pending',
      currentStepIndex: 2, // L2 Approval Screen 8 matching Priya Shah awaiting
      steps: [
        { name: 'Submitted', label: 'Submitted', status: 'completed', user: sessionUser?.name || 'Rahul Mehta', date: 'May 20, 09:15 AM', remark: 'Lowest bid selected through automated matrix evaluation' },
        { name: 'L1 Review', label: 'L1 Review', status: 'completed', user: 'Rahul Mehta (Head)', date: 'May 20, 10:32 AM', remark: 'Pricing aligns with third-quarter budgeted figures.' },
        { name: 'L2 Approval', label: 'L2 Approval', status: 'current', user: 'Priya Shah (Finance)', remark: 'Awaiting' },
        { name: 'Generate PO', label: 'Generate PO', status: 'pending' }
      ],
      history: [
        { user: sessionUser?.name || 'Rahul Mehta', role: 'Procurement head', action: 'Approved L1', remark: 'Quotation selected through dynamic assessment criteria.', date: 'May 20' }
      ]
    };

    setApprovals(prev => [newFlow, ...prev]);
    
    logActivity('Quotation', `Quotation selected - ${quote.vendorName} selected for ${quote.rfqTitle}`, sessionUser?.name || 'Rahul Mehta');
    
    // 3. Jump to Approvals Screen
    setActiveTab('Approvals');
  };

  // Process Approval Workflow Actions L2 -> Generate PO
  const handleProcessApproval = (workflowId: string, action: 'Approve' | 'Reject', remark: string) => {
    const activeFlow = approvals.find(w => w.id === workflowId);
    if (!activeFlow) return;

    if (action === 'Reject') {
      setApprovals(prev => prev.map(w => w.id === workflowId ? {
        ...w,
        status: 'Rejected',
        steps: w.steps.map(s => s.name === 'L2 Approval' ? { ...s, status: 'rejected', remark } : s)
      } : w));
      logActivity('Approval', `Workflow Rejected - ${activeFlow.rfqTitle} rejected by Priya Shah`, 'Priya Shah');
      return;
    }

    // Approve: transition L2 approval to complete, build PO & Invoice
    setApprovals(prev => prev.map(w => w.id === workflowId ? {
      ...w,
      status: 'Approved',
      currentStepIndex: 3,
      steps: w.steps.map(s => 
        s.name === 'L2 Approval' ? { ...s, status: 'completed', remark, user: 'Priya Shah (Finance Manager)', date: 'May 22, 11:15 AM' } :
        s.name === 'Generate PO' ? { ...s, status: 'completed', user: 'System robot' } : s
      )
    } : w));

    // Lock RFQ status
    setRfqs(prev => prev.map(r => r.id === activeFlow.rfqId ? { ...r, status: 'PO Generated' } : r));

    // Generate PO
    const newPoId = `PO-2025-00${purchaseOrders.length + 68}`;
    const generatedPO: PurchaseOrder = {
      id: newPoId,
      rfqId: activeFlow.rfqId,
      quotationId: activeFlow.quotationId,
      vendorId: activeFlow.vendorId,
      vendorName: activeFlow.vendorName,
      vendorGst: '27GSTIN343434DB4523',
      vendorAddress: '456, Industrial Estate, Surat, Gujarat',
      organisationName: 'VendorBridge Enterprise Solutions',
      organisationAddress: '123 Business Park, Ahmedabad, Gujarat',
      organisationGst: '25383434A8FB1Z9',
      dateCreated: new Date().toISOString().split('T')[0],
      poNumber: newPoId,
      status: 'Confirmed',
      lineItems: [
        { id: 'L1', item: 'Ergonomic chair', qty: 25, unit: 'NOS', unitPrice: 3500 },
        { id: 'L2', item: 'Standing desks', qty: 10, unit: 'NOS', unitPrice: 8200 }
      ],
      subtotal: 169500,
      cgst: 15255,
      sgst: 15255,
      grandTotal: 200010
    };

    setPurchaseOrders(prev => [generatedPO, ...prev]);

    // Generate Invoice
    const generatedInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      poId: newPoId,
      rfqId: activeFlow.rfqId,
      vendorId: activeFlow.vendorId,
      vendorName: activeFlow.vendorName,
      vendorGst: '27GSTIN343434DB4523',
      vendorAddress: '456, Industrial Estate, Surat, Gujarat',
      organisationName: 'VendorBridge Enterprise Solutions',
      organisationAddress: '123 Business Park, Ahmedabad, Gujarat',
      organisationGst: '25383434A8FB1Z9',
      invoiceNumber: `INV-2025-${Date.now().toString().slice(-5)}`,
      poNumber: newPoId,
      dateCreated: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 65 * 1000).toISOString().split('T')[0],
      subtotal: 169500,
      cgst: 15255,
      sgst: 15255,
      grandTotal: 200010,
      status: 'Pending Payment'
    };

    setInvoices(prev => [generatedInvoice, ...prev]);

    logActivity('Invoice', `PO-${newPoId} and Invoice generated automatically after workflow authorization sign-off.`, 'Priya Shah');
    
    // Jump to Invoices to view PO/Invoice Screen 9!
    setActiveTab('Invoices');
  };

  // Pay invoice
  const handleMarkInvoicePaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
    const invNo = invoices.find(i => i.id === id)?.invoiceNumber || 'Invoice_Doc';
    logActivity('Invoice', `Invoice ${invNo} marked as PAID. Treasury database balance dispatched.`, sessionUser?.name || 'Treasurer');
  };

  // Withdraw / take back quotation
  const handleWithdrawQuotation = (quotationId: string) => {
    const q = quotations.find(item => item.id === quotationId);
    if (!q) return;

    setQuotations(prev => prev.filter(item => item.id !== quotationId));
    logActivity('Quotation', `Quotation withdrawn / taken back securely: ${q.id} for RFQ ${q.rfqTitle}`, sessionUser?.name || 'Authorized rep');
  };

  // Revert / take back approval decision
  const handleRevertApproval = (workflowId: string) => {
    const activeFlow = approvals.find(w => w.id === workflowId);
    if (!activeFlow) return;

    // 1. Revert approvals state to Pending
    setApprovals(prev => prev.map(w => w.id === workflowId ? {
      ...w,
      status: 'Pending',
      currentStepIndex: 2,
      steps: w.steps.map(s => 
        s.name === 'L2 Approval' ? { ...s, status: 'current', remark: 'Awaiting', user: 'Priya Shah (Finance)' } :
        s.name === 'Generate PO' ? { ...s, status: 'pending', user: undefined } : s
      )
    } : w));

    // 2. Restore RFQ status back to Under Review
    setRfqs(prev => prev.map(r => r.id === activeFlow.rfqId ? { ...r, status: 'Under Review' } : r));

    // 3. Remove PO and Invoice matching the reverted rfqId
    setPurchaseOrders(prev => prev.filter(po => po.rfqId !== activeFlow.rfqId));
    setInvoices(prev => prev.filter(inv => inv.rfqId !== activeFlow.rfqId));

    logActivity('Approval', `Workflow decision reverted & taken back for ${activeFlow.rfqTitle}. PO and invoices revoked.`, 'Priya Shah');
    alert("Workflow decision revoked! The ledger state, generated Purchase Orders, and Invoices have been rolled back.");
  };

  if (!sessionUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }  // Sidebar navigation options exactly pairing diagram labels and restricted roles
  const fullNavigationTabs = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Vendors', icon: <Users className="w-4 h-4" />, allowedRoles: ['Procurement Officer', 'Manager', 'Admin'] },
    { name: "RFQ's", icon: <FileText className="w-4 h-4" /> },
    { name: 'Quotations', icon: <Layers className="w-4 h-4" /> },
    { name: 'Approvals', icon: <CheckCircle2 className="w-4 h-4" />, allowedRoles: ['Procurement Officer', 'Manager', 'Admin'] },
    { name: 'Purchase orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Invoices', icon: <Receipt className="w-4 h-4" /> },
    { name: 'Reports', icon: <BarChart3 className="w-4 h-4" />, allowedRoles: ['Procurement Officer', 'Manager', 'Admin'] },
    { name: 'Activity', icon: <Clock className="w-4 h-4" />, allowedRoles: ['Procurement Officer', 'Manager', 'Admin'] }
  ];

  const navigationTabs = fullNavigationTabs.filter(tab => !tab.allowedRoles || tab.allowedRoles.includes(sessionUser.role));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-all">
      
      {/* Top Navbar Header matching the diagram design */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        
        {/* Branding Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-600/25 border border-emerald-500/20 rounded-xl">
            <Building2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5 leading-none">
              Vendor<span className="text-emerald-500">Bridge</span>
              <span className="text-[10px] tracking-wide uppercase font-bold text-emerald-400 font-mono bg-emerald-950/40 p-1 px-2 border border-emerald-500/20 rounded-md">
                ERP Core
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mt-0.5">Enterprise Ledger Authority</p>
          </div>
        </div>

        {/* Global Search simulated */}
        <div className="hidden md:flex items-center gap-2.5 max-w-md w-full bg-slate-950 border border-slate-850 px-3.5 py-2.5 rounded-xl text-xs">
          <Search className="w-4 h-4 text-emerald-500" />
          <input 
            type="text" 
            placeholder="Search suppliers, resources, RFQs, invoices..." 
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="bg-transparent w-full focus:outline-none text-slate-205"
          />
        </div>

        {/* Account user info with simulated role switcher */}
        <div className="flex items-center gap-3.5 pl-4 border-l border-slate-800">
          
          {/* User Detail block with Switcher dropdown */}
          <div className="text-right hidden sm:block">
            <h4 className="text-xs font-bold font-display text-white">{sessionUser.name}</h4>
            <div className="flex items-center gap-1.5 justify-end mt-0.5">
              <select
                value={sessionUser.role}
                onChange={(e) => {
                  const targetRole = e.target.value as UserRole;
                  const newName = targetRole === 'Vendor' ? 'SuperTech Vendor' : 'Rahul Mehta';
                  const newEmail = targetRole === 'Vendor' ? 'sales@supertechlaptops.com' : 'rahul.mehta@vendorbridge.com';
                  const updatedUser = { name: newName, email: newEmail, role: targetRole };
                  setSessionUser(updatedUser);
                  localStorage.setItem('vendorbridge_session', JSON.stringify(updatedUser));
                  logActivity('Vendor', `Switched session view node to ${targetRole}`, newName);
                  setActiveTab('Dashboard');
                }}
                className={`bg-slate-955 text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded cursor-pointer border focus:outline-none ${
                  sessionUser.role === 'Procurement Officer'
                    ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20'
                    : 'border-blue-500/30 text-blue-400 bg-blue-950/20'
                }`}
              >
                <option value="Procurement Officer">Officer Portal</option>
                <option value="Vendor">Vendor Portal</option>
              </select>
            </div>
          </div>

          <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center font-bold text-xs text-slate-300 font-mono">
            {sessionUser.name.slice(0, 2).toUpperCase()}
          </div>

          {/* Secure Disconnect Button */}
          <button
            onClick={handleLogout}
            title="Log off session node"
            className="p-2 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-700"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>

        </div>
      </header>

      {/* Main Core split: Sidebar Navigation and Active Tab View */}
      <div className="flex flex-1 relative items-stretch">
        
        {/* Sidebar Container */}
        <aside className="w-68 bg-slate-900 border-r border-slate-800 shrink-0 hidden md:flex flex-col justify-between py-6 px-4 space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block px-3">
              Workspace Ledger
            </span>

            <nav className="space-y-1">
              {navigationTabs.map((tab) => {
                const isActive = activeTab === tab.name || (tab.name === "RFQ's" && activeTab === "RFQ's");
                return (
                  <button
                    key={tab.name}
                    onClick={() => {
                      setActiveTab(tab.name);
                      if (tab.name === "RFQ's") setRfqSubTab('list');
                    }}
                    className={`w-full text-left p-3 rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-3 cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 font-extrabold shadow-lg shadow-emerald-500/5' 
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                      {tab.icon}
                    </span>
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Sidebar system state */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-1 text-[11px] font-mono text-slate-500">
            <div className="flex items-center justify-between text-[10px]">
              <span>LEDGER BOUNDS:</span>
              <span className="text-emerald-400 font-bold">MUTABLE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SLA GUARANTEE:</span>
              <span className="text-slate-300">99.98%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>LEDGER DEPLOY:</span>
              <span className="text-slate-300">ONLINE</span>
            </div>
          </div>
        </aside>

        {/* Dynamic Content Frame workspace inside SaaS border templates */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90 relative">
          
          {/* Subtle decoration accent blue/emerald top boundary lines */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-emerald-500/30 via-slate-800 to-blue-500/30" />

          {/* Renders corresponding panel dynamically by Selected Sidebar action */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'Dashboard' && (
              <DashboardView 
                rfqs={filteredRfqs} 
                approvals={filteredApprovals}
                purchaseOrders={filteredPurchaseOrders} 
                invoices={filteredInvoices}
                onNavigate={setActiveTab}
                onOpenCreateRfq={() => { setActiveTab("RFQ's"); setRfqSubTab('create'); }}
                onOpenAddVendor={() => { setActiveTab('Vendors'); }}
                userRole={sessionUser.role}
                userName={sessionUser.name}
              />
            )}
            
            {activeTab === 'Vendors' && (
              <VendorsView 
                vendors={filteredVendors}
                onAddVendor={handleAddVendor}
                onUpdateVendorStatus={handleUpdateVendorStatus}
              />
            )}

            {activeTab === "RFQ's" && (
              <RfqsView 
                rfqs={filteredRfqs}
                vendors={filteredVendors}
                onCreateRfq={handleCreateRfq}
                activeSubTab={rfqSubTab}
              />
            )}

            {activeTab === 'Quotations' && (
              <QuotationsView 
                rfqs={filteredRfqs}
                quotations={filteredQuotations}
                activeVendor={currentVendor || filteredVendors[0] || vendors[1]}
                onSubmitQuotation={handleSubmitQuotation}
                onSelectQuotationForApproval={handleSelectQuotationForApproval}
                onWithdrawQuotation={handleWithdrawQuotation}
              />
            )}

            {activeTab === 'Approvals' && (
              <ApprovalsView 
                workflows={filteredApprovals}
                onProcessApproval={handleProcessApproval}
                onRevertApproval={handleRevertApproval}
              />
            )}

            {activeTab === 'Purchase orders' && (
              <InvoicesView 
                defaultViewMode="po"
                invoices={filteredInvoices}
                purchaseOrders={filteredPurchaseOrders}
                onMarkAsPaid={handleMarkInvoicePaid}
                onLogActivity={logActivity}
                sessionUser={sessionUser}
              />
            )}

            {activeTab === 'Invoices' && (
              <InvoicesView 
                defaultViewMode="invoice"
                invoices={filteredInvoices}
                purchaseOrders={filteredPurchaseOrders}
                onMarkAsPaid={handleMarkInvoicePaid}
                onLogActivity={logActivity}
                sessionUser={sessionUser}
              />
            )}

            {activeTab === 'Reports' && (
              <ReportsView />
            )}

            {activeTab === 'Activity' && (
              <ActivityView 
                activities={filteredActivities}
                onClearLogs={() => setActivities([])}
              />
            )}
          </div>
        </main>

      </div>

    </div>
  );
}
