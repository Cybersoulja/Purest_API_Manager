import React, { useState } from 'react';
import { Secret } from '../types';

interface VaultProps {
  secrets: Secret[];
  setSecrets: (secrets: Secret[]) => void;
}

const Vault: React.FC<VaultProps> = ({ secrets, setSecrets }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const addSecret = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    const formattedKey = newKey.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    const secret: Secret = {
      id: crypto.randomUUID(),
      key: formattedKey,
      value: newValue.trim(),
      createdAt: Date.now()
    };
    setSecrets([...secrets, secret]);
    setNewKey('');
    setNewValue('');
  };

  const deleteSecret = (id: string) => {
    setSecrets(secrets.filter(s => s.id !== id));
  };

  const toggleVisibility = (id: string) => {
    const next = new Set(visibleIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setVisibleIds(next);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-xl space-y-4 shadow-inner">
        <div className="flex items-center gap-2 mb-1">
          <div className="bg-emerald-500/20 p-1.5 rounded-md">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Add Secure Secret</h3>
        </div>
        
        <p className="text-[10px] text-slate-500 italic">Data is stored locally in your browser and never sent to our servers.</p>

        <div className="grid gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Key Name</label>
            <input 
              type="text" 
              placeholder="e.g. STRIPE_SECRET_KEY"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-indigo-300 outline-none focus:ring-1 focus:ring-indigo-500 font-mono transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Secret Value</label>
            <input 
              type="password" 
              placeholder="••••••••••••••••"
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button 
            onClick={addSecret}
            disabled={!newKey.trim() || !newValue.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-xs transition-all shadow-lg shadow-indigo-500/10"
          >
            SAVE TO VAULT
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Active Secrets</h3>
        {secrets.length === 0 ? (
          <div className="text-xs text-slate-500 text-center py-12 bg-slate-900/20 rounded-xl border border-dashed border-slate-700">
            <p className="mb-2">Your vault is empty.</p>
            <p className="text-[10px]">Add keys here to use them as {"{{PLACEHOLDERS}}"} in your API configs.</p>
          </div>
        ) : (
          <div className="grid gap-2">
            {secrets.map(s => (
              <div key={s.id} className="bg-slate-800/80 border border-slate-700 p-3 rounded-lg flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div className="flex flex-col gap-1 overflow-hidden mr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-wider uppercase">
                      {"{{" + s.key + "}}"}
                    </span>
                    <button 
                      onClick={() => copyToClipboard("{{" + s.key + "}}", s.id + '_tag')}
                      className="text-[9px] bg-slate-700 text-slate-400 px-1 rounded hover:text-white transition-colors"
                    >
                      {copyStatus === s.id + '_tag' ? 'COPIED' : 'COPY TAG'}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      readOnly
                      type={visibleIds.has(s.id) ? 'text' : 'password'}
                      value={s.value}
                      className="bg-transparent text-xs text-slate-400 w-full outline-none font-mono"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => toggleVisibility(s.id)}
                    title="Toggle Visibility"
                    className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {visibleIds.has(s.id) ? 
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.643-9.943-6.442a5.08 5.08 0 011.67-2.179M17.391 15.194A2.98 2.98 0 0018 13c0-1.657-1.343-3-3-3-.772 0-1.472.293-2.006.773M17.5 17.5l-11-11m11 11L6.5 6.5" /> :
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      }
                      {!visibleIds.has(s.id) && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteSecret(s.id)}
                    title="Delete Secret"
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vault;