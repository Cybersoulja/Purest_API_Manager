
// Update App.tsx to provide the missing handlers to ConfigForm for secret and template management.
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatAgent from './components/ChatAgent';
import ConfigForm from './components/ConfigForm';
import CodePreview from './components/CodePreview';
import Library from './components/Library';
import Vault from './components/Vault';
import Onboarding from './components/Onboarding';
import { PurestConfig, SavedConfig, Secret, HeaderTemplate } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<PurestConfig>({
    google: {
      default: {
        origin: "https://www.googleapis.com",
        path: "{path}",
        headers: {
          authorization: "Bearer {auth}"
        }
      }
    }
  });

  const [providerName, setProviderName] = useState<string>('google');
  const [activeTab, setActiveTab] = useState<'chat' | 'visual' | 'library' | 'vault'>('chat');
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [headerTemplates, setHeaderTemplates] = useState<HeaderTemplate[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load persistence
  useEffect(() => {
    const seen = localStorage.getItem('purest_onboarding_seen');
    if (!seen) setShowOnboarding(true);
    
    const storedConfigs = localStorage.getItem('purest_saved_configs');
    if (storedConfigs) setSavedConfigs(JSON.parse(storedConfigs));

    const storedSecrets = localStorage.getItem('purest_secrets');
    if (storedSecrets) setSecrets(JSON.parse(storedSecrets));

    const storedTemplates = localStorage.getItem('purest_header_templates');
    if (storedTemplates) setHeaderTemplates(JSON.parse(storedTemplates));
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem('purest_saved_configs', JSON.stringify(savedConfigs));
  }, [savedConfigs]);

  useEffect(() => {
    localStorage.setItem('purest_secrets', JSON.stringify(secrets));
  }, [secrets]);

  useEffect(() => {
    localStorage.setItem('purest_header_templates', JSON.stringify(headerTemplates));
  }, [headerTemplates]);

  const handleUpdateConfig = (newConfig: PurestConfig) => {
    setConfig(newConfig);
    const firstProvider = Object.keys(newConfig)[0];
    if (firstProvider) setProviderName(firstProvider);
  };

  const saveCurrentConfig = (name: string) => {
    const newSaved: SavedConfig = {
      id: crypto.randomUUID(),
      name,
      config: JSON.parse(JSON.stringify(config)),
      createdAt: Date.now()
    };
    setSavedConfigs(prev => [newSaved, ...prev]);
  };

  const handleAddSecret = (key: string, value: string) => {
    const newSecret: Secret = {
      id: crypto.randomUUID(),
      key: key.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
      value,
      createdAt: Date.now()
    };
    setSecrets(prev => [...prev, newSecret]);
  };

  const handleSaveTemplate = (template: HeaderTemplate) => {
    setHeaderTemplates(prev => [...prev, template]);
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-slate-900">
      <Header onRestartTour={() => setShowOnboarding(true)} />
      
      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        <div className="lg:col-span-5 flex flex-col gap-4 h-[calc(100vh-120px)] min-h-[500px]">
          <div className={`bg-slate-800 rounded-xl border border-slate-700 flex flex-col h-full shadow-2xl overflow-hidden transition-all duration-500 ${showOnboarding ? 'z-[46]' : 'z-0'}`}>
            <div className="flex border-b border-slate-700">
              {['chat', 'visual', 'library', 'vault'].map((tab) => (
                <button 
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 text-[10px] font-bold transition-colors border-r border-slate-700 last:border-r-0 uppercase tracking-tighter ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'chat' && <ChatAgent onUpdateConfig={handleUpdateConfig} />}
              {activeTab === 'visual' && (
                <ConfigForm 
                  config={config} 
                  setConfig={handleUpdateConfig} 
                  onSave={saveCurrentConfig} 
                  secrets={secrets}
                  templates={headerTemplates}
                  onAddSecret={handleAddSecret}
                  onSaveTemplate={handleSaveTemplate}
                />
              )}
              {activeTab === 'library' && (
                <Library 
                  savedConfigs={savedConfigs} 
                  headerTemplates={headerTemplates}
                  onLoadConfig={handleUpdateConfig} 
                  onDeleteConfig={(id) => setSavedConfigs(prev => prev.filter(c => c.id !== id))}
                  onSaveTemplate={handleSaveTemplate}
                  onDeleteTemplate={(id) => setHeaderTemplates(prev => prev.filter(t => t.id !== id))}
                />
              )}
              {activeTab === 'vault' && (
                <Vault 
                  secrets={secrets} 
                  setSecrets={setSecrets} 
                />
              )}
            </div>
          </div>
        </div>

        <div id="code-preview-area" className={`lg:col-span-7 flex flex-col h-[calc(100vh-120px)] min-h-[500px] transition-all duration-500 ${showOnboarding ? 'z-[46]' : 'z-0'}`}>
          <CodePreview config={config} providerName={providerName} secrets={secrets} />
        </div>
      </main>

      <footer className="bg-slate-800 border-t border-slate-700 p-3 text-center text-xs text-slate-500">
        Purest API Builder Agent • Secure Local Storage Used for Secrets
      </footer>

      {showOnboarding && (
        <Onboarding 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onComplete={() => {
            setShowOnboarding(false);
            localStorage.setItem('purest_onboarding_seen', 'true');
          }} 
        />
      )}
    </div>
  );
};

export default App;
