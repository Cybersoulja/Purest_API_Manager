
export interface PurestEndpointConfig {
  origin: string;
  path: string;
  version?: string;
  headers?: Record<string, string>;
  subdomain?: string;
}

export interface PurestProviderConfig {
  [endpointName: string]: PurestEndpointConfig;
}

export interface PurestConfig {
  [providerName: string]: PurestProviderConfig;
}

export interface Secret {
  id: string;
  key: string;
  value: string;
  createdAt: number;
}

export interface HeaderTemplate {
  id: string;
  name: string;
  headers: Record<string, string>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SavedConfig {
  id: string;
  name: string;
  config: PurestConfig;
  createdAt: number;
}
