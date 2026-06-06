import React, { useState, useEffect } from 'react';
import { Quotation, RFQ, Vendor, LineItem } from '../types';
import { formatCurrency } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Sparkles, 
  Star, 
  Calendar, 
  Clock, 
  Check, 
  CheckCircle2, 
  ArrowRight,
  Calculator,
  Info,
  Cpu,
  Zap,
  TrendingDown,
  Coins,
  ShieldAlert
} from 'lucide-react';

interface QuotationsViewProps {
  rfqs: RFQ[];
  quotations: Quotation[];
  activeVendor?: Vendor;
  onSubmitQuotation: (quotation: Omit<Quotation, 'id'>) => void;
  onSelectQuotationForApproval: (quotation: Quotation) => void;
  onWithdrawQuotation?: (quotationId: string) => void;
}

export default function QuotationsView({
  rfqs,
  quotations,
  activeVendor,
  onSubmitQuotation,
  onSelectQuotationForApproval,
  onWithdrawQuotation
}: QuotationsViewProps) {
  const [activeTab, setActiveTab] = useState<'submit' | 'compare'>('compare');
  
  // Submit Quotation states for active RFQ
  const [selectedRfqId, setSelectedRfqId] = useState<string>('');
  
  // Set default RFQ state when RFQs load
  useEffect(() => {
    if (rfqs.length > 0 && !selectedRfqId) {
      // Prioritize the Laptops purchase RFQ if available
      const laptopRfq = rfqs.find(r => r.title.toLowerCase().includes('laptop'));
      setSelectedRfqId(laptopRfq ? laptopRfq.id : rfqs[0].id);
    }
  }, [rfqs, selectedRfqId]);

  // Create state pointers for price & delivery entry
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [deliveries, setDeliveries] = useState<Record<string, number>>({});
  const [taxRate, setTaxRate] = useState(18);
  const [noteTerms, setNoteTerms] = useState('Payment: standard 20 days. Full 1-year swap guarantee.');

  const selectedRfq = rfqs.find(r => r.id === selectedRfqId) || rfqs[0];

  // Sync inputs with selected RFQ items
  useEffect(() => {
    if (selectedRfq) {
      const initialPrices: Record<string, number> = {};
      const initialDeliveries: Record<string, number> = {};
      selectedRfq.lineItems.forEach(item => {
        // Sensible defaults based on item description
        const isLaptop = item.item.toLowerCase().includes('laptop');
        const isScreen = item.item.toLowerCase().includes('screen');
        const isChair = item.item.toLowerCase().includes('chair');
        
        let defaultPrice = 5000;
        if (isLaptop) defaultPrice = 52000;
        else if (isScreen) defaultPrice = 14000;
        else if (isChair) defaultPrice = 3600;

        initialPrices[item.id] = defaultPrice;
        initialDeliveries[item.id] = 7;
      });
      setPrices(initialPrices);
      setDeliveries(initialDeliveries);
    }
  }, [selectedRfqId, selectedRfq]);

  const handlePriceChange = (itemId: string, val: number) => {
    setPrices(prev => ({ ...prev, [itemId]: val }));
  };

  const handleDeliveryChange = (itemId: string, val: number) => {
    setDeliveries(prev => ({ ...prev, [itemId]: val }));
  };

  // Compute live subtotal & grand total
  const computeSubtotal = () => {
    if (!selectedRfq) return 0;
    return selectedRfq.lineItems.reduce((sum, item) => {
      const p = prices[item.id] || 4000;
      return sum + (item.qty * p);
    }, 0);
  };

  const subtotal = computeSubtotal();
  const gstAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + gstAmount;

  // Max delivery days from items
  const maxDeliveryDays = Math.max(...Object.values(deliveries).map(Number), 5);

  const handleQuotationSubmit = () => {
    if (!selectedRfq) return;
    
    // Build line items array
    const compiledItems: LineItem[] = selectedRfq.lineItems.map(item => ({
      ...item,
      unitPrice: prices[item.id] || 4000
    }));

    onSubmitQuotation({
      rfqId: selectedRfq.id,
      rfqTitle: selectedRfq.title,
      vendorId: activeVendor?.id || 'V2',
      vendorName: activeVendor?.name || 'SuperTech Laptops',
      lineItems: compiledItems,
      taxRate,
      subtotal,
      gstAmount,
      grandTotal,
      deliveryDays: maxDeliveryDays,
      notes: noteTerms,
      status: 'Submitted',
      dateSubmitted: '2025-05-22, 10:15 AM',
      rating: activeVendor?.rating || 4.8
    });

    alert('Your B2B quotation has been received. Switch to "Compare Quotes" to see it alongside others!');
    setActiveTab('compare');
  };

  // Find quotations for the selected RFQ
  const relevantQuotations = quotations.filter(q => q.rfqId === selectedRfq?.id);

  // Identify lowest price quotation
  const lowestQuotationId = relevantQuotations.reduce((prevId, current) => {
    if (!prevId) return current.id;
    const prevQ = relevantQuotations.find(q => q.id === prevId);
    return (current.grandTotal < (prevQ?.grandTotal || Infinity)) ? current.id : prevId;
  }, '');

  // AI strategy selector state
  const [aiScope, setAiScope] = useState<'balanced' | 'cost' | 'speed' | 'quality'>('balanced');
  const [isAiRecalculating, setIsAiRecalculating] = useState(false);

  // Re-trigger simulated analytical transition when priorities change
  const transitionPriority = (scope: 'balanced' | 'cost' | 'speed' | 'quality') => {
    setIsAiRecalculating(true);
    setAiScope(scope);
    setTimeout(() => {
      setIsAiRecalculating(false);
    }, 400);
  };

  // Extract key target items for AI summary card
  const lowestQuote = relevantQuotations.reduce((prev, current) => 
    (!prev || current.grandTotal < prev.grandTotal) ? current : prev
  , null as Quotation | null);

  const fastestQuote = relevantQuotations.reduce((prev, current) => 
    (!prev || current.deliveryDays < prev.deliveryDays) ? current : prev
  , null as Quotation | null);

  const highestRatedQuote = relevantQuotations.reduce((prev, current) => 
    (!prev || (current.rating || 0) > (prev.rating || 0)) ? current : prev
  , null as Quotation | null);

  // Determine recommendation based on selection
  let recommendedQuote: Quotation | null = null;
  let aiJustification = '';
  let adviceColor = 'border-emerald-500/30 bg-emerald-950/20';

  if (relevantQuotations.length > 0) {
    if (aiScope === 'cost') {
      recommendedQuote = lowestQuote;
      aiJustification = `Maximizes budget limits. Selecting ${lowestQuote?.vendorName} achieves standard procurement goals while saving significant money compared to higher-end bids. Although transit delivery is slightly longer, the final price is highly cost-effective and perfectly matches team allocation parameters.`;
      adviceColor = 'border-emerald-500/30 bg-emerald-950/25';
    } else if (aiScope === 'speed') {
      recommendedQuote = fastestQuote;
      aiJustification = `Provides immediate business efficiency. Choosing ${fastestQuote?.vendorName} gets your required items on-site in just ${fastestQuote?.deliveryDays} days. It completely eliminates waiting queues, making it the most suitable and convenienteint choice for quick deployment needs.`;
      adviceColor = 'border-blue-500/30 bg-blue-950/25';
    } else if (aiScope === 'quality') {
      recommendedQuote = highestRatedQuote;
      aiJustification = `Offers maximum service reliability. ${highestRatedQuote?.vendorName} boasts a supreme trust score of ${highestRatedQuote?.rating}/5.0 stars. They specialize in high-quality items with long-term replacement warranties, making this the safest transaction route.`;
      adviceColor = 'border-purple-500/30 bg-purple-950/25';
    } else {
      // Balanced
      // Default recommendation is SuperTech Laptops or the highest rated if it has decent delivery
      recommendedQuote = highestRatedQuote;
      aiJustification = `${highestRatedQuote?.vendorName} delivers the ideal equilibrium of good speed (delivered in ${highestRatedQuote?.deliveryDays} days), a highly reliable rating of ${highestRatedQuote?.rating}/5, and fully standard competitive pricing. We recommend selecting them to ensure a premium customer experience without excessive premiums.`;
      adviceColor = 'border-teal-500/30 bg-teal-950/20';
    }
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 font-mono bg-emerald-950/40 p-1 px-2 border border-emerald-500/20 rounded-md">
            Procurement Engine
          </span>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight mt-1.5">
            Compare Price & Delivery
          </h1>
          <p className="text-sm text-slate-400">
            Compare quotes side-by-side for laptops or chairs, review vendor ratings, and directly assign orders.
          </p>
        </div>
        
        {/* Tab switchers */}
        <div className="flex gap-2 bg-slate-900 p-1 border border-slate-800 rounded-xl w-fit self-end shadow-inner">
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compare Quotes
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'submit'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Enter New Quote
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        /* SCREEN 6: FORM SUBMISSION (Simulates a vendor entering a quote) */
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Quote inputs */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">Enter Vendor Quote</h3>
                <p className="text-xs text-slate-400">Simulate pricing submissions from other vendors.</p>
              </div>
            </div>

            {/* Select active RFQ */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                Select Laptop or Furniture Request
              </label>
              <select
                value={selectedRfqId}
                onChange={(e) => setSelectedRfqId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-855 text-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                id="rfq_selector_dropdown"
              >
                {rfqs.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.id} &bull; {r.title}
                  </option>
                ))}
              </select>

              {/* Check if already submitted */}
              {(() => {
                const existingQuote = quotations.find(q => q.rfqId === selectedRfqId && q.vendorId === (activeVendor?.id || 'V2'));
                if (existingQuote) {
                  return (
                    <div className="bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl space-y-3 mt-3">
                      <div className="flex items-start gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-white">
                            Quotation Already Submitted For This Tender
                          </p>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            Your profile has registered Quote <strong className="font-mono text-slate-200 font-bold">{existingQuote.id}</strong> on this record for <strong className="font-mono text-emerald-400">{formatCurrency(existingQuote.grandTotal)}</strong>.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (onWithdrawQuotation) {
                            onWithdrawQuotation(existingQuote.id);
                            alert(`Quotation ${existingQuote.id} has been taken back/withdrawn successfully! You can re-enter your bids below.`);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-950 text-rose-400 hover:bg-rose-900/30 border border-rose-500/25 rounded-lg text-[10px] tracking-wider uppercase font-bold transition-all cursor-pointer"
                      >
                        Take Back Submitted Quote
                      </button>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {selectedRfq ? (
              <div className="space-y-4">
                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-855">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#10b981] font-mono">
                    REQUEST DETAILS &bull; {selectedRfq.category}
                  </span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedRfq.description}
                  </p>
                </div>

                {/* Line Item Tables */}
                <div className="space-y-3">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                    Financial Bid Line-Items Price Entry
                  </span>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-sans">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                          <th className="py-2.5">Item Description</th>
                          <th className="py-2.5 text-center">Quantity Required</th>
                          <th className="py-2.5">Bid Price / Unit</th>
                          <th className="py-2.5">Lead Time (Days)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {selectedRfq.lineItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/40">
                            <td className="py-3 font-medium text-slate-200">{item.item}</td>
                            <td className="py-3 text-center font-mono text-slate-400">{item.qty} {item.unit}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800 w-32">
                                <span className="text-slate-500 font-mono text-[11px]">₹</span>
                                <input
                                  type="number"
                                  value={prices[item.id] || ''}
                                  onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                                  className="bg-transparent focus:outline-none w-full text-slate-200 font-mono text-[11px]"
                                  placeholder="0"
                                />
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-800 w-24">
                                <input
                                  type="number"
                                  value={deliveries[item.id] || ''}
                                  onChange={(e) => handleDeliveryChange(item.id, Number(e.target.value))}
                                  className="bg-transparent focus:outline-none w-full text-slate-200 font-mono text-[11px] text-center"
                                  placeholder="7"
                                />
                                <span className="text-slate-500 font-mono text-[10px]">days</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                      Vendor GST % Rate
                    </label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                    >
                      <option value={18}>18% GST (Standard)</option>
                      <option value={12}>12% GST (Reduced)</option>
                      <option value={5}>5% GST (Essential)</option>
                      <option value={0}>0% GST (Exempt)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono block">
                      Vendor Memo / Note terms
                    </label>
                    <input
                      type="text"
                      value={noteTerms}
                      onChange={(e) => setNoteTerms(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                      placeholder="hydraulic warrantee net 30"
                    />
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-slate-500 text-center py-6 font-mono">Loading dynamic RFQ parameters...</p>
            )}

          </div>

          {/* Right Summary Block */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-display font-bold text-white text-sm">Totals & Subtotals</h3>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal Amount:</span>
                  <span className="text-slate-200 font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST Taxes ({taxRate}%):</span>
                  <span className="text-slate-200">{formatCurrency(gstAmount)}</span>
                </div>
                <div className="border-t border-slate-800 my-2 pt-2 flex justify-between text-base font-bold">
                  <span className="text-slate-400 font-normal">Grand Total:</span>
                  <span className="text-emerald-400">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center gap-2 text-[10px] font-mono text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Max delivery schedule: <strong className="text-slate-200">{maxDeliveryDays} days</strong></span>
              </div>

              <button
                onClick={handleQuotationSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                Submit Bidding Quote
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Acting Vendor Simulator</h4>
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                  {activeVendor?.name.slice(0, 2) || "SL"}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{activeVendor?.name || "SuperTech Laptops"}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rating: {activeVendor?.rating || 4.8}/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* SCREEN 7: COMPARATIVE QUOTATIONS GRID (Procurement view) */
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-[9px] uppercase font-extrabold tracking-wider font-mono text-slate-500">
                  B2B BIDDING MATRIX
                </span>
                <h3 className="text-base font-bold font-display text-white mt-0.5">Competitive Quotation Analysis Matrix</h3>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 font-mono">Switch Category:</label>
                <select
                  value={selectedRfqId}
                  onChange={(e) => setSelectedRfqId(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono"
                >
                  {rfqs.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {relevantQuotations.length > 0 ? (
            <div className="space-y-6">

              {/* INTEGRATIVE DYNAMIC AI SECTION AT THE TOP: More suitable and convieneint advisor */}
              <div className="bg-slate-900 border-2 border-indigo-100 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                {/* Visual Ambient Aura */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <Sparkles className="w-5 h-5 text-indigo-605 animate-pulse" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center gap-2">
                          Vendor Advisor
                          <span className="text-[10px] uppercase font-bold tracking-widest font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                            Smart Engine
                          </span>
                        </span>
                        <p className="text-sm font-semibold text-indigo-300">
                          AI smart suggestion for quotation approval.
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans font-medium">
                      Our intelligence analyzed the 3 quotations for <code className="text-emerald-300 font-mono bg-emerald-950 p-1 px-1.5 rounded font-bold">{selectedRfq.title}</code>. 
                      Toggle target strategy goals to calculate convenience priorities below:
                    </p>

                    {/* Strategy select pills */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => transitionPriority('balanced')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          aiScope === 'balanced'
                            ? 'bg-teal-950/60 border-teal-500/40 text-teal-300 shadow shadow-teal-500/5'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ⚖️ Balanced Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => transitionPriority('cost')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          aiScope === 'cost'
                            ? 'bg-emerald-900/40 border-emerald-500/40 text-emerald-300 shadow shadow-emerald-500/5'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        💰 Cheaper Cost Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => transitionPriority('speed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          aiScope === 'speed'
                            ? 'bg-blue-900/40 border-blue-500/40 text-blue-300 shadow shadow-blue-500/5'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ⚡ Faster Delivery Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => transitionPriority('quality')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
                          aiScope === 'quality'
                            ? 'bg-purple-900/40 border-purple-500/40 text-purple-300 shadow shadow-purple-500/5'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        ⭐ Partner Trust Focus
                      </button>
                    </div>

                    {/* Transition analysis text block */}
                    <AnimatePresence mode="wait">
                      {isAiRecalculating ? (
                        <motion.div 
                          key="thinking"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-4 flex items-center gap-2 font-mono text-xs text-purple-400"
                        >
                          <Cpu className="w-4 h-4 animate-spin text-purple-500" />
                          <span>AI analyzing price-to-lead-time coordinates...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key={aiScope}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          transition={{ duration: 0.15 }}
                          className={`p-4 rounded-xl border ${adviceColor} space-y-2`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase font-mono">
                            {aiScope === 'cost' && <Coins className="w-4 h-4 text-emerald-400" />}
                            {aiScope === 'speed' && <Zap className="w-4 h-4 text-blue-400" />}
                            {aiScope === 'quality' && <Star className="w-4 h-4 text-purple-400" />}
                            {aiScope === 'balanced' && <Cpu className="w-4 h-4 text-teal-400" />}
                            Recommended: {recommendedQuote?.vendorName} (Quote {recommendedQuote?.id})
                          </div>
                          
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">
                            {aiJustification}
                          </p>

                          {/* Quick Stats Summary */}
                          <div className="flex flex-wrap justify-between pt-1 border-t border-slate-800/10 text-[10px] text-slate-400 font-mono">
                            <span>TOTAL CAPEX: <strong className="text-slate-105">{recommendedQuote ? formatCurrency(recommendedQuote.grandTotal) : ''}</strong></span>
                            <span>DELIVERY TIME: <strong className="text-slate-105">{recommendedQuote?.deliveryDays} Days</strong></span>
                            <span>VENDOR TRUST: <strong className="text-slate-105">{recommendedQuote?.rating?.toFixed(1) || '4.0'}/5</strong></span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Direct AI Assign Action */}
                  <div className="w-full md:w-auto self-stretch md:self-center flex items-center justify-center">
                    {recommendedQuote && (
                      <button
                        type="button"
                        onClick={() => onSelectQuotationForApproval(recommendedQuote as Quotation)}
                        className="w-full md:w-48 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold p-4 lg:py-4.5 rounded-2xl text-xs uppercase tracking-widest shadow-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:shadow-indigo-500/15"
                      >
                        <Sparkles className="w-4.5 h-4.5 text-purple-200" />
                        <span>Directly Assign</span>
                        <span className="text-[9px] lowercase font-normal opacity-70 tracking-normal font-mono">
                          via AI Rec
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Grid Side-by-side exact Match of Screen 7 diagram */}
              <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900 shadow-xl">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                      <th className="p-5 font-bold">Criteria</th>
                      
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        return (
                          <th 
                            key={q.id} 
                            className={`p-5 text-center font-bold font-display ${
                              isLowest 
                                ? 'bg-emerald-950/40 text-emerald-300 border-x border-emerald-500/30' 
                                : 'text-slate-300'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-sm font-extrabold">{q.vendorName}</span>
                              {isLowest && (
                                <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 bg-emerald-600 text-slate-950 rounded-full font-mono mt-1">
                                  Lowest price
                                </span>
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-mono text-xs text-slate-300">
                    
                    {/* Dynamic Line-by-Line Item Prices Comparison */}
                    {selectedRfq.lineItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                        <td className="p-5 font-semibold text-slate-400 font-sans">
                          {item.item} unit price
                        </td>
                        {relevantQuotations.map((q) => {
                          const isLowest = q.id === lowestQuotationId;
                          const matchedLineItem = q.lineItems.find(li => li.id === item.id || li.item === item.item);
                          const unitPrice = matchedLineItem?.unitPrice || 0;
                          return (
                            <td 
                              key={q.id} 
                              className={`p-5 text-center text-slate-200 ${
                                isLowest ? 'bg-emerald-950/10 border-x border-emerald-500/10 font-medium' : ''
                              }`}
                            >
                              {unitPrice ? formatCurrency(unitPrice) : 'Not Bid'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {/* Grand Total Row */}
                    <tr className="bg-slate-950/30 font-bold border-y border-slate-800">
                      <td className="p-5 text-sm text-slate-200 font-sans font-extrabold">Grand Total (Inclusive)</td>
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        return (
                          <td 
                            key={q.id} 
                            className={`p-5 text-center text-sm font-extrabold ${
                              isLowest ? 'bg-emerald-950/30 text-emerald-400 border-x border-emerald-500/25 text-base' : 'text-slate-200'
                            }`}
                          >
                            {formatCurrency(q.grandTotal)}
                          </td>
                        );
                      })}
                    </tr>

                    {/* GST Rates */}
                    <tr className="hover:bg-slate-800/10 text-slate-400">
                      <td className="p-5 font-semibold font-sans">Tax Rate %</td>
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        return (
                          <td 
                            key={q.id} 
                            className={`p-5 text-center ${
                              isLowest ? 'bg-emerald-950/10 border-x border-emerald-500/10' : ''
                            }`}
                          >
                            {q.taxRate}%
                          </td>
                        );
                      })}
                    </tr>

                    {/* Delivery lead days */}
                    <tr className="hover:bg-slate-800/10">
                      <td className="p-5 font-semibold text-slate-400 font-sans">Delivery Lead Days</td>
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        // Find the quote with the fastest speed
                        const isFastest = q.id === fastestQuote?.id;
                        return (
                          <td 
                            key={q.id} 
                            className={`p-5 text-center ${
                              isLowest ? 'bg-emerald-950/10 border-x border-emerald-500/10' : ''
                            }`}
                          >
                            <span className={`inline-flex items-center gap-1.5 ${
                              isFastest ? 'text-blue-400 font-extrabold' : 'text-slate-200 font-bold'
                            }`}>
                              {q.deliveryDays} Days
                              {isFastest && (
                                <span className="text-[8px] bg-blue-950/60 border border-blue-500/20 text-blue-400 p-0.5 px-1.5 rounded uppercase font-mono tracking-widest font-extrabold">
                                  Fastest
                                </span>
                              )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Vendor Ratings */}
                    <tr className="hover:bg-slate-800/10">
                      <td className="p-5 font-semibold text-slate-400 font-sans">Supplier Trust Score</td>
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        const isBestRated = q.id === highestRatedQuote?.id;
                        return (
                          <td 
                            key={q.id} 
                            className={`p-5 text-center ${
                              isLowest ? 'bg-emerald-950/10 border-x border-emerald-500/10' : ''
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1.5 font-bold">
                              <Star className={`w-3.5 h-3.5 ${isBestRated ? 'text-amber-400 fill-amber-400' : 'text-slate-500 fill-slate-500'}`} />
                              <span className={isBestRated ? 'text-white' : 'text-slate-300'}>
                                {q.rating?.toFixed(1) || '4.0'}/5
                              </span>
                              {isBestRated && (
                                <span className="text-[8px] bg-amber-955 text-amber-400 border border-amber-500/20 p-0.5 px-1 rounded uppercase tracking-widest">
                                  Top rated
                                </span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* Additional Notes terms */}
                    <tr className="hover:bg-slate-800/10">
                      <td className="p-5 font-semibold text-slate-400 font-sans">Payment / Warranty Notes</td>
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        return (
                          <td 
                            key={q.id} 
                            className={`p-5 text-center font-sans text-xs max-w-xs leading-relaxed text-slate-400 ${
                              isLowest ? 'bg-emerald-950/10 text-emerald-300 border-x border-emerald-500/10' : ''
                            }`}
                          >
                            {q.notes}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Security assign action buttons */}
                    <tr className="bg-slate-950/40">
                      <td className="p-5 font-black text-slate-500 uppercase tracking-widest text-[9px] font-mono">
                        Direct Assignment
                      </td>
                      {relevantQuotations.map((q) => {
                        const isLowest = q.id === lowestQuotationId;
                        return (
                          <td 
                            key={q.id} 
                            className={`p-5 text-center ${
                              isLowest ? 'bg-emerald-950/30 border-x border-emerald-500/20' : ''
                            }`}
                          >
                            <button
                              onClick={() => {
                                onSelectQuotationForApproval(q);
                              }}
                              className={`w-full py-3 px-4 rounded-xl text-xs font-bold tracking-wider font-mono transition-all uppercase cursor-pointer ${
                                isLowest
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/10'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              }`}
                            >
                              {isLowest ? 'Accept Deal & PO' : 'Select'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>

                  </tbody>
                </table>
              </div>

              {/* Legend note */}
              <p className="text-xs font-mono text-left text-emerald-400 flex items-center gap-2 bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/10 w-fit">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                Green columns indicate lowest budget metrics. Selecting any vendor instantly creates an L2 purchase order approval form.
              </p>
            </div>
          ) : (
            <div className="text-center p-12 bg-slate-900 border border-slate-850 rounded-2xl">
              <p className="text-sm font-mono text-slate-500">
                Please submit a quotation on the "Enter New Quote" tab first to activate comparison tables.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
