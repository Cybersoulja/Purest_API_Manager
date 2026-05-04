import React, { useState } from 'react';
import { PurestConfig, Secret } from '../types';

interface CodePreviewProps {
  config: PurestConfig;
  providerName: string;
  secrets?: Secret[];
}

const CodePreview: React.FC<CodePreviewProps> = ({ config, providerName, secrets = [] }) => {
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<'config' | 'usage' | 'python'>('config');

  const copyToClipboard = () => {
    let textToCopy: string;
    if (view === 'config') {
      textToCopy = JSON.stringify(config, null, 2);
    } else if (view === 'python') {
      textToCopy = generatePythonCode();
    } else {
      textToCopy = generateUsageCode();
    }
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

  const generatePythonCode = () => {
    const pName = providerName || Object.keys(config)[0] || 'provider';
    const providerConfig = config[pName] ?? {};
    const endpoints = Object.keys(providerConfig);
    const firstEndpoint = endpoints[0] ?? 'default';
    const endpointCfg = providerConfig[firstEndpoint];

    // Infer API name and version from the config
    const origin: string = endpointCfg?.origin ?? '';
    const version: string = endpointCfg?.version ?? 'v1';

    // Detect whether this looks like a Google discovery-based API by checking the parsed hostname
    let isGoogleApi = false;
    try {
      const hostname = new URL(origin).hostname;
      isGoogleApi =
        hostname === 'googleapis.com' || hostname.endsWith('.googleapis.com') ||
        hostname === 'google.com' || hostname.endsWith('.google.com');
    } catch {
      isGoogleApi = false;
    }

    // Collect any {{SECRET}} tokens used in header values
    const configStr = JSON.stringify(config);
    const secretMatches = Array.from(configStr.matchAll(/{{(.*?)}}/g)).map(m => m[1]);
    const uniqueSecrets = Array.from(new Set(secretMatches));

    const envBlock = uniqueSecrets.length > 0
      ? uniqueSecrets.map(s => `${s} = os.environ.get("${s}")`).join('\n')
      : `API_KEY = os.environ.get("API_KEY")`;

    if (isGoogleApi) {
      // serviceName is derived from the provider name as a best-effort approximation;
      // users should replace it with the exact Google API service name (e.g. "youtube", "drive").
      const serviceName = pName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'service';
      const exampleResource = firstEndpoint.toLowerCase().replace(/[^a-z0-9_]/g, '') || 'resource';

      return `# Install: pip install google-api-python-client google-auth

import os
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

${envBlock}

# --- Option A: API key (public data only) ---
# service = build("${serviceName}", "${version}", developerKey=API_KEY)

# --- Option B: OAuth 2.0 (user data) ---
# credentials = Credentials(token=os.environ.get("OAUTH_TOKEN"))
# service = build("${serviceName}", "${version}", credentials=credentials)

# --- Option C: Service account (server-to-server) ---
# from google.oauth2 import service_account
# credentials = service_account.Credentials.from_service_account_file(
#     "service_account.json",
#     scopes=["https://www.googleapis.com/auth/cloud-platform"]
# )
# service = build("${serviceName}", "${version}", credentials=credentials)

# Build the service (choose one auth option above)
# NOTE: Replace "${serviceName}" with the actual Google API name (e.g. "youtube", "drive", "gmail")
service = build("${serviceName}", "${version}", developerKey=API_KEY)

# Example request — replace with the resource and method you need
request = service.${exampleResource}().list()
response = request.execute()

print(response)
`;
    }

    // Generic REST API using the 'requests' library
    const headerLines = endpointCfg?.headers
      ? Object.entries(endpointCfg.headers)
          // Use JSON.stringify for safe escaping of literal header values
          .map(([k, v]) => `    ${JSON.stringify(k)}: ${v.startsWith('{{') ? `os.environ.get(${JSON.stringify(v.replace(/[{}]/g, ''))})` : JSON.stringify(v)}`)
          .join(',\n')
      : '    # Add your headers here';

    // Replace known path tokens with a generic placeholder; update other tokens manually
    const baseUrl = `${origin}${endpointCfg?.path ?? ''}`.replace(/\{[^}]+\}/g, 'resource');

    return `# Install: pip install requests

import os
import requests

${envBlock}

BASE_URL = "${baseUrl}"

headers = {
${headerLines}
}

def get_resource():
    response = requests.get(BASE_URL, headers=headers)
    response.raise_for_status()
    return response.json()

if __name__ == "__main__":
    data = get_resource()
    print(data)
`;
  };

  const TAB_LABELS: Record<string, string> = {
    config: 'JSON CONFIG',
    usage: 'NODE.JS CODE',
    python: 'PYTHON CODE',
  };

  const getPreviewContent = () => {
    if (view === 'config') return JSON.stringify(config, null, 2);
    if (view === 'python') return generatePythonCode();
    return generateUsageCode();
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-full overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex gap-2">
          {(['config', 'usage', 'python'] as const).map(v => (
            <button 
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {TAB_LABELS[v]}
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
          <code>{getPreviewContent()}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;