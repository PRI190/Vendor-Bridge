import React, { useState } from 'react';
import { ApprovalWorkflow } from '../types';
import { formatCurrency } from '../utils';
import { 
  CheckCircle2, 
  Clock, 
  XSquare, 
  ChevronRight, 
  FileCheck, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  Calendar
} from 'lucide-react';

interface ApprovalsViewProps {
  workflows: ApprovalWorkflow[];
  onProcessApproval: (workflowId: string, action: 'Approve' | 'Reject', remark: string) => void;
  onRevertApproval?: (workflowId: string) => void;
}

export default function ApprovalsView({ 
  workflows, 
  onProcessApproval,
  onRevertApproval
}: ApprovalsViewProps) {
  const [selectedId, setSelectedId] = useState<string>(workflows[0]?.id || '');
  const [commentText, setCommentText] = useState('');

  const activeWorkflow = workflows.find(w => w.id === selectedId) || workflows[0];

  const handleAction = (action: 'Approve' | 'Reject') => {
    if (!activeWorkflow) return;
    
    onProcessApproval(activeWorkflow.id, action, commentText || 'Compliance requirements cleared.');
    setCommentText('');
    alert(`Workflow action updated: ${action}. State transition committed to central ledger.`);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-display font-extrabold text-white tracking-tight">
          Enterprise Sign-off Workflows
        </h1>
        <p className="text-sm text-slate-400">
          Enforce internal fiscal authority boundaries, write permanent audit remarks, and generate purchase orders.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Workflows selection rail (3 columns) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono block">
            Pending Clearances
          </span>
          
          <div className="space-y-2">
            {workflows.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedId(w.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedId === w.id
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-white'
                    : 'bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800'
                }`}
              >
                <div className="text-[9px] font-mono bg-slate-900 border border-slate-800 p-1 rounded w-fit text-slate-400 mb-1.5 uppercase font-bold">
                  {w.id}
                </div>
                <div className="text-xs font-bold leading-snug tracking-tight text-slate-200 line-clamp-1">{w.rfqTitle}</div>
                <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono">
                  <span className="text-slate-400 truncate">{w.vendorName}</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(w.grandTotal)}</span>
                </div>
              </button>
            ))}
            {workflows.length === 0 && (
              <p className="text-slate-600 text-center py-4 font-mono text-[11px]">
                No active workflows pending L1/L2.
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Core interactive Board - SCREEN 8 (9 columns) */}
        <div className="lg:col-span-9 space-y-6">
          {activeWorkflow ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-8">
              
              {/* Header Title exact match Screen 8 */}
              <div className="border-b border-slate-850 pb-4 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-950 border border-slate-850 rounded text-slate-400 font-bold font-mono text-[10px] uppercase">
                    Workflow Root Node
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                    activeWorkflow.status === 'Approved'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                      : activeWorkflow.status === 'Rejected'
                      ? 'bg-rose-950 text-rose-400 border border-rose-500/20'
                      : 'bg-amber-950 text-amber-400 border border-amber-500/20'
                  }`}>
                    {activeWorkflow.status} Workflow Unit
                  </span>
                </div>
                
                <h2 className="text-lg font-bold font-display text-white mt-1.5">
                  Approval Workflow: {activeWorkflow.rfqTitle}
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                  <span>Vendor: <span className="text-white font-semibold">{activeWorkflow.vendorName}</span></span>
                  <span>&bull;</span>
                  <span>Amount: <span className="text-emerald-400 font-extrabold">{formatCurrency(activeWorkflow.grandTotal)}</span></span>
                </div>
              </div>

              {/* Top Progress Step Indicator from Screen 8 */}
              <div className="flex items-center justify-between max-w-2xl mx-auto bg-slate-950/60 p-4 rounded-xl border border-slate-850 text-xs font-mono">
                {activeWorkflow.steps.map((step, index) => {
                  const isCompleted = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  const isRejected = step.status === 'rejected';

                  return (
                    <React.Fragment key={index}>
                      <div className="flex flex-col items-center space-y-1.5 relative">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ring-4 ring-slate-900 transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-slate-950 font-extrabold'
                            : isRejected
                            ? 'bg-rose-600 text-slate-150 font-extrabold'
                            : isCurrent
                            ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-500/20'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {index + 1}
                        </div>
                        {/* Highlight current L2 or L1 tag precisely */}
                        <div className={`text-[10px] font-bold font-sans uppercase tracking-wider ${
                          isCurrent ? 'text-blue-400 font-bold' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                        }`}>
                          {step.label}
                        </div>
                      </div>
                      
                      {index < activeWorkflow.steps.length - 1 && (
                        <div className={`flex-1 h-0.5 max-w-16 ${
                          index < activeWorkflow.currentStepIndex ? 'bg-emerald-500' : 'bg-slate-800'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Bottom 2 columns as shown in Screen 8 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (Approval chain and comments) - 7 columns */}
                <div className="md:col-span-7 space-y-6">
                  
                  {/* Approval Chain Timeline Layout */}
                  <div className="space-y-4">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block">
                      APPROVAL CHAIN REGISTRY
                    </span>

                    <div className="space-y-4 relative pl-4 border-l border-slate-800">
                      
                      {/* Approved items timeline */}
                      {activeWorkflow.steps.filter(s => s.status === 'completed').map((step, idx) => (
                        <div key={idx} className="relative space-y-1">
                          <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-950 border-2 border-emerald-500 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          </span>
                          <p className="text-xs font-semibold text-white leading-none">
                            {step.user || 'Authorized Officer'}
                          </p>
                          <p className="text-[10px] text-slate-400 leading-snug font-mono">
                            Approved on {step.date || 'May 20, 10:32 AM'}
                          </p>
                          {step.remark && (
                            <p className="text-[11px] text-slate-500 italic font-mono pt-0.5">
                              &ldquo;{step.remark}&rdquo;
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Pending items timeline */}
                      {activeWorkflow.steps.filter(s => s.status === 'current').map((step, idx) => (
                        <div key={idx} className="relative space-y-1">
                          <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-blue-950 border-2 border-blue-500 flex items-center justify-center animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                          </span>
                          <p className="text-xs font-semibold text-blue-400 leading-none flex items-center gap-1.5">
                            {step.user || 'Authorized Approver'}
                            <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-blue-950 text-blue-400 rounded border border-blue-500/25">Awaiting</span>
                          </p>
                          <p className="text-[10px] text-slate-400 leading-snug font-mono">
                            Assigned on May 21
                          </p>
                        </div>
                      ))}

                    </div>
                  </div>

                  {/* Approval remarks textarea input from Screen 8 */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                      Approval Remarks
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Add your comments or conditions...."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-slate-200 transition-all font-mono"
                    />
                  </div>

                </div>

                {/* Right Column (Quotation summary card other buttons) - 4 columns */}
                <div className="md:col-span-5 space-y-6">
                  
                  {/* QUOTATIONS SUMMARY card matching Screen 8 exact label */}
                  <div className="bg-slate-955 border border-slate-800 p-5 rounded-xl space-y-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block font-mono">
                      QUOTATIONS SUMMARY
                    </span>

                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-mono">Vendor Name</span>
                        <div className="text-white font-bold flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-4 h-4 text-emerald-400" />
                          {activeWorkflow.vendorName}
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-mono">Total Net Cost</span>
                        <div className="text-emerald-400 font-mono font-extrabold text-base mt-0.5">
                          {formatCurrency(activeWorkflow.grandTotal)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-850">
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-mono block">Delivery</span>
                          <span className="text-slate-300 font-semibold font-mono text-xs">{activeWorkflow.deliveryDays} Days span</span>
                        </div>
                        <div>
                          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider font-mono block">Rating</span>
                          <span className="text-slate-300 font-semibold font-mono text-xs hover:text-amber-400 flex items-center gap-0.5">
                            {activeWorkflow.rating} / 5
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Actions buttons lower right */}
                  <div className="space-y-2">
                    {activeWorkflow.status === 'Approved' || activeWorkflow.status === 'Rejected' ? (
                      <div className="bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-xl space-y-3">
                        <p className="text-xs text-slate-400 leading-snug">
                          Decision finalized as <strong className="text-white uppercase font-mono">{activeWorkflow.status}</strong>. If done by mistake, you can take back the action.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (onRevertApproval) {
                              onRevertApproval(activeWorkflow.id);
                            }
                          }}
                          className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-black py-2.5 px-3 rounded-lg text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
                        >
                          Take Back Decision (Undo)
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAction('Approve')}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer shadow-lg hover:shadow-emerald-500/10 transition-all font-bold"
                        >
                          <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
                          Approve Workflow
                        </button>
                        <button
                          onClick={() => handleAction('Reject')}
                          className="w-full bg-slate-955 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/30 text-rose-400 font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <XSquare className="w-4.5 h-4.5" />
                          Reject Application
                        </button>
                      </>
                    )}
                  </div>

                </div>

              </div>

            </div>
          ) : (
            <div className="text-center p-12 bg-slate-900 border border-slate-850 rounded-2xl">
              <p className="text-sm font-mono text-slate-500">
                All procurement authorizations are currently signed, locked and synchronized.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
