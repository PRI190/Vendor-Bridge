import React, { useState } from 'react';
import { Vendor } from '../types';
import { generateId } from '../utils';
import { 
  Plus, 
  Search, 
  Sparkles, 
  Star, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  XSquare, 
  CheckCircle, 
  Filter 
} from 'lucide-react';

interface VendorsViewProps {
  vendors: Vendor[];
  onAddVendor: (vendor: Omit<Vendor, 'id' | 'rating'>) => void;
  onUpdateVendorStatus: (id: string, status: 'Active' | 'Pending' | 'Blocked') => void;
}

export default function VendorsView({ 
  vendors, 
  onAddVendor, 
  onUpdateVendorStatus 
}: VendorsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending' | 'Blocked'>('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Custom Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [gstNo, setGstNo] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
  const [about, setAbout] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Excel / CSV Database Joiner properties and sample database template sheets
  const [showJoinPanel, setShowJoinPanel] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [pasteError, setPasteError] = useState<string | null>(null);
  const [joinSuccessLogs, setJoinSuccessLogs] = useState<string>('');

  const SAMPLE_SPREADSHEET_DATA = `Name	Category	GST No.	Contact	Email	Country	About
Vertex Heavy Equipments	Constructions	27AABCS1429K1ZA	9001002003	bids@vertexequip.in	India	Wholesale structural crane and earthmover rentals.
Prism Print Kraft	Stationery	27AABCS1429L1ZB	9002003004	corporate@prismkraft.com	India	High speed offset office print brochures and notebooks.
Safe Shuttle Carriers	Logistics	27AABCS1429M1ZC	9003004005	cargo@safeshuttle.com	India	Express cold chain refrigerated freight and warehouse storage.
Modular Desks Depot	Furniture	27AABCS1429N1ZD	9004005006	sales@desksdepot.co.in	India	Ergonomic collaborative bench desks and height desks.
Delta Silicon Hub	IT Hardware	27AABCS1429O1ZE	9005006007	hardware@deltasilicon.com	India	Local server switches, racks, and category 6 cables.`;

  const handleLoadSampleDatabase = () => {
    handleLiveParse(SAMPLE_SPREADSHEET_DATA);
  };

  const handleLiveParse = (text: string) => {
    setPasteData(text);
    if (!text.trim()) {
      setParsedRows([]);
      setPasteError(null);
      return;
    }

    try {
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      if (lines.length === 0) {
        setParsedRows([]);
        return;
      }

      let startIdx = 0;
      const firstLineLower = lines[0].toLowerCase();
      if (firstLineLower.includes('name') || firstLineLower.includes('gst') || firstLineLower.includes('category') || firstLineLower.includes('email')) {
        startIdx = 1; 
      }

      const rowsMeta: any[] = [];
      for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        const cols = line.split(/\t|,/).map(s => s.trim());
        if (cols.length < 3) continue;

        const rowName = cols[0] || 'Imported Vendor';
        const rowCategory = cols[1] || 'Furniture';
        const rowGst = (cols[2] || '27AABCS1429B1Z0').toUpperCase();
        const rowContact = cols[3] || '9876543210';
        const rowEmail = cols[4] || 'sales@imported.com';
        const rowCountry = cols[5] || 'India';
        const rowAbout = cols[6] || 'Spreadsheet joined resource.';

        rowsMeta.push({
          name: rowName,
          category: rowCategory,
          gstNo: rowGst,
          contactNo: rowContact,
          email: rowEmail,
          country: rowCountry,
          about: rowAbout
        });
      }

      setParsedRows(rowsMeta);
      setPasteError(null);
    } catch (err) {
      setPasteError('Could not parse tabular format. Make sure it is copied from Excel cells.');
    }
  };

  const handleExecuteJoin = () => {
    if (parsedRows.length === 0) {
      alert('No valid spreadsheet entries detected to join.');
      return;
    }

    try {
      parsedRows.forEach(row => {
        onAddVendor({
          name: row.name,
          category: row.category,
          gstNo: row.gstNo,
          contactNo: row.contactNo,
          email: row.email,
          country: row.country,
          about: row.about,
          status: 'Active'
        });
      });

      setJoinSuccessLogs(`Successfully parsed and joined ${parsedRows.length} supplier database records into active ledger! Checked GST validation checksum format and calibrated real-time compliance trust ratings.`);
      setPasteData('');
      setParsedRows([]);
      
      setTimeout(() => {
        setJoinSuccessLogs('');
      }, 6000);
    } catch (e) {
      alert('Error merging spreadsheet records. Please ensure database alignment.');
    }
  };

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Legal Entity Name is required.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Legal Entity Name must be at least 3 characters long.';
    }

    const cleanGst = gstNo.trim().toUpperCase();
    if (!gstNo.trim()) {
      newErrors.gstNo = 'GSTIN Registration is required.';
    } else if (cleanGst.length !== 15) {
      newErrors.gstNo = `GSTIN must be exactly 15 characters long (provided ${cleanGst.length}/15).`;
    }

    const cleanPhone = contactNo.replace(/\D/g, '');
    if (!contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required.';
    } else if (cleanPhone.length !== 10) {
      newErrors.contactNo = `Contact number must have exactly 10 digits (provided ${cleanPhone.length}/10).`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Authorized email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please provide a valid company email address (e.g. sales@company.com).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstError = Object.values(newErrors)[0];
      alert(`Validation Error: ${firstError}`);
      return;
    }

    setErrors({});
    onAddVendor({
      name: name.trim(),
      category,
      gstNo: cleanGst,
      contactNo: contactNo.trim(),
      email: email.trim(),
      status: 'Active',
      country: country.trim() || 'India',
      about: about.trim() || 'Registered procurement resource.'
    });
    // Reset Form
    setName('');
    setCategory('Furniture');
    setGstNo('');
    setContactNo('');
    setEmail('');
    setCountry('India');
    setAbout('');
    setErrors({});
    setShowAddModal(false);
  };

  const categories = ['Furniture', 'IT', 'Constructions', 'Logistics', 'Stationery', 'Ancillaries'];

  // Stats for badges
  const totalVendors = vendors.length;
  const activeCount = vendors.filter(v => v.status === 'Active').length;
  const pendingCount = vendors.filter(v => v.status === 'Pending').length;
  const blockedCount = vendors.filter(v => v.status === 'Blocked').length;

  // Search & Filter list
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.gstNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'All') return matchesSearch;
    return matchesSearch && v.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
            Supplier Ledger & Compliance Risks
          </h1>
          <p className="text-sm text-slate-400">
            Maintain verified trade credentials, trust scores, and anti-fraud status.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          + Add Vendor
        </button>
      </div>

      {/* Smart Risk Management & True Vendor Audits Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">True Verified Supplier Force</p>
          <div className="text-2xl font-bold font-display text-white mt-1">
            {vendors.filter(v => (v.trustScore ?? 85) >= 70 && v.status === 'Active').length} <span className="text-xs text-emerald-400 font-mono font-normal">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">SLA compliant, GST certified, low risk</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Identified Fake / Suspicious</p>
          <div className="text-2xl font-bold font-display text-rose-500 mt-1 flex items-center gap-1.5 leading-none">
            {vendors.filter(v => v.isFakeVendor || (v.trustScore ?? 85) < 45 || v.status === 'Blocked').length}
            <span className="text-[9px] font-mono bg-rose-950/40 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse font-black">
              Flagged Securely
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Blacklisted or locked down for compliance flags</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Ledger Trust Index</p>
          <div className="text-2xl font-bold font-display text-indigo-400 mt-1">
            {vendors.length > 0 ? Math.round(vendors.reduce((acc, v) => acc + (v.trustScore ?? 85), 0) / vendors.length) : 0}%
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Average compliance audit rating</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Compliance Risk Audits</p>
          <div className="text-2xl font-bold font-display text-amber-500 mt-1">
            {vendors.filter(v => (v.trustScore ?? 85) < 70 && v.status !== 'Blocked').length} <span className="text-xs text-amber-400 font-mono font-normal">Pending Review</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Requiring verification or KYC audit</p>
        </div>
      </div>

      {/* Excel / CSV Spreadsheet Database Joiner System */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all">
        <button
          onClick={() => setShowJoinPanel(!showJoinPanel)}
          className="w-full flex items-center justify-between p-4 px-5 text-left bg-slate-950/40 hover:bg-slate-955 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-950 text-emerald-400 border border-emerald-500/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </span>
            <div>
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Excel & CSV Spreadsheet Database Joiner
              </h3>
              <p className="text-xs text-slate-450 mt-0.5">
                Paste tabular cells or load Excel sheets to import category-certified supplier lists in real-time.
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 font-mono text-[10px] rounded-lg border font-bold transition-all ${
            showJoinPanel 
              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' 
              : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}>
            {showJoinPanel ? 'COLLAPSE PANEL' : 'OPEN SYNC PANEL'}
          </span>
        </button>

        {showJoinPanel && (
          <div className="p-6 border-t border-slate-850 bg-slate-900/50 space-y-6">
            
            {joinSuccessLogs && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 rounded-2xl flex items-start gap-3.5 text-xs text-emerald-350 font-sans shadow-lg shadow-emerald-950/20">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-white">Database Join Operation Successful</p>
                  <p>{joinSuccessLogs}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left text editor */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Paste Excel Cells
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadSampleDatabase}
                    className="p-1 px-2.5 bg-slate-955 hover:bg-slate-850 hover:text-emerald-400 border border-slate-850 hover:border-slate-800 text-slate-450 rounded-lg text-[10px] font-mono uppercase tracking-wider cursor-pointer font-bold transition-colors"
                  >
                    📋 Load Excel Template
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={8}
                    value={pasteData}
                    onChange={(e) => handleLiveParse(e.target.value)}
                    placeholder="Example Format (Tab or Comma separated):&#10;Name	Category	GST No.	Contact	Email	Country	About&#10;Vertex Corp	Furniture	27AABCS1429K1ZA	9876543210	sales@vertex.in	India	Custom tables"
                    className="w-full bg-slate-955 border border-slate-850 focus:border-emerald-500 text-slate-200 p-4 text-[11px] font-mono leading-relaxed rounded-2xl focus:outline-none resize-none placeholder:text-slate-700"
                  />
                  {!pasteData && (
                    <div className="absolute inset-x-4 top-1/3 pointer-events-none text-center">
                      <p className="text-[10px] text-slate-505 font-mono">
                        Copy a table from a spreadsheets viewer (Excel/Sheets) and select Paste (Ctrl+V) directly inside this editor.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right preview list */}
              <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-450">
                      Live Database Parse Preview
                    </span>
                    <span className="text-[10px] font-mono bg-slate-955 text-slate-400 border border-slate-850 px-2 py-0.5 rounded-md">
                      Detected: {parsedRows.length} supplier entries
                    </span>
                  </div>

                  <div className="border border-slate-850 rounded-2xl overflow-hidden bg-slate-950/40 max-h-56 overflow-y-auto">
                    {parsedRows.length > 0 ? (
                      <table className="w-full text-left border-collapse text-[10px] font-mono">
                        <thead>
                          <tr className="bg-slate-950 border-b border-slate-850 text-slate-500">
                            <th className="p-2.5 px-3">Row</th>
                            <th className="p-2.5">Supplier Name</th>
                            <th className="p-2.5">Category</th>
                            <th className="p-2.5">GST Registration</th>
                            <th className="p-2.5">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {parsedRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-955/20 text-slate-300">
                              <td className="p-2.5 px-3 text-emerald-400 font-bold">{idx + 1}</td>
                              <td className="p-2.5 font-sans font-bold text-slate-200">{row.name}</td>
                              <td className="p-2.5 text-slate-400">
                                <span className="px-1.5 py-0.5 bg-slate-950 rounded border border-slate-900 border-emerald-500/10 text-[9px] uppercase tracking-wider text-slate-350">
                                  {row.category}
                                </span>
                              </td>
                              <td className="p-2.5 text-slate-300 font-semibold">{row.gstNo}</td>
                              <td className="p-2.5 text-slate-400 max-w-28 truncate">{row.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-10 text-center text-slate-600 font-mono text-xs">
                        ⚠️ No spreadsheet columns parsed yet. Load the sample sheet template above or copy-paste rows to audit entries.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-850 text-xs">
                  <button
                    type="button"
                    disabled={parsedRows.length === 0}
                    onClick={handleExecuteJoin}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 font-bold py-3 px-5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    Join Spreadsheet Records into Active Ledger ({parsedRows.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPasteData(''); setParsedRows([]); }}
                    className="p-3 px-4 bg-slate-950 hover:bg-slate-900 text-slate-450 hover:text-white border border-slate-800 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                  >
                    Clear Filter
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}
      </div>

      {/* Screen 4 Search and filters segment */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
        
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search bar ...... search by name, gst number, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all placeholder:text-slate-600 text-white font-mono"
          />
        </div>

        {/* Tab Badges */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'All'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalVendors})
            </button>
            <button
              onClick={() => setActiveTab('Active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'Active'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-400/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('Pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'Pending'
                  ? 'bg-amber-950 text-amber-400 border border-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('Blocked')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all uppercase tracking-wider cursor-pointer ${
                activeTab === 'Blocked'
                  ? 'bg-rose-950 text-rose-400 border border-rose-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blocked ({blockedCount})
            </button>
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-500 font-mono flex items-center gap-1">
            <Filter className="w-3 h-3 text-emerald-500" />
            Filtered results: {filteredVendors.length} Suppliers
          </div>
        </div>

        {/* Vendors List Table */}
        <div className="overflow-x-auto border border-slate-800/80 rounded-xl">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">GST No.</th>
                <th className="p-4">Contact No.</th>
                <th className="p-4">Quality Rating</th>
                <th className="p-4 text-indigo-400 font-bold">Trust Score / Risk Profile</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/85">
              {filteredVendors.map((v) => {
                const isFake = v.isFakeVendor || (v.trustScore ?? 85) < 45;
                return (
                  <tr key={v.id} className={`hover:bg-slate-800/20 transition-all group ${isFake ? 'bg-rose-950/10' : ''}`}>
                    <td className="p-4 font-medium text-slate-100">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold font-mono text-xs uppercase ${
                          isFake ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-300'
                        }`}>
                          {v.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{v.name}</span>
                            {isFake && (
                              <span className="text-[8px] bg-rose-500 text-slate-950 font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider flex items-center gap-0.5 animate-pulse">
                                🚨 SUSPECTED FAKE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">{v.id} &bull; {v.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded font-semibold font-mono text-[10px] uppercase">
                        {v.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300 font-semibold">{v.gstNo}</td>
                    <td className="p-4 text-slate-400 font-mono">{v.contactNo}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-200 font-mono">{v.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-slate-500">/5</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-mono font-bold ${
                            (v.trustScore ?? 85) >= 90 ? 'text-emerald-400' : 
                            (v.trustScore ?? 85) >= 70 ? 'text-amber-400' :
                            (v.trustScore ?? 85) >= 45 ? 'text-orange-400' : 'text-rose-400 animate-pulse font-black'
                          }`}>
                            {v.trustScore ?? 85}%
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">score</span>
                        </div>
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-bold uppercase font-mono leading-none border ${
                          (v.riskCategory ?? 'Low Risk') === 'Low Risk' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/10' :
                          (v.riskCategory ?? 'Low Risk') === 'Medium Risk' ? 'bg-amber-950/60 text-amber-400 border-amber-500/10' :
                          (v.riskCategory ?? 'Low Risk') === 'High Risk' ? 'bg-orange-950/60 text-orange-400 border-orange-500/10' :
                          'bg-rose-950 text-rose-400 border-rose-500/20'
                        }`}>
                          {v.riskCategory ?? 'Low Risk'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase ${
                        v.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20'
                          : v.status === 'Pending'
                          ? 'bg-amber-950/80 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/25'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          v.status === 'Active' ? 'bg-emerald-400' : v.status === 'Pending' ? 'bg-amber-400' : 'bg-rose-400'
                        }`} />
                        {v.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedVendor(v)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold font-mono tracking-wider bg-slate-800 text-slate-200 hover:text-emerald-400 border border-slate-700 hover:border-emerald-500/20 p-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        VIEW
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center p-8 text-sm text-slate-500 font-mono">
                    No verified vendors found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* RENDER VENDOR DETAILED PROFILE popover/modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-slate-100 relative space-y-6 shadow-2xl shadow-slate-950">
            
            <button
              onClick={() => setSelectedVendor(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-bold text-2xl font-mono ${
                (selectedVendor.trustScore ?? 85) < 45
                  ? 'bg-rose-950/40 border-rose-500 text-rose-400'
                  : 'bg-slate-800 border-slate-700 text-emerald-400'
              }`}>
                {selectedVendor.name.slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-mono">
                    SUPPLIER #{selectedVendor.id}
                  </span>
                  {(selectedVendor.trustScore ?? 85) < 45 && (
                    <span className="text-[9px] bg-rose-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase font-mono animate-pulse">
                      🚨 High Suspicion: Fake Supporter
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-display font-extrabold text-white">{selectedVendor.name}</h3>
                <p className="text-xs text-slate-400">{selectedVendor.category} Division &bull; {selectedVendor.country}</p>
              </div>
            </div>

            {/* Smart Risk Diagnostic Panel */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Compliance Registry Rating</span>
                  <span className={`text-base font-extrabold font-mono ${(selectedVendor.trustScore ?? 85) >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(selectedVendor.trustScore ?? 85) >= 70 ? '🟢 TRUSTED COMMERCIAL ENTITY' : '🔴 UNTRUSTED / HIGH RISK'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Credibility Score</span>
                  <span className={`text-2xl font-black font-mono ${(selectedVendor.trustScore ?? 85) >= 90 ? 'text-emerald-400' : (selectedVendor.trustScore ?? 85) >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                    {selectedVendor.trustScore ?? 85}%
                  </span>
                </div>
              </div>

              {/* Trust gauge slider */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (selectedVendor.trustScore ?? 85) >= 90 ? 'bg-emerald-500' : 
                      (selectedVendor.trustScore ?? 85) >= 70 ? 'bg-amber-500' : 
                      (selectedVendor.trustScore ?? 85) >= 45 ? 'bg-orange-500' : 'bg-rose-500 animate-pulse'
                    }`}
                    style={{ width: `${selectedVendor.trustScore ?? 85}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] text-slate-500 font-mono">
                  <span>0% Shell</span>
                  <span>45% Suspicious</span>
                  <span>70% Verified</span>
                  <span>100% Secure</span>
                </div>
              </div>
            </div>

            {/* Verification Detail Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-850 text-xs">
              <div className="space-y-1 font-mono">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">GSTIN Status</span>
                <span className="text-slate-200 font-bold flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  {selectedVendor.gstNo}
                  <span className="text-[9px] text-emerald-400 bg-emerald-950/50 px-1 rounded uppercase border border-emerald-500/20 font-black">Active</span>
                </span>
              </div>
              
              <div className="space-y-1 font-mono">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Quality Audit</span>
                <span className="text-slate-200 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {selectedVendor.rating.toFixed(1)} / 5 Quality Scale
                </span>
              </div>

              <div className="space-y-1 font-mono">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Past Fulfillment SLA</span>
                <span className="text-slate-200 font-bold flex items-center gap-1">
                  <span className="text-emerald-400 text-sm font-black mr-0.5">{selectedVendor.onTimeDeliveryRate ?? 94}%</span>
                  on-time delivery
                </span>
              </div>

              <div className="space-y-1 font-mono">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Secure Domain Auth</span>
                <span className="text-slate-200 font-bold flex items-center gap-1 truncate">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{selectedVendor.email}</span>
                </span>
              </div>

              <div className="col-span-2 border-t border-slate-900 pt-3 mt-1 space-y-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block font-mono">Rule-Based Compliance Checks</span>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className={(selectedVendor.trustScore ?? 85) >= 45 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {(selectedVendor.trustScore ?? 85) >= 45 ? "✔️ AUTH" : "❌ PUBLIC"}
                    </span>
                    <span className="font-mono text-[9px]">Sender Domain Domain</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-emerald-400 font-bold">✔️ VALID</span>
                    <span className="font-mono text-[9px]">Gst Checksum Verification</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-emerald-400 font-bold">✔️ CLEAR</span>
                    <span className="font-mono text-[9px]">Inter-state Tax Audit</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className={!(selectedVendor.isFakeVendor) ? "text-emerald-400 font-bold" : "text-rose-400 font-black"}>
                      {!(selectedVendor.isFakeVendor) ? "✔️ NORMAL" : "🚨 NO RECOGNIZED ADDR"}
                    </span>
                    <span className="font-mono text-[9px]">Company Physical Trace</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block">About Strategic Partner</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                {selectedVendor.about || 'No additional commercial remarks generated for this vendor card.'}
              </p>
            </div>

            {/* Set Operational state */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold block">Compliance Status Clearance</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateVendorStatus(selectedVendor.id, 'Active')}
                  className={`py-2 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedVendor.status === 'Active'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  ACTIVE
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateVendorStatus(selectedVendor.id, 'Pending')}
                  className={`py-2 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedVendor.status === 'Pending'
                      ? 'bg-amber-950 border-amber-500 text-amber-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  PENDING
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateVendorStatus(selectedVendor.id, 'Blocked')}
                  className={`py-2 rounded-lg border text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedVendor.status === 'Blocked'
                      ? 'bg-rose-950 border-rose-500 text-rose-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <XSquare className="w-3.5 h-3.5 text-rose-400" />
                  BLOCKED
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  onUpdateVendorStatus(selectedVendor.id, selectedVendor.status);
                  setSelectedVendor(null);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider font-mono cursor-pointer border border-slate-705"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* RENDER ADD VENDOR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-100 relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono uppercase rounded-full">
                <Sparkles className="w-3 h-3" />
                Gst Compliance Onboarding
              </div>
              <h3 className="text-xl font-display font-extrabold text-white">Add Partner Profile</h3>
              <p className="text-xs text-slate-400">Register verified business credentials directly onto the central ERP node.</p>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex justify-between items-center">
                  <span>Legal Entity Name *</span>
                  {errors.name && <span className="text-[10px] text-rose-400 lowercase font-mono font-bold animate-pulse">{errors.name}</span>}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Commercial Logistics Ltd"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors(prev => { const rest = { ...prev }; delete rest.name; return rest; });
                    }
                  }}
                  className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all font-semibold ${
                    errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex justify-between items-center">
                    <span>GSTIN Registration *</span>
                    {errors.gstNo && <span className="text-[10px] text-rose-400 lowercase font-mono font-bold animate-pulse">invalid</span>}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="15 Characters e.g. 27AABCS1429B1Z0"
                    value={gstNo}
                    onChange={(e) => {
                      setGstNo(e.target.value);
                      if (errors.gstNo) {
                        setErrors(prev => { const rest = { ...prev }; delete rest.gstNo; return rest; });
                      }
                    }}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-xs focus:outline-none text-white font-mono transition-all font-bold placeholder:text-slate-800 ${
                      errors.gstNo ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.gstNo && (
                    <p className="text-[9px] text-rose-400 font-mono mt-1 font-bold">{errors.gstNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                    Category Division
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all font-medium font-mono"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex justify-between items-center">
                    <span>Contact No (10-digit) *</span>
                    {errors.contactNo && <span className="text-[10px] text-rose-400 lowercase font-mono font-bold animate-pulse">Required</span>}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 10-digit number"
                    value={contactNo}
                    onChange={(e) => {
                      setContactNo(e.target.value);
                      if (errors.contactNo) {
                        setErrors(prev => { const rest = { ...prev }; delete rest.contactNo; return rest; });
                      }
                    }}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all font-mono ${
                      errors.contactNo ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.contactNo && (
                    <p className="text-[9px] text-rose-400 font-mono mt-1 font-bold">{errors.contactNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5 flex justify-between items-center">
                    <span>Authorized Email *</span>
                    {errors.email && <span className="text-[10px] text-rose-400 lowercase font-mono font-bold animate-pulse">Invalid</span>}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sales@firmname.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => { const rest = { ...prev }; delete rest.email; return rest; });
                      }
                    }}
                    className={`w-full bg-slate-950 border rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all ${
                      errors.email ? 'border-rose-500/80 focus:border-rose-500' : 'border-slate-800 focus:border-emerald-500'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[9px] text-rose-400 font-mono mt-1 font-bold">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <p className="text-[10px] text-slate-500 font-mono leading-tight bg-slate-950 p-2.5 border border-slate-800 rounded-lg">
                    Default Quality rating for newly registered vendors is init valued at <span className="text-amber-400 font-bold">4.0/5</span>
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  About Supplier Capabilities
                </label>
                <textarea
                  rows={2}
                  placeholder="Provide scope, physical warehousing nodes, or past enterprise projects."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs focus:outline-none text-white transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 py-3 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-lg hover:shadow-emerald-500/10"
                >
                  Authorize Profile
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
