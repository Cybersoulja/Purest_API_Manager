import React, { useState } from 'react';
import { PurestConfig, Secret } from '../types';

interface CodePreviewProps {
  config: PurestConfig;
  providerName: string;
  secrets?: Secret[];
}

const CodePreview: React.FC<CodePreviewProps> = ({ config, providerName, secrets = [] }) => {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'config' | 'usage'>('config');

  const copyToClipboard = () => {
    const textToCopy = view === 'config' 
      ? JSON.stringify(config, null, 2)
      : generateUsageCode();
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateUsageCode = () => {
    const pName = providerName || Object.keys(config)[0] || 'provider';
    const endpoints = config[pName] ? Object.keys(config[pName]) : ['default'];
    const exampleEndpoint = endpoints.includes('YouTube') ? 'YouTube' : endpoints[0];

    const configStr = JSON.stringify(config, null, 2);
    // Find all occurrences of {{KEY}}
    const secretMatches = Array.from(configStr.matchAll(/{{(.*?)}}/g)).map(m => m[1]);
    const uniqueSecrets = Array.from(new Set(secretMatches));

    const secretEnvVars = uniqueSecrets.length > 0 
      ? `// Set your environment variables:\n${uniqueSecrets.map(s => `const ${s} = process.env.${s};`).join('\n')}\n\n`
      : '';

    // We use a safe replacement to avoid backtick interpolation issues in the UI
    const finalConfigStr = configStr.replace(/{{(.*?)}}/g, (_, key) => `\${${key}}`);

    return `${secretEnvVars}const purest = require('purest');

const config = ${finalConfigStr};

const ${pName} = purest({
  provider: '${pName}',
  config
});

async function run() {
  const {res, body} = await ${pName}('${exampleEndpoint}')
    .get('resource')
    .request();
    
  console.log(body);
}`;
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-2">
          {['config', 'usage'].map(v => (
            <button 
              key={v}
              onClick={() => setView(v as any)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {v === 'config' ? 'JSON CONFIG' : 'NODE.JS CODE'}
            </button>
          ))}
        </div>
        
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded transition-all"
        >
          {copied ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              COPIED
            </span>
          ) : 'COPY'}
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <pre className="text-indigo-300">
          <code>{view === 'config' ? JSON.stringify(config, null, 2) : generateUsageCode()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;