import React, { useState, useEffect } from 'react';
import { RFQ, Vendor, LineItem } from '../types';
import { generateId } from '../utils';
import { 
  FileText, 
  Plus, 
  MapPin, 
  Calendar, 
  Building2, 
  Trash2, 
  UploadCloud, 
  Clock, 
  CheckCircle, 
  Send, 
  Check, 
  File, 
  PlusCircle, 
  ArrowRight,
  ChevronRight,
  Info,
  X
} from 'lucide-react';

interface RfqsViewProps {
  rfqs: RFQ[];
  vendors: Vendor[];
  onCreateRfq: (rfq: Omit<RFQ, 'id' | 'dateCreated'>) => void;
  activeSubTab?: 'list' | 'create';
}

export default function RfqsView({ 
  rfqs, 
  vendors, 
  onCreateRfq,
  activeSubTab = 'list'
}: RfqsViewProps) {
  const [subTab, setSubTab] = useState<'list' | 'create'>(activeSubTab);
  const [selectedAuditRfq, setSelectedAuditRfq] = useState<RFQ | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto Dismiss Error Messages
  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    setSubTab(activeSubTab);
  }, [activeSubTab]);
  
  // Create RFQ Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [deadline, setDeadline] = useState('2025-06-15');
  const [description, setDescription] = useState('');
  
  // Step indicator
  const [formStep, setFormStep] = useState(1);
  
  // Line items states
  const [lineItems, setLineItems] = useState<Omit<LineItem, 'id'>[]>([
    { item: 'Ergonomic chair', qty: 25, unit: 'NOS' },
    { item: 'Standing desks', qty: 10, unit: 'NOS' }
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(5);
  const [newItemUnit, setNewItemUnit] = useState('NOS');

  // Assigned vendors
  const [assignedVendorIds, setAssignedVendorIds] = useState<string[]>(['V1', 'V2']);
  
  // Auto-align assigned vendors to selected category changes
  useEffect(() => {
    const validInCat = vendors
      .filter(v => {
        const vendorCat = (v.category || '').toLowerCase().trim();
        const selectedCat = (category || '').toLowerCase().trim();
        // Support matching exact name or close forms like 'IT Hardware' matching 'IT'
        return vendorCat === selectedCat || 
               vendorCat.startsWith(selectedCat) || 
               selectedCat.startsWith(vendorCat);
      })
      .filter(v => v.status === 'Active')
      .map(v => v.id);
    setAssignedVendorIds(validInCat);
  }, [category, vendors]);
  
  // Simulated files
  const [tempFiles, setTempFiles] = useState<{name: string, size: string}[]>([
    { name: 'Floorplan_Layout_3rdFloor.pdf', size: '2.4 MB' }
  ]);

  const handleAddLineItem = () => {
    if (!newItemName) {
      setErrorMsg('Must specify product description / item name.');
      return;
    }
    setLineItems([...lineItems, { item: newItemName, qty: newItemQty, unit: newItemUnit }]);
    setNewItemName('');
    setNewItemQty(1);
    setErrorMsg(null);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const toggleVendorAssignment = (vendorId: string) => {
    if (assignedVendorIds.includes(vendorId)) {
      setAssignedVendorIds(assignedVendorIds.filter(id => id !== vendorId));
    } else {
      setAssignedVendorIds([...assignedVendorIds, vendorId]);
    }
  };

  const handleFormSubmit = (status: 'Sent to Vendors' | 'Draft') => {
    if (!title) {
      setErrorMsg('Please specify an RFQ Title.');
      return;
    }
    if (lineItems.length === 0) {
      setErrorMsg('Procurement requires at least one line item before submitting.');
      return;
    }

    const compiledItems: LineItem[] = lineItems.map((item, idx) => ({
      id: `L-${100 + idx}`,
      ...item
    }));

    onCreateRfq({
      title,
      category,
      deadline,
      description,
      status,
      assignedVendors: assignedVendorIds,
      lineItems: compiledItems,
      attachments: tempFiles
    });

    // Reset Form
    setTitle('');
    setCategory('Furniture');
    setDeadline('2025-06-15');
    setDescription('');
    setLineItems([
      { item: 'Ergonomic chair', qty: 25, unit: 'NOS' },
      { item: 'Standing desks', qty: 10, unit: 'NOS' }
    ]);
    setAssignedVendorIds(['V1', 'V2']);
    setFormStep(1);
    setSubTab('list');
  };

  const handleMockFileUpload = () => {
    const names = ['Specs_RevisionB.pdf', 'Compliance_Requirements.pdf', 'Custom_Sizing_Template.xlsx'];
    const selected = names[Math.floor(Math.random() * names.length)];
    setTempFiles([...tempFiles, { name: selected, size: `${(1 + Math.random() * 4).toFixed(1)} MB` }]);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Tab Switcher Top header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
            Requests For Quotation (RFQ)
          </h1>
          <p className="text-sm text-slate-400">
            Publish high-density specifications, invite active suppliers, and track timelines.
          </p>
        </div>
        
        <div className="flex gap-2 bg-slate-950 p-1 border border-slate-800 rounded-xl w-fit self-end">
          <button
            onClick={() => setSubTab('list')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer ${
              subTab === 'list'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Requests ({rfqs.length})
          </button>
          <button
            onClick={() => { setSubTab('create'); setFormStep(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'create'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Plus className="w-4.5 h-4.5 text-emerald-400" />
            + Create RFQ
          </button>
        </div>
      </div>

      {subTab === 'list' ? (
        /* RFQ DIRECTORY LIST VIEW */
        <div className="grid grid-cols-1 gap-4">
          {rfqs.map((r) => {
            const dateObj = new Date(r.deadline);
            const formattedDate = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            
            return (
              <div 
                key={r.id} 
                className="bg-slate-900 border border-slate-800 hover:border-slate-750 p-5 rounded-2xl relative transition-all flex flex-col md:flex-row justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-950 border border-slate-800 p-1 px-2.5 rounded-md">
                      {r.id}
                    </span>
                    <span className="px-2 py-0.5 rounded font-bold font-mono text-[9px] uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {r.category}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                      r.status === 'Quotations Received'
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/20'
                        : r.status === 'Sent to Vendors'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                        : r.status === 'Draft'
                        ? 'bg-slate-950 text-slate-400 border border-slate-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        r.status === 'Quotations Received' ? 'bg-blue-400' : r.status === 'Sent to Vendors' ? 'bg-emerald-400' : 'bg-slate-400'
                      }`} />
                      {r.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-white">{r.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {r.description}
                    </p>
                  </div>

                  {/* Line items table preview */}
                  <div className="pt-2">
                    <div className="inline-flex flex-wrap gap-2">
                      {r.lineItems.map(item => (
                        <span key={item.id} className="text-[10px] font-mono bg-slate-950 hover:bg-slate-800 text-slate-400 p-1 px-2 border border-slate-855 rounded transition-all">
                          &bull; {item.item} ({item.qty} {item.unit})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deadlines and statistics right rail */}
                <div className="flex flex-col justify-between items-end md:min-w-48 text-right border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-4">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between md:justify-end gap-1.5 text-xs font-mono">
                      <span className="text-slate-500 uppercase text-[10px]">Deadline Limit</span>
                      <span className="text-slate-200 font-bold flex items-center gap-1.5 leading-none">
                        <Calendar className="w-3.5 h-3.5 text-red-400" />
                        {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-1.5 text-xs font-mono">
                      <span className="text-slate-500 uppercase text-[10px]">Bidders Invited</span>
                      <span className="text-slate-200 font-bold flex items-center gap-1 leading-none">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {r.assignedVendors.length} Suppliers
                      </span>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-1.5 text-xs font-mono">
                      <span className="text-slate-500 uppercase text-[10px]">Attachments Available</span>
                      <span className="text-slate-300 font-medium">
                        {r.attachments.length} Specs files
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 w-full">
                    <button
                      onClick={() => setSelectedAuditRfq(r)}
                      className="w-full md:w-auto inline-flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-4 py-2 font-bold font-mono tracking-wider font-semibold rounded-xl text-xs uppercase border border-slate-755 cursor-pointer transition-colors"
                    >
                      Audit Details
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* SCREEN 5: CREATE NEW RFQ SCREEN with detailed form sections */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          
          {/* Progress Indicator (1) --- (2) --- (3) from screen 5 */}
          <div className="flex flex-col items-center justify-center max-w-lg mx-auto py-4 gap-4">
            <div className="flex items-center w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-slate-900 transition-all ${
                formStep >= 1 ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                1
              </div>
              <div className={`flex-1 h-1 transition-all ${formStep >= 2 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-slate-900 transition-all ${
                formStep >= 2 ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25' : 'bg-slate-800 text-slate-400'
              }`}>
                2
              </div>
              <div className={`flex-1 h-1 transition-all ${formStep >= 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-slate-900 transition-all ${
                formStep >= 3 ? 'bg-emerald-600 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/25' : 'bg-slate-800 text-slate-400'
              }`}>
                3
              </div>
            </div>

            {errorMsg && (
              <div className="w-full bg-rose-50 border border-rose-200 p-3 rounded-xl text-rose-700 font-semibold text-xs flex items-center justify-between gap-3 shadow-md animate-bounce-short">
                <span className="flex items-center gap-1.5">⚠️ {errorMsg}</span>
                <button 
                  type="button" 
                  onClick={() => setErrorMsg(null)} 
                  className="p-1 text-[10px] uppercase font-mono font-bold tracking-wider text-rose-500 hover:text-rose-755 cursor-pointer"
                >
                  dismiss
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column (Main specifications meta) */}
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  RFQ's Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laptops purchase or Office Chairs"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if(e.target.value && formStep === 1) setFormStep(2);
                  }}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                    Category Name
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none font-mono"
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Stationery">Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                    Deadline Option *
                  </label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-white font-mono transition-all font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe item quality guidelines, delivery bounds, or dimensional guidelines..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-200 transition-all"
                />
              </div>

              {/* Action buttons save and send or draft */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => handleFormSubmit('Sent to Vendors')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-lg hover:shadow-emerald-500/10"
                >
                  <Send className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  Save & Send to Vendors
                </button>
                <button
                  type="button"
                  onClick={() => handleFormSubmit('Draft')}
                  className="bg-slate-950 hover:bg-slate-900 text-slate-300 font-semibold border border-slate-800 py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition-all"
                >
                  Save as Draft
                </button>
              </div>
            </div>

            {/* Right Column (Item list manager and target vendor assignment) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Product Specifications Line Items */}
              <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                  Line Items Specification
                </span>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px] font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="py-2">Item Name Dec</th>
                        <th className="py-2">Qty</th>
                        <th className="py-2">Unit</th>
                        <th className="py-2 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {lineItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="py-2 text-slate-200 font-sans font-semibold">{item.item}</td>
                          <td className="py-2 text-emerald-400 font-bold">{item.qty}</td>
                          <td className="py-2 text-slate-400 font-semibold">{item.unit}</td>
                          <td className="py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="text-red-400 hover:text-red-300 cursor-pointer p-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {lineItems.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center text-slate-600 py-4 font-mono text-[10px]">
                            No procurement items declared yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Inline adder block for Screen 5 line items */}
                <div className="grid grid-cols-12 gap-2 pt-2 items-center">
                  <div className="col-span-6">
                    <input
                      type="text"
                      placeholder="Add Item. e.g. Height desks"
                      value={newItemName}
                      onChange={(e) => {
                        setNewItemName(e.target.value);
                        if (lineItems.length > 0 && formStep === 2) setFormStep(3);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min={1}
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-white focus:outline-none text-center font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-3 flex gap-1">
                    <select
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg text-[10px] text-slate-400 focus:outline-none px-1.5 py-2 font-mono"
                    >
                      <option value="NOS">NOS</option>
                      <option value="SET">SET</option>
                      <option value="KM">KM</option>
                      <option value="HRS">HRS</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddLineItem}
                      className="bg-slate-800 hover:bg-slate-700 text-emerald-400 p-2 rounded-lg border border-slate-700 cursor-pointer flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ASSIGN VENDORS tags segment from Screen 5 wireframe */}
              <div className="space-y-4 bg-slate-900 p-6 rounded-3xl border-2 border-slate-800 shadow-2xl shadow-slate-950/80 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500/50 via-emerald-400 to-emerald-500/40"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block font-mono">
                      Assign Compliant Category-Registered Vendors
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Currently showing audited suppliers matching the active procurement category: <span className="text-emerald-300 font-mono font-bold underline decoration-emerald-500/40 underline-offset-4">"{category}"</span>
                    </p>
                  </div>
                  <span className="self-start sm:self-center px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase font-bold tracking-wider font-mono rounded-xl shrink-0">
                    Category Lock: Active
                  </span>
                </div>

                <div className="mt-4">
                  {(() => {
                    const filteredList = vendors.filter(v => {
                      const vendorCat = (v.category || '').toLowerCase().trim();
                      const selectedCat = (category || '').toLowerCase().trim();
                      return vendorCat === selectedCat || 
                             vendorCat.startsWith(selectedCat) || 
                             selectedCat.startsWith(vendorCat);
                    });

                    if (filteredList.length === 0) {
                      return (
                        <div className="p-5 bg-slate-950/60 border border-slate-850 rounded-2xl text-center space-y-2">
                          <p className="text-xs text-amber-400 font-mono font-bold flex items-center justify-center gap-1.5">
                            ⚠️ No active registered suppliers found matching the "{category}" category.
                          </p>
                          <p className="text-[10px] text-slate-450 max-w-md mx-auto leading-relaxed">
                            To maintain secure procurement SLAs, please onboard category-registered vendors first under the "Suppliers" audit tab or import sheets in the Joiner Panel.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredList.map((v) => {
                          const isSelected = assignedVendorIds.includes(v.id);
                          const isFake = v.isFakeVendor || (v.trustScore ?? 85) < 45;
                          return (
                            <div
                              key={v.id}
                              role="button"
                              tabIndex={0}
                              onClick={() => toggleVendorAssignment(v.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggleVendorAssignment(v.id);
                                }
                              }}
                              className={`text-left p-4 rounded-2xl transition-all border-2 flex flex-col justify-between gap-4 text-xs group cursor-pointer ${
                                isSelected
                                  ? 'bg-slate-950 border-emerald-500 shadow-lg shadow-emerald-500/10 text-slate-100'
                                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-950 hover:border-slate-700'
                              } ${isFake ? 'border-rose-950 bg-rose-950/5' : ''}`}
                            >
                              <div className="flex items-start justify-between w-full">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 font-sans">
                                    <Building2 className={`w-4.5 h-4.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-450'}`} />
                                    <span className="font-extrabold text-slate-100">{v.name}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
                                    <span>ID: {v.id}</span>
                                    <span className="text-slate-750">&bull;</span>
                                    <span>GST: {v.gstNo.slice(0, 10)}...</span>
                                  </div>
                                </div>
                                <div className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center text-[10px] ${
                                  isSelected 
                                    ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black scale-105' 
                                    : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                                }`}>
                                  {isSelected ? "✓" : ""}
                                </div>
                              </div>

                              <div className="flex items-center justify-between w-full border-t border-slate-950 pt-3 text-[10px]">
                                {/* Trust score and Risk factor */}
                                <div className="flex items-center gap-1.5 font-mono">
                                  <span className={`font-bold ${
                                    (v.trustScore ?? 85) >= 90 ? 'text-emerald-400' :
                                    (v.trustScore ?? 85) >= 70 ? 'text-amber-400' : 'text-rose-450 font-black animate-pulse'
                                  }`}>
                                    {v.trustScore ?? 85}% Score
                                  </span>
                                  <span className="text-slate-600">/</span>
                                  <span className={`font-bold ${
                                    (v.riskCategory ?? 'Low Risk') === 'Low Risk' ? 'text-emerald-500' :
                                    (v.riskCategory ?? 'Low Risk') === 'Medium Risk' ? 'text-amber-500' : 'text-rose-500'
                                  }`}>{v.riskCategory || 'Low Risk'}</span>
                                </div>

                                <span className="px-2 py-0.5 rounded font-bold font-mono text-[9px] uppercase tracking-wider bg-slate-950 border border-slate-800 text-slate-400">
                                  {v.category}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                <p className="text-[10px] text-slate-500 font-mono leading-relaxed mt-2">
                  🔒 Enterprise Audit Note: Automated invitations are routed exclusively to selected and category-qualified active suppliers that pass anti-fraud scans.
                </p>
              </div>

              {/* Drag and Drop Attachment area Screen 5 */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                  Technical Specifications Upload
                </span>
                
                <div 
                  onClick={handleMockFileUpload}
                  className="border-2 border-dashed border-slate-800 hover:border-emerald-500/30 rounded-xl p-6 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all space-y-2"
                >
                  <UploadCloud className="w-8 h-8 mx-auto text-slate-600 group-hover:text-emerald-400" />
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Drag & drop files or click to upload</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">PDF, DOCX, XLSX scale options up to 10MB</p>
                  </div>
                </div>

                {/* Uploaded items array */}
                {tempFiles.length > 0 && (
                  <div className="space-y-1.5">
                    {tempFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-lg border border-slate-850 text-xs font-mono">
                        <span className="text-slate-300 flex items-center gap-1.5 max-w-72 truncate">
                          <File className="w-3.5 h-3.5 text-blue-400" />
                          {f.name}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span>{f.size}</span>
                          <button
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); setTempFiles(tempFiles.filter((_, idx) => idx !== i)); }}
                            className="text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* DETAILED INTERACTIVE AUDIT DETAILS MODAL OVERLAY */}
      {selectedAuditRfq && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)' }}
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-slate-900/40 p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-950 border border-slate-850 p-1 px-2.5 rounded-md">
                    {selectedAuditRfq.id}
                  </span>
                  <span className="px-2 py-0.5 rounded font-bold font-mono text-[9px] uppercase tracking-wider bg-slate-800 text-slate-300">
                    {selectedAuditRfq.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-display text-white">{selectedAuditRfq.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Enterprise Compliance Security Log</p>
              </div>
              <button 
                onClick={() => setSelectedAuditRfq(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* General Specs */}
            <div className="space-y-4">
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-855 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 font-mono block">
                  Original Requirements Memo
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedAuditRfq.description}
                </p>
              </div>

              {/* Line Items Table */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                  Line Items Manifest
                </span>
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-950/60 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-800">
                        <th className="p-3">Product Description</th>
                        <th className="p-3 text-center">Quantity</th>
                        <th className="p-3 text-right">Unit Metric</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {selectedAuditRfq.lineItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/10">
                          <td className="p-3 text-slate-200 font-semibold">{item.item}</td>
                          <td className="p-3 text-center text-emerald-400 font-extrabold font-mono">{item.qty}</td>
                          <td className="p-3 text-right text-slate-400 font-mono uppercase">{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Secure Audit Trails */}
              <div className="space-y-3">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">
                  Blockchain Compliance Ledger
                </span>
                
                <div className="space-y-2.5 font-mono text-[11px] text-slate-400">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-start gap-3">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-semibold font-sans">1. RFQ Document Initialized</p>
                      <p className="text-[10px] mt-0.5">Timestamp: {selectedAuditRfq.dateCreated} &bull; Signatory: Rahul Mehta</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">HASH REFERENCE: cb32b9a7c29be41a100aebfa8</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-start gap-3">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-semibold font-sans">2. Bidders Secure Invitations</p>
                      <p className="text-[10px] mt-0.5">Invited: {selectedAuditRfq.assignedVendors.length} Suppliers &bull; Transmit: Secure SMTP Envelope</p>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {selectedAuditRfq.assignedVendors.map(vId => {
                          const vName = vendors.find(v => v.id === vId)?.name || vId;
                          return (
                            <span key={vId} className="bg-slate-900 border border-slate-800 p-0.5 px-2 rounded text-[9px] text-slate-300">
                              {vName}
                            </span>
                          );
                        })}
                        {selectedAuditRfq.assignedVendors.length === 0 && (
                          <span className="text-amber-400">No vendors pre-assigned. Open invitation broadcast active.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-start gap-3">
                    <Clock className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-slate-200 font-semibold font-sans">3. Live Response Monitoring</p>
                      <p className="text-[10px] mt-0.5">Deadline: {selectedAuditRfq.deadline} &bull; Current Status: {selectedAuditRfq.status}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-mono">STATUS LEDGER NODE: SECURE_SYNC_OK</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Exit */}
            <div className="border-t border-slate-800 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAuditRfq(null)}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 hover:scale-[1.02] font-black py-2.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Close Audit Dialog
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
