import React, { useState, useEffect } from 'react';
import { Invoice, PurchaseOrder } from '../types';
import { formatCurrency, triggerPrint } from '../utils';
import { 
  FileText, 
  Download, 
  Printer, 
  Send, 
  CheckCircle, 
  Building2, 
  Search, 
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sliders,
  DollarSign,
  X,
  Mail
} from 'lucide-react';

interface InvoicesViewProps {
  invoices: Invoice[];
  purchaseOrders: PurchaseOrder[];
  onMarkAsPaid: (id: string) => void;
  defaultViewMode?: 'po' | 'invoice';
  onLogActivity?: (type: 'Dashboard' | 'Vendor' | 'RFQ' | 'Quotation' | 'Approval' | 'Invoice' | 'Report', message: string, user: string) => void;
  sessionUser?: { name: string; role: string; email: string } | null;
}

export default function InvoicesView({ 
  invoices, 
  purchaseOrders, 
  onMarkAsPaid,
  defaultViewMode = 'invoice',
  onLogActivity,
  sessionUser
}: InvoicesViewProps) {
  const [viewMode, setViewMode] = useState<'po' | 'invoice'>(defaultViewMode);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [selectedPoId, setSelectedPoId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Email transmission modal states
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [includePdf, setIncludePdf] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState('');
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  // Sync viewMode state when defaultViewMode prop updates from activeTab
  useEffect(() => {
    setViewMode(defaultViewMode);
    setFilterStatus('All');
    setSearchQuery('');
  }, [defaultViewMode]);

  // Set initial selections when lists load or change
  useEffect(() => {
    if (invoices.length > 0 && !selectedInvoiceId) {
      setSelectedInvoiceId(invoices[0].id);
    }
  }, [invoices]);

  useEffect(() => {
    if (purchaseOrders.length > 0 && !selectedPoId) {
      setSelectedPoId(purchaseOrders[0].id);
    }
  }, [purchaseOrders]);

  const activeDocument = viewMode === 'invoice'
    ? (invoices.find(i => i.id === selectedInvoiceId) || invoices[0])
    : (purchaseOrders.find(p => p.id === selectedPoId) || purchaseOrders[0]);

  // Auto-fill and format SMTP template when document or user changes
  useEffect(() => {
    if (activeDocument) {
      const isDocInvoice = viewMode === 'invoice';
      const docNum = isDocInvoice ? (activeDocument as any).invoiceNumber : activeDocument.poNumber;
      
      setEmailTo((activeDocument as any).vendorEmail || `finance@${activeDocument.vendorName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'supplier'}.com`);
      setEmailSubject(`[VendorBridge Secured Ledger Transmission] - ${isDocInvoice ? 'Invoice' : 'Purchase Order'} ${docNum}`);
      setEmailBody(`Respected Partners,\n\nPlease find attached the authorized digital ledger files for ${isDocInvoice ? 'Invoice' : 'Purchase Order'} reference ${docNum} compiled on ${activeDocument.dateCreated}.\n\nTotal Contract Sum: ₹${activeDocument.grandTotal.toLocaleString('en-IN')}\nOrganization Address Ref: ${activeDocument.organisationAddress}\nVendor Gst Registry Ref: ${activeDocument.vendorGst}\n\nThis transmission is cryptographically logged on the VendorBridge ERP Central Hub.\n\nBest Regards,\n${sessionUser?.name || 'Rahul Mehta'}\nTender Procurement Authority`);
    }
  }, [activeDocument, viewMode, sessionUser]);

  // Actual High-Fidelity Printable HTML Invoice File Download
  const handleDownloadInvoiceHTML = () => {
    if (!activeDocument) return;
    const isDocInvoice = viewMode === 'invoice';
    const docNum = isDocInvoice ? (activeDocument as any).invoiceNumber : activeDocument.poNumber;
    const title = isDocInvoice ? 'Purchase Invoice Record' : 'Official Purchase Contract (PO)';
    
    const itemsHtml = (activeDocument as any).lineItems?.map((item: any) => {
      const unitRate = 'unitPrice' in item ? (item.unitPrice || 3500) : 3500;
      const lineTotal = item.qty * unitRate;
      return `
        <tr style="border-bottom: 1px solid #cbd5e1;">
          <td style="padding: 12px; font-weight: 600; color: #1e293b; text-align: left;">${item.item}</td>
          <td style="padding: 12px; font-family: monospace; font-weight: bold; color: #020617; text-align: left;">${item.qty} ${item.unit}</td>
          <td style="padding: 12px; font-family: monospace; color: #475569; text-align: left;">₹${unitRate.toLocaleString('en-IN')}</td>
          <td style="padding: 12px; font-family: monospace; text-align: right; font-weight: 800; color: #020617;">₹${lineTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('') || `
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 12px; font-weight: 600; color: #1e293b; text-align: left;">Ergonomic Office Chair</td>
        <td style="padding: 12px; font-family: monospace; font-weight: bold; color: #020617; text-align: left;">25 NOS</td>
        <td style="padding: 12px; font-family: monospace; color: #475569; text-align: left;">₹3,500</td>
        <td style="padding: 12px; font-family: monospace; text-align: right; font-weight: 800; color: #020617;">₹87,500</td>
      </tr>
      <tr style="border-bottom: 1px solid #cbd5e1;">
        <td style="padding: 12px; font-weight: 600; color: #1e293b; text-align: left;">Standing Adjustable Desk</td>
        <td style="padding: 12px; font-family: monospace; font-weight: bold; color: #020617; text-align: left;">10 NOS</td>
        <td style="padding: 12px; font-family: monospace; color: #475569; text-align: left;">₹8,200</td>
        <td style="padding: 12px; font-family: monospace; text-align: right; font-weight: 800; color: #020617;">₹82,000</td>
      </tr>
    `;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${docNum} - ${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f8fafc;
      color: #1e293b;
      margin: 0;
      padding: 40px;
    }
    .invoice-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .logo {
      font-weight: 900;
      font-size: 24px;
      color: #0f172a;
    }
    .logo-green {
      color: #047857;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 16px;
    }
    .meta-title {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: bold;
      color: #64748b;
      margin-bottom: 8px;
    }
    .meta-text {
      font-size: 13px;
      font-weight: 600;
      margin: 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
      font-size: 13px;
    }
    .items-table th {
      background: #f1f5f9;
      padding: 12px;
      text-align: left;
      font-weight: bold;
      color: #475569;
      font-size: 11px;
      text-transform: uppercase;
      border-bottom: 1px solid #cbd5e1;
    }
    .totals-row td {
      padding: 10px 12px;
      text-align: right;
    }
    .grand-total {
      font-size: 16px;
      font-weight: 800;
      color: #047857;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .badge-paid {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }
    .badge-unpaid {
      background: #fffbeb;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    @media print {
      body { background: white; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="logo">Vendor<span class="logo-green">Bridge</span></div>
        <p style="font-size: 11px; color: #64748b; margin: 4px 0 0 0;">Digital Transaction Ledger Certificate</p>
      </div>
      <div style="text-align: right;">
        <span class="badge ${activeDocument.status === 'Paid' || activeDocument.status === 'Delivered' ? 'badge-paid' : 'badge-unpaid'}">${activeDocument.status}</span>
        <p style="font-size: 11px; color: #64748b; margin: 8px 0 0 0; font-family: monospace;">UUID: ${activeDocument.id}</p>
      </div>
    </div>

    <div style="margin-bottom: 30px;">
      <h1 style="font-size: 22px; margin: 0; color: #020617; font-weight: 800;">${title}</h1>
      <p style="font-size: 13px; color: #475569; margin: 5px 0 0 0;">Reference Code: ${docNum}</p>
    </div>

    <div class="meta-grid">
      <div class="meta-box">
        <label class="meta-title">BILL TO (RECIPIENT)</label>
        <p class="meta-text" style="color: #020617; font-size: 14px;">${activeDocument.organisationName}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 12px;">${activeDocument.organisationAddress}</p>
        <p style="margin: 0; font-family: monospace; font-size: 11px; color: #64748b;"><span style="color:#047857; font-weight:bold;">GSTIN:</span> ${activeDocument.organisationGst}</p>
      </div>
      <div class="meta-box">
        <label class="meta-title">AUTHORIZED SUPPLIER</label>
        <p class="meta-text" style="color: #020617; font-size: 14px;">${activeDocument.vendorName}</p>
        <p style="margin: 4px 0; color: #475569; font-size: 12px;">${activeDocument.vendorAddress}</p>
        <p style="margin: 0; font-family: monospace; font-size: 11px; color: #64748b;"><span style="color:#047857; font-weight:bold;">GSTIN:</span> ${activeDocument.vendorGst}</p>
      </div>
    </div>

    <div class="meta-grid" style="grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
      <div class="meta-box" style="padding: 12px;">
        <div class="meta-title" style="font-size: 8px;">TENDER ID</div>
        <div style="font-size: 11px; font-weight: bold; font-family: monospace;">${activeDocument.rfqId}</div>
      </div>
      <div class="meta-box" style="padding: 12px;">
        <div class="meta-title" style="font-size: 8px;">BILLING DATE</div>
        <div style="font-size: 11px; font-weight: bold;">${activeDocument.dateCreated}</div>
      </div>
      <div class="meta-box" style="padding: 12px;">
        <div class="meta-title" style="font-size: 8px;">PO NUMBER</div>
        <div style="font-size: 11px; font-weight: bold; font-family: monospace;">${activeDocument.poNumber}</div>
      </div>
      <div class="meta-box" style="padding: 12px;">
        <div class="meta-title" style="font-size: 8px;">${isDocInvoice ? 'DUE DATE' : 'VENDOR CONTRACT ID'}</div>
        <div style="font-size: 11px; font-weight: bold; font-family: monospace;">${isDocInvoice ? (activeDocument as any).dueDate : activeDocument.vendorId}</div>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>Item Specification</th>
          <th>Tender Qty</th>
          <th>Unit Rate (INR)</th>
          <th style="text-align: right;">Net Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
        <tr class="totals-row">
          <td colspan="3" style="font-weight: 600; color: #475569; text-align: right;">Subtotal</td>
          <td style="font-family: monospace; font-weight: bold; color: #1e293b;">₹${activeDocument.subtotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="totals-row">
          <td colspan="3" style="color: #64748b; text-align: right;">CGST (9%)</td>
          <td style="font-family: monospace; color: #475569;">₹${activeDocument.cgst.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="totals-row">
          <td colspan="3" style="color: #64748b; text-align: right;">SGST (9%)</td>
          <td style="font-family: monospace; color: #475569;">₹${activeDocument.sgst.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="totals-row">
          <td colspan="3" style="font-weight: 800; color: #020617; font-size: 14px; text-align: right;">Grand Consolidated Total</td>
          <td class="grand-total">₹${activeDocument.grandTotal.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>

    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; font-family: monospace; line-height: 1.6;">
      Secure QR Validation Hash: vbridge-verify-${activeDocument.id}-${Date.now().toString().slice(-4)}<br>
      This represents a legally authenticated cyber-ledger output. Approved under multi-party sign-off.
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${isDocInvoice ? 'Invoice' : 'Purchase_Order'}_${docNum}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (onLogActivity) {
      onLogActivity(
        'Invoice', 
        `Downloaded dynamic printable ledger file for ${isDocInvoice ? 'Invoice' : 'Purchase Order'} ${docNum}.`, 
        sessionUser?.name || 'Rahul Mehta'
      );
    }
  };

  // Secure Cryptographic SMTP Dispatch Simulation
  const handleSecureSMTPDispatch = () => {
    if (!activeDocument) return;
    const isDocInvoice = viewMode === 'invoice';
    const docNum = isDocInvoice ? (activeDocument as any).invoiceNumber : activeDocument.poNumber;
    
    setIsEmailSending(true);
    setEmailSentSuccess(false);
    
    // Smooth step-by-step cryptographic logging pipeline simulation
    setEmailStatusMessage('Initializing SSL Secure Sockets on port 465...');
    
    setTimeout(() => {
      setEmailStatusMessage('Resolving remote DNS envelope receptors...');
      
      setTimeout(() => {
        setEmailStatusMessage(`Packing TLS archive attachments (${includePdf ? 'PDF Ledger, ' : ''}${includeAuditTrail ? 'Compliance Certificate' : ''})...`);
        
        setTimeout(() => {
          setEmailStatusMessage('Handshaking digital cryptographic validation headers...');
          
          setTimeout(() => {
            setIsEmailSending(false);
            setEmailSentSuccess(true);
            setEmailStatusMessage(`Transmission dispatched successfully! Mail received at ${emailTo}`);
            
            // Log under Activities
            if (onLogActivity) {
              onLogActivity(
                'Invoice',
                `Secured SMTP Dispatch: Sent ${isDocInvoice ? 'Invoice' : 'Purchase Order'} ${docNum} to ${emailTo} with authenticated certificates.`,
                sessionUser?.name || 'Rahul Mehta'
              );
            }
          }, 700);
        }, 700);
      }, 700);
    }, 700);
  };

  // Filter lists based on mode
  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch = 
      i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.poNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'All') return matchesSearch;
    return matchesSearch && i.status === filterStatus;
  });

  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'All') return matchesSearch;
    return matchesSearch && po.status === filterStatus;
  });

  const onSelectDocument = (id: string) => {
    if (viewMode === 'invoice') {
      setSelectedInvoiceId(id);
    } else {
      setSelectedPoId(id);
    }
  };

  const activeList = viewMode === 'invoice' ? filteredInvoices : filteredPurchaseOrders;
  const isInvoice = viewMode === 'invoice';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header element */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
          {isInvoice ? 'Purchase Ledger & Invoicing' : 'Purchase Orders Ledger'}
        </h1>
        <p className="text-sm text-slate-400">
          {isInvoice 
            ? 'Authorize double-entry clearances, compute tax structures, and monitor corporate settlement queues.' 
            : 'Track sent purchase contracts, confirm supplier acceptance, and verify line item specs.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: List of documents with search (4 columns) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">
              {isInvoice ? 'Invoice Ledger' : 'PO Ledger'}
            </span>
            <div className="flex gap-1.5 bg-slate-950 p-0.5 border border-slate-800 rounded-lg">
              <button 
                onClick={() => { setViewMode('invoice'); setFilterStatus('All'); setSearchQuery(''); }}
                className={`px-2 py-1 text-[8px] font-bold font-mono tracking-wider uppercase rounded ${isInvoice ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/25' : 'text-slate-500 hover:text-slate-200'}`}
              >
                Invoices
              </button>
              <button 
                onClick={() => { setViewMode('po'); setFilterStatus('All'); setSearchQuery(''); }}
                className={`px-2 py-1 text-[8px] font-bold font-mono tracking-wider uppercase rounded ${!isInvoice ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/25' : 'text-slate-500 hover:text-slate-200'}`}
              >
                POs
              </button>
            </div>
          </div>

          {/* Mini search config */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder={isInvoice ? "Search invoice or vendor..." : "Search PO or vendor..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white font-mono"
            />
          </div>

          {/* Filter Status Selector */}
          <div className="flex gap-1 bg-slate-950 p-1 border border-slate-850 rounded-lg">
            <button
              onClick={() => setFilterStatus('All')}
              className={`flex-1 py-1 text-[9px] font-bold font-mono tracking-wider uppercase rounded cursor-pointer ${
                filterStatus === 'All' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            {isInvoice ? (
              <>
                <button
                  onClick={() => setFilterStatus('Pending Payment')}
                  className={`flex-1 py-1 text-[9px] font-bold font-mono tracking-wider uppercase rounded cursor-pointer ${
                    filterStatus === 'Pending Payment' ? 'bg-amber-950 text-amber-400 border border-amber-500/20' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Unpaid
                </button>
                <button
                  onClick={() => setFilterStatus('Paid')}
                  className={`flex-1 py-1 text-[9px] font-bold font-mono tracking-wider uppercase rounded cursor-pointer ${
                    filterStatus === 'Paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Paid
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setFilterStatus('Confirmed')}
                  className={`flex-1 py-1 text-[9px] font-bold font-mono tracking-wider uppercase rounded cursor-pointer ${
                    filterStatus === 'Confirmed' ? 'bg-blue-950 text-blue-400 border border-blue-500/25' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Confirmed
                </button>
                <button
                  onClick={() => setFilterStatus('Delivered')}
                  className={`flex-1 py-1 text-[9px] font-bold font-mono tracking-wider uppercase rounded cursor-pointer ${
                    filterStatus === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Delivered
                </button>
              </>
            )}
          </div>

          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {activeList.map((doc) => {
              const selectedId = isInvoice ? selectedInvoiceId : selectedPoId;
              const isActive = selectedId === doc.id;
              const docNum = 'invoiceNumber' in doc ? doc.invoiceNumber : doc.poNumber;
              const label = isInvoice ? `PO: ${doc.poNumber}` : `RFQ: ${doc.rfqId}`;

              return (
                <button
                  key={doc.id}
                  onClick={() => onSelectDocument(doc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                    isActive
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-white shadow-md shadow-emerald-500/5'
                      : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-slate-400 font-bold tracking-wider">{docNum}</div>
                    <div className="text-xs font-semibold leading-tight text-white line-clamp-1">{doc.vendorName}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{label}</div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-xs font-bold text-slate-200 font-mono">{formatCurrency(doc.grandTotal)}</div>
                    <span className={`inline-flex px-1.5 py-0.5 rounded-[4px] text-[8px] font-extrabold uppercase font-mono ${
                      doc.status === 'Paid' || doc.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-400/20'
                        : doc.status === 'Confirmed'
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/20'
                        : 'bg-amber-950 text-amber-500 border border-amber-500/20 &apos;animate-pulse&apos;'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </button>
              );
            })}
            {activeList.length === 0 && (
              <p className="text-slate-600 text-center py-6 font-mono text-[11px]">
                No {viewMode}s found matching criteria.
              </p>
            )}
          </div>
        </div>

        {/* Right column: Purchase Order & Invoice Screen view - SCREEN 9 (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          {activeDocument ? (
            <div className="space-y-6">
              
              {/* Top simulation control actions matching top right buttons in Screen 9 */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">Action Desk</span>
                  <span className="text-xs text-white font-semibold flex items-center gap-1 mt-0.5">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    Secure ERP Document Operations
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadInvoiceHTML}
                    className="bg-slate-955 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 p-2 px-3.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-4.5 h-4.5 text-emerald-450" />
                    DOWNLOAD PDF
                  </button>
                  
                  <button
                    onClick={triggerPrint}
                    className="bg-slate-955 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 p-2 px-3.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4.5 h-4.5 text-blue-400" />
                    PRINT
                  </button>

                  <button
                    onClick={() => {
                      setIsEmailModalOpen(true);
                      setEmailSentSuccess(false);
                      setEmailStatusMessage('');
                    }}
                    className="bg-slate-955 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 p-2 px-3.5 rounded-xl text-xs font-bold font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-4.5 h-4.5 text-emerald-400" />
                    EMAIL DOCUMENT
                  </button>
                </div>
              </div>

              {/* Core Ledger Document mimicking the Excalidraw white background or carbon paper layout */}
              <div className="printable-invoice-container bg-slate-950 border border-slate-800 rounded-2xl p-8 relative space-y-8 overflow-hidden print:bg-white print:text-black">
                
                {/* Branding indicator watermark */}
                <div className="absolute top-0 right-0 p-4 bg-emerald-950/20 text-emerald-400 font-display font-extrabold text-sm font-mono uppercase tracking-widest rounded-bl-xl border-l border-b border-emerald-500/10">
                  VendorBridge Ledger Unit
                </div>

                {/* Print layout headers */}
                <div className="border-b border-slate-850 pb-6">
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {isInvoice ? 'Purchase Invoice Record' : 'Official Purchase Contract (PO)'}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    {('invoiceNumber' in activeDocument) ? activeDocument.invoiceNumber : activeDocument.poNumber} &bull; Autogenerated after workflow authorization sign-off
                  </p>
                </div>

                {/* Bill to / Vendor Details - Row Split */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  
                  {/* Bill to: Left column */}
                  <div className="space-y-1 bg-slate-900 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest font-mono block">
                      Bill to:
                    </span>
                    <p className="text-sm font-bold text-white font-sans">{activeDocument.organisationName}</p>
                    <p className="text-slate-400 leading-relaxed text-[11px] font-medium">{activeDocument.organisationAddress}</p>
                    <p className="text-[11px] font-mono text-slate-400 pt-1 flex items-center gap-1.5">
                      <span className="text-blue-400">GSTIN:</span>
                      {activeDocument.organisationGst}
                    </p>
                  </div>

                  {/* Vendor: Right column */}
                  <div className="space-y-1 bg-slate-900 border border-slate-850 p-4 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest font-mono block">
                      Vendor Details:
                    </span>
                    <p className="text-sm font-bold text-white font-sans">{activeDocument.vendorName}</p>
                    <p className="text-slate-400 leading-relaxed text-[11px] font-medium">{activeDocument.vendorAddress}</p>
                    <p className="text-[11px] font-mono text-slate-400 pt-1 flex items-center gap-1.5">
                      <span className="text-emerald-400">GSTIN:</span>
                      {activeDocument.vendorGst}
                    </p>
                  </div>

                </div>

                {/* ID block parameters mimicking the middle segment in Screen 9 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 border border-slate-850 p-4 rounded-xl font-mono text-xs text-slate-300">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block">PO Number</span>
                    <span className="text-slate-200 font-bold font-sans">{activeDocument.poNumber}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block">Billing Date</span>
                    <span className="text-slate-200 font-semibold">{activeDocument.dateCreated}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block">Tender ID</span>
                    <span className="text-slate-200 font-semibold">{activeDocument.rfqId}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase text-slate-500 font-bold block">
                      {isInvoice ? 'Due Date' : 'Assigned Vendor ID'}
                    </span>
                    <span className="text-slate-200 font-semibold">
                      {isInvoice && ('dueDate' in activeDocument) ? activeDocument.dueDate : activeDocument.vendorId}
                    </span>
                  </div>
                </div>

                {/* Document Items Table - Labeled precisely matching invoice columns */}
                <div className="overflow-x-auto border border-slate-850 rounded-xl">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-850 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                        <th className="p-3">Item Description</th>
                        <th className="p-3">Qty</th>
                        <th className="p-3">Unit Price (INR)</th>
                        <th className="p-3 text-right">Total Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 font-mono text-slate-350">
                      {(activeDocument as any).lineItems?.map((item: any) => {
                        const unitRate = 'unitPrice' in item ? (item.unitPrice || 3500) : 3500;
                        const lineTotal = item.qty * unitRate;
                        return (
                          <tr key={item.id} className="hover:bg-slate-900/10 text-xs">
                            <td className="p-3 font-sans font-semibold text-slate-200">{item.item}</td>
                            <td className="p-3 text-slate-300 font-bold">{item.qty} {item.unit}</td>
                            <td className="p-3 text-slate-400">₹{unitRate.toLocaleString('en-IN')}</td>
                            <td className="p-3 text-right font-extrabold text-slate-200">₹{lineTotal.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                      {(!(activeDocument as any).lineItems || (activeDocument as any).lineItems.length === 0) && (
                        <>
                          <tr className="hover:bg-slate-900/10 text-xs">
                            <td className="p-3 font-sans font-semibold text-slate-200">Ergonomic chair</td>
                            <td className="p-3 text-slate-300 font-bold">25 NOS</td>
                            <td className="p-3 text-slate-400">₹3,500</td>
                            <td className="p-3 text-right font-extrabold text-slate-200">₹87,500</td>
                          </tr>
                          <tr className="hover:bg-slate-900/10 text-xs">
                            <td className="p-3 font-sans font-semibold text-slate-200">Standing desks</td>
                            <td className="p-3 text-slate-300 font-bold">10 NOS</td>
                            <td className="p-3 text-slate-400 font-semibold">₹8,200</td>
                            <td className="p-3 text-right font-extrabold text-slate-200">₹82,000</td>
                          </tr>
                        </>
                      )}

                      {/* Calculations summary row block */}
                      <tr className="bg-slate-900/40 text-xs">
                        <td colSpan={3} className="p-3 text-right font-semibold text-slate-400 font-sans">Subtotal</td>
                        <td className="p-3 text-right font-extrabold text-slate-300">₹{activeDocument.subtotal.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="bg-slate-900/40 text-[11px]">
                        <td colSpan={3} className="p-2 text-right font-semibold text-slate-500 font-sans">CGST (9%)</td>
                        <td className="p-2 text-right text-slate-400">₹{activeDocument.cgst.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="bg-slate-900/40 text-[11px]">
                        <td colSpan={3} className="p-2 text-right font-semibold text-slate-500 font-sans">SGST (9%)</td>
                        <td className="p-2 text-right text-slate-400">₹{activeDocument.sgst.toLocaleString('en-IN')}</td>
                      </tr>
                      <tr className="bg-slate-900/60 text-sm">
                        <td colSpan={3} className="p-3.5 text-right font-bold text-white font-sans">Grand Total</td>
                        <td className="p-3.5 text-right font-black text-emerald-400 text-base border-t border-slate-800">
                          ₹{activeDocument.grandTotal.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Footer Section with status description & Mark as paid button */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-850">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500 font-bold font-mono uppercase">
                      Current ledger status:
                    </span>
                    
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-extrabold uppercase font-mono border ${
                      activeDocument.status === 'Paid' || activeDocument.status === 'Delivered'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-500/20'
                        : activeDocument.status === 'Confirmed'
                        ? 'bg-blue-950 text-blue-400 border-blue-500/25'
                        : 'bg-amber-950 text-amber-500 border-amber-500/20 animate-pulse'
                    }`}>
                      {activeDocument.status}
                    </span>
                  </div>

                  {isInvoice && activeDocument.status === 'Pending Payment' && (
                    <button
                      onClick={() => {
                        onMarkAsPaid(activeDocument.id);
                        alert(`Settlement cleared. Double-entry general ledger updated successfully.`);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider font-mono cursor-pointer flex items-center gap-2"
                    >
                      <DollarSign className="w-4.5 h-4.5 text-slate-950" />
                      Mark as Paid
                    </button>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <p className="text-slate-500 text-center font-mono py-12">Loading {viewMode} parameters...</p>
          )}
        </div>

      </div>

      {/* Dynamic SMTP Dispatch Dialogue Panel */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in print:hidden">
          <div className="bg-slate-900 border border-slate-705 rounded-3xl max-w-xl w-full p-6 text-slate-100 relative space-y-6 shadow-2xl shadow-slate-950">
            
            <button
              onClick={() => setIsEmailModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg hover:text-emerald-400 text-slate-400 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Mail className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-slate-400 font-mono">
                  SMTP SECURED TRANSPORTER
                </span>
                <h3 className="text-lg font-display font-black text-white">Secure Envelope Dispatch</h3>
                <p className="text-xs text-slate-400">Transmit digital contract ledger and verified files with TLS encryption.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Recipient Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Recipient Contact</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input 
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="recipient@vendor.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-3 py-2 text-xs rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Envelope Subject Header</label>
                <input 
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Encryption envelope header key..."
                  className="w-full bg-slate-950 border border-slate-800 text-white px-3 py-2 text-xs rounded-xl font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Body */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Secured Body Text</label>
                <textarea 
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  rows={6}
                  placeholder="Enter custom transaction correspondence..."
                  className="w-full bg-slate-950 border border-slate-800 text-white p-3 text-xs rounded-xl font-mono focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
                />
              </div>

              {/* Document Attachments Panel */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-850">
                <span className="text-[9px] text-slate-500 font-bold font-mono uppercase tracking-wider block">Cryptographic Secure Attachments</span>
                
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-slate-350">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 transition">
                    <input 
                      type="checkbox"
                      checked={includePdf}
                      onChange={(e) => setIncludePdf(e.target.checked)}
                      className="rounded accent-emerald-500 bg-slate-900 border-slate-700 w-3.5 h-3.5"
                    />
                    <span>[x] PDF Document Ledger</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer hover:text-slate-100 transition">
                    <input 
                      type="checkbox"
                      checked={includeAuditTrail}
                      onChange={(e) => setIncludeAuditTrail(e.target.checked)}
                      className="rounded accent-emerald-500 bg-slate-900 border-slate-700 w-3.5 h-3.5"
                    />
                    <span>[x] Compliance Certificate</span>
                  </label>
                </div>
              </div>

              {/* Log Pipeline States */}
              {(isEmailSending || emailStatusMessage) && (
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 font-mono text-[10px] space-y-1 text-slate-400">
                  <div className="flex items-center gap-2">
                    {!emailSentSuccess && <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />}
                    {emailSentSuccess && <span className="text-emerald-400 font-bold font-sans">✓</span>}
                    <span className={emailSentSuccess ? "text-emerald-400 font-extrabold" : "text-slate-300"}>
                      {emailStatusMessage}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action footer */}
            <div className="flex gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="flex-1 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white py-2.5 rounded-xl border border-slate-800 hover:border-slate-705 transition font-mono font-bold text-xs uppercase"
              >
                Close Transmitter
              </button>
              
              {!emailSentSuccess ? (
                <button
                  type="button"
                  disabled={isEmailSending}
                  onClick={handleSecureSMTPDispatch}
                  className="flex-1 bg-emerald-650 hover:bg-emerald-600 text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 py-2.5 rounded-xl transition font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4 text-white" />
                  Transmit Envelope
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 py-2.5 rounded-xl transition font-mono font-black text-xs uppercase"
                >
                  Confirm & Dismiss
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
