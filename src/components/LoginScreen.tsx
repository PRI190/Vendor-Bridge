import React, { useState } from 'react';
import { UserRole } from '../types';
import { Building2, ShieldCheck, UserCheck, Briefcase, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: { name: string; email: string; role: UserRole }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('Procurement Officer');
  
  // Login Form States
  const [username, setUsername] = useState('rahul.mehta');
  const [password, setPassword] = useState('••••••••');
  
  // Signup Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [extraInfo, setExtraInfo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Auto-determine name based on role or input
      const displayName = username.includes('.') 
        ? username.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
        : username || 'Rahul Mehta';
      onLogin({
        name: displayName,
        email: `${username || 'rahul'}@vendorbridge.com`,
        role: role
      });
    } else {
      onLogin({
        name: `${firstName || 'User'} ${lastName || ''}`.trim(),
        email: email || 'user@vendorbridge.com',
        role: role
      });
    }
  };

  const roles: { value: UserRole; label: string; desc: string; icon: React.ReactNode }[] = [
    { 
      value: 'Procurement Officer', 
      label: 'Procurement Officer', 
      desc: 'Create RFQs, Compare quotes, release POs',
      icon: <Briefcase className="w-5 h-5 text-emerald-500" />
    },
    { 
      value: 'Vendor', 
      label: 'Supplier / Vendor', 
      desc: 'Submit quotes, review purchase orders',
      icon: <Building2 className="w-5 h-5 text-blue-500" />
    },
    { 
      value: 'Manager', 
      label: 'Manager / Approver', 
      desc: 'Multi-level workflow authorization',
      icon: <UserCheck className="w-5 h-5 text-amber-500" />
    },
    { 
      value: 'Admin', 
      label: 'System Admin', 
      desc: 'Configure users, logs & parameters',
      icon: <ShieldCheck className="w-5 h-5 text-slate-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 z-10 max-w-7xl mx-auto w-full">
        <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl">
          <Building2 className="w-7 h-7 text-emerald-400" />
        </div>
        <div>
          <span className="font-display font-black text-3xl tracking-tight text-white drop-shadow-[0_2px_12px_rgba(52,211,153,0.2)]">
            Vendor<span className="text-emerald-400">Bridge</span>
          </span>
          <p className="text-xs text-slate-300 font-mono">B2B Vendor Management System</p>
        </div>
      </div>

      {/* Middle Form Area */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-8 z-10">
        
        {/* Pitch Hero Column */}
        <div className="lg:col-span-5 h-full flex flex-col justify-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            Empowering Modern Procurement
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
            Simplify and digitize your supply chain relationships.
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            VendorBridge is a unified enterprise hub for managing strategic vendor relationships, creating smart RFQs, evaluating real-time submissions side-by-side, and executing audit-safe invoice approvals.
          </p>

          <div className="pt-4 border-t border-slate-800 space-y-3 hidden lg:block">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-300">Centralized Bid Management ERP</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-300">Strict Multi-role Access Controls</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-medium text-slate-300">Automatic L1/L2 Audited Clearances</span>
            </div>
          </div>
        </div>

        {/* Interactive Form Card */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-center font-semibold text-sm transition-all duration-200 ${
                isLogin 
                  ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' 
                  : 'bg-slate-950/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign In Screen 1
              </div>
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-center font-semibold text-sm transition-all duration-200 ${
                !isLogin 
                  ? 'bg-slate-900 text-emerald-400 border-b-2 border-emerald-500' 
                  : 'bg-slate-950/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Registration Screen 2
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Circular Placeholder Icon corresponding to Screen 1/2 "Photo" */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="relative w-20 h-20 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                <Building2 className="w-10 h-10 text-emerald-400" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
              </div>
              <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Enterprise Profile Photo</p>
            </div>

            {/* Role Selection Blocks */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Select Workspace Persona
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      role === r.value
                        ? 'bg-emerald-950/30 border-emerald-500 text-white ring-1 ring-emerald-500/20'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="mt-0.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">{r.icon}</div>
                    <div>
                      <div className="text-xs font-bold font-display">{r.label}</div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {isLogin ? (
              /* SCREEN 1: LOGIN FORM */
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                    Username / ID
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. rahul.mehta"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono placeholder:text-slate-700 transition-all font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                      Password
                    </label>
                    <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Session Key reset instructions sent to domain administrator.'); }} className="text-xs text-emerald-400 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono transition-all font-medium"
                  />
                </div>
              </div>
            ) : (
              /* SCREEN 2: REGISTRATION FORM */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Rahul"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-700 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Mehta"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-700 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@vendorbridge.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-700 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-700 transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Role Category
                    </label>
                    <input
                      type="text"
                      disabled
                      value={role}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-700 transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                    Additional Information / Notes
                  </label>
                  <textarea
                    rows={2}
                    value={extraInfo}
                    onChange={(e) => setExtraInfo(e.target.value)}
                    placeholder="Write any additional details or notes here."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 text-white placeholder:text-slate-700 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3.5 px-4 rounded-xl shadow-lg hover:shadow-emerald-500/20 active:opacity-90 transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLogin ? (
                <>
                  <LogIn className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  Authenticate Node
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  Register ERP Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-500 font-mono z-10 max-w-7xl mx-auto w-full pt-4 border-t border-slate-900">
        &copy; {new Date().getFullYear()} VendorBridge Inc. &bull; Enterprise B2B SaaS Ledger Node Secured.
      </div>
    </div>
  );
}
