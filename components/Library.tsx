
import React from 'react';
import { PurestConfig, SavedConfig, HeaderTemplate } from '../types';

interface LibraryProps {
  savedConfigs: SavedConfig[];
  headerTemplates: HeaderTemplate[];
  onLoadConfig: (config: PurestConfig) => void;
  onDeleteConfig: (id: string) => void;
  onSaveTemplate: (template: HeaderTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

const PRESET_HEADER_TEMPLATES = [
  { name: "OAuth2 Bearer", headers: { authorization: "Bearer {{TOKEN}}" } },
  { name: "Standard X-API-KEY", headers: { "x-api-key": "{{API_KEY}}" } },
  { name: "JSON Response", headers: { "accept": "application/json" } }
];

const Library: React.FC<LibraryProps> = ({ 
  savedConfigs, 
  headerTemplates, 
  onLoadConfig, 
  onDeleteConfig, 
  onSaveTemplate, 
  onDeleteTemplate 
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Header Presets
        </h3>
        <div className="grid gap-2">
          {PRESET_HEADER_TEMPLATES.map((p, i) => (
            <button 
              key={i} 
              onClick={() => onSaveTemplate({ id: crypto.randomUUID(), name: p.name, headers: p.headers })}
              className="bg-slate-900/40 border border-slate-700 p-2 rounded-lg text-left hover:border-indigo-500/30 transition-all flex items-center justify-between group"
            >
              <div>
                <span className="text-xs font-bold text-slate-200">{p.name}</span>
                <p className="text-[10px] text-slate-500 font-mono">{Object.keys(p.headers)[0]}</p>
              </div>
              <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100">+ USE</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Saved API Configs</h3>
        {savedConfigs.length === 0 ? (
          <div className="bg-slate-900/20 border border-dashed border-slate-700 p-8 rounded-xl text-center">
            <p className="text-xs text-slate-500">No saved configurations yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {savedConfigs.map(item => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl group hover:border-indigo-500/50 transition-all">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-bold text-slate-100">{item.name}</h4>
                  <button 
                    onClick={() => onDeleteConfig(item.id)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <button 
                  onClick={() => onLoadConfig(item.config)}
                  className="text-[11px] font-bold text-indigo-400 mt-2 uppercase flex items-center gap-1"
                >
                  Load Snapshot <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Library;
