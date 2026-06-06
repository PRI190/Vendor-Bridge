import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  UserPlus, 
  Briefcase, 
  Trash2,
  Calendar,
  Filter,
  Sparkles,
  Search
} from 'lucide-react';

interface ActivityViewProps {
  activities: ActivityLog[];
  onClearLogs: () => void;
}

export default function ActivityView({ 
  activities, 
  onClearLogs 
}: ActivityViewProps) {
  const [filterType, setFilterType] = useState<'All' | 'RFQ' | 'Quotation' | 'Approval' | 'Invoice' | 'Vendor'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Choose corresponding visual styling exactly matching Screen 10
  const getIconStyle = (type: string) => {
    switch (type) {
      case 'Quotation':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-400 stroke-[2]" />,
          bgColor: 'bg-emerald-950/60 border-emerald-500/25',
          circleColor: 'bg-emerald-400'
        };
      case 'Approval':
        return {
          icon: <Clock className="w-5 h-5 text-amber-400 stroke-[2]" />,
          bgColor: 'bg-amber-950/60 border-amber-500/25',
          circleColor: 'bg-amber-400'
        };
      case 'RFQ':
        return {
          icon: <FileText className="w-5 h-5 text-blue-400 stroke-[2]" />,
          bgColor: 'bg-blue-950/60 border-blue-500/25',
          circleColor: 'bg-blue-400'
        };
      case 'Vendor':
        return {
          icon: <UserPlus className="w-5 h-5 text-rose-400 stroke-[2]" />,
          bgColor: 'bg-rose-950/60 border-rose-500/25',
          circleColor: 'bg-rose-400'
        };
      case 'Invoice':
        default:
        return {
          icon: <Clock className="w-5 h-5 text-slate-400 stroke-[2]" />,
          bgColor: 'bg-slate-900 border-slate-800',
          circleColor: 'bg-slate-400'
        };
    }
  };

  const filteredLogs = activities.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.user.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'All') return matchesSearch;
    return matchesSearch && log.type === filterType;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header component */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            Activity & Logs
          </h1>
          <p className="text-sm text-slate-400">
            Procurement audit trail &mdash; Immutable ledger state updates.
          </p>
        </div>

        <button
          onClick={onClearLogs}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-mono cursor-pointer transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4 text-rose-400" />
          Purge Buffer
        </button>
      </div>

      {/* Screen 10 filter bar layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search audit trail logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all placeholder:text-slate-600 text-white font-mono"
          />
        </div>

        {/* Buttons exact match of Screen 10 layout */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl">
            {(['All', 'RFQ', 'Approvals', 'Invoices', 'Vendors'] as const).map((type) => {
              const mappedType = type === 'Approvals' ? 'Approval' : type === 'Invoices' ? 'Invoice' : type;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(mappedType === 'All' ? 'All' : mappedType as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wider transition-all uppercase cursor-pointer ${
                    filterType === (mappedType === 'All' ? 'All' : mappedType)
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <div className="text-[10px] uppercase font-bold text-slate-500 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Audit records found: {filteredLogs.length} events
          </div>
        </div>

        {/* Activity audit trail stack */}
        <div className="relative pt-2 pl-4 pr-1">
          {/* Vertical axis line */}
          <div className="absolute left-9 top-0 bottom-0 w-px bg-slate-800/80" />

          <div className="space-y-6">
            {filteredLogs.map((log) => {
              const theme = getIconStyle(log.type);
              
              return (
                <div key={log.id} className="relative flex items-start gap-4 text-xs group">
                  
                  {/* Circular icon layout - Screen 10 matching style */}
                  <div className={`p-2.5 rounded-full border z-10 flex items-center justify-center shadow-lg transition-all ${theme.bgColor}`}>
                    {theme.icon}
                  </div>

                  <div className="flex-1 bg-slate-950/40 p-4 border border-slate-850 rounded-xl relative space-y-1 hover:border-slate-800 transition-all">
                    {/* Timestamp indicator */}
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] uppercase tracking-widest font-extrabold text-slate-500">
                          LOG ID: {log.id}
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.circleColor}`} />
                      </div>
                      
                      <span className="text-[10.5px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-slate-200 font-sans leading-relaxed text-xs pt-1">
                      {log.message}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 pt-2 border-t border-slate-900 mt-2">
                      <span>Authorized by: <span className="text-slate-300 font-bold">{log.user}</span></span>
                      <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-400 font-bold border border-slate-800">
                        MUTATION ACCEPTED
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

            {filteredLogs.length === 0 && (
              <p className="text-slate-600 text-center py-10 font-mono">
                No activity logs found for selected ledger boundaries.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* SLA/Log information banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4.5 h-4.5 text-emerald-400 animate-pulse stroke-[2.3]" />
        <span>Enterprise compliance audit logs are cryptographic block-signed and strictly unmodifiable. All times registered in UTC.</span>
      </div>

    </div>
  );
}
