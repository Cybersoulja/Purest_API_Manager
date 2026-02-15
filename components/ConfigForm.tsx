
// Complete implementation of the ConfigForm component including missing header management and default export.
import React, { useState } from 'react';
import { PurestConfig, PurestEndpointConfig, Secret, HeaderTemplate } from '../types';

interface ConfigFormProps {
  config: PurestConfig;
  setConfig: (config: PurestConfig) => void;
  onSave?: (name: string) => void;
  secrets?: Secret[];
  templates?: HeaderTemplate[];
  onAddSecret?: (key: string, value: string) => void;
  onSaveTemplate?: (template: HeaderTemplate) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({ 
  config, 
  setConfig, 
  onSave, 
  secrets = [], 
  templates = [],
  onAddSecret,
  onSaveTemplate
}) => {
  const [saveName, setSaveName] = useState('');
  const [quickSecretKey, setQuickSecretKey] = useState('');
  const [quickSecretValue, setQuickSecretValue] = useState('');
  const [showQuickSecret, setShowQuickSecret] = useState(false);

  const providers = Object.keys(config);
  
  const addEndpoint = (provider: string) => {
    const newConfig = { ...config };
    const endpointName = `endpoint_${Object.keys(newConfig[provider]).length}`;
    newConfig[provider][endpointName] = {
      origin: "https://api.example.com",
      path: "{path}"
    };
    setConfig(newConfig);
  };

  const updateField = (provider: string, endpoint: string, field: string, value: string) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    (newConfig[provider][endpoint] as any)[field] = value;
    setConfig(newConfig);
  };

  const updateHeader = (provider: string, endpoint: string, headerKey: string, value: string) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    if (!newConfig[provider][endpoint].headers) newConfig[provider][endpoint].headers = {};
    newConfig[provider][endpoint].headers[headerKey] = value;
    setConfig(newConfig);
  };

  const deleteHeader = (provider: string, endpoint: string, headerKey: string) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    if (newConfig[provider][endpoint].headers) {
      delete newConfig[provider][endpoint].headers[headerKey];
    }
    setConfig(newConfig);
  };

  const applyTemplate = (provider: string, endpoint: string, template: HeaderTemplate) => {
    const newConfig = JSON.parse(JSON.stringify(config));
    newConfig[provider][endpoint].headers = {
      ...(newConfig[provider][endpoint].headers || {}),
      ...template.headers
    };
    setConfig(newConfig);
  };

  const handleSaveAsTemplate = (endpoint: PurestEndpointConfig) => {
    if (!endpoint.headers || Object.keys(endpoint.headers).length === 0) return;
    const name = prompt("Enter a name for this Header Template:");
    if (name && onSaveTemplate) {
      onSaveTemplate({
        id: crypto.randomUUID(),
        name,
        headers: { ...endpoint.headers }
      });
    }
  };

  const handleQuickSecretAdd = () => {
    if (quickSecretKey && quickSecretValue && onAddSecret) {
      onAddSecret(quickSecretKey, quickSecretValue);
      setQuickSecretKey('');
      setQuickSecretValue('');
      setShowQuickSecret(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
      <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 space-y-3">
        <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Library Snapshot</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Name this config..."
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200"
          />
          <button 
            onClick={() => { onSave?.(saveName); setSaveName(''); }}
            disabled={!saveName.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/10"
          >
            SAVE
          </button>
        </div>
      </div>

      {providers.map(provider => (
        <div key={provider} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <h3 className="text-indigo-400 font-bold uppercase tracking-wider text-xs">{provider} Provider</h3>
            <button 
              onClick={() => addEndpoint(provider)}
              className="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded border border-slate-600 transition-colors uppercase font-bold"
            >
              + Add Endpoint
            </button>
          </div>
          
          <div className="space-y-6">
            {Object.entries(config[provider] as Record<string, PurestEndpointConfig>).map(([name, endpoint]) => (
              <div key={name} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{"Alias: " + name}</span>
                  <div className="flex gap-2 items-center">
                    {templates && templates.length > 0 && (
                      <select 
                        className="text-[10px] bg-slate-800 border-none outline-none text-indigo-400 font-bold cursor-pointer"
                        onChange={(e) => {
                          const t = templates.find(temp => temp.id === e.target.value);
                          if (t) applyTemplate(provider, name, t);
                          e.target.value = "";
                        }}
                      >
                        <option value="">+ AUTH PRESET</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    )}
                    <button 
                      onClick={() => handleSaveAsTemplate(endpoint)}
                      title="Save current headers as a template"
                      className="p-1 text-slate-500 hover:text-indigo-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-500 uppercase mb-1 font-bold">Origin</label>
                    <input 
                      type="text" 
                      value={endpoint.origin}
                      onChange={(e) => updateField(provider, name, 'origin', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-indigo-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase mb-1 font-bold">Path Template</label>
                      <input 
                        type="text" 
                        value={endpoint.path}
                        onChange={(e) => updateField(provider, name, 'path', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 uppercase mb-1 font-bold">Version</label>
                      <input 
                        type="text" 
                        value={endpoint.version || ''}
                        onChange={(e) => updateField(provider, name, 'version', e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-500 uppercase font-bold">Headers</label>
                      <button 
                        onClick={() => updateHeader(provider, name, `header_${endpoint.headers ? Object.keys(endpoint.headers).length : 0}`, '')}
                        className="text-[9px] text-indigo-400 hover:text-indigo-300 font-bold"
                      >
                        + ADD HEADER
                      </button>
                    </div>
                    <div className="space-y-2">
                      {endpoint.headers && Object.entries(endpoint.headers).map(([hKey, hVal]) => (
                        <div key={hKey} className="flex gap-2">
                          <input 
                            type="text" 
                            value={hKey}
                            placeholder="Key"
                            onChange={(e) => {
                              const newConfig = JSON.parse(JSON.stringify(config));
                              const oldVal = newConfig[provider][name].headers[hKey];
                              delete newConfig[provider][name].headers[hKey];
                              newConfig[provider][name].headers[e.target.value] = oldVal;
                              setConfig(newConfig);
                            }}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded p-1.5 text-[10px] text-slate-300 outline-none"
                          />
                          <input 
                            type="text" 
                            value={hVal}
                            placeholder="Value"
                            onChange={(e) => updateHeader(provider, name, hKey, e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded p-1.5 text-[10px] text-slate-100 outline-none"
                          />
                          <button 
                            onClick={() => deleteHeader(provider, name, hKey)}
                            className="text-slate-600 hover:text-red-400 p-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConfigForm;
