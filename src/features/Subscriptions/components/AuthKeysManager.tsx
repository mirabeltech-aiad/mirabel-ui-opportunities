
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FloatingLabelInput } from '../components';
import { Eye, EyeOff, Key, Copy, Check } from 'lucide-react';

interface ApiKey {
  id: string;
  provider: string;
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  lastUsed: string;
  description: string;
}

const AuthKeysManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      provider: 'OpenAI',
      name: 'GPT-4 Production',
      key: 'sk-proj-1234...abcd',
      status: 'active',
      lastUsed: '2024-01-15',
      description: 'Production GPT-4 API key for main application'
    },
    {
      id: '2',
      provider: 'Anthropic',
      name: 'Claude Development',
      key: 'sk-ant-1234...efgh',
      status: 'active',
      lastUsed: '2024-01-14',
      description: 'Claude API for development environment'
    },
    {
      id: '3',
      provider: 'Google',
      name: 'Gemini Testing',
      key: 'AIza...5678',
      status: 'inactive',
      lastUsed: '2024-01-10',
      description: 'Gemini API for testing purposes'
    }
  ]);

  const [newKey, setNewKey] = useState({
    provider: '',
    name: '',
    key: '',
    description: ''
  });

  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = async (key: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy key:', err);
    }
  };

  const addNewKey = () => {
    if (newKey.provider && newKey.name && newKey.key) {
      const key: ApiKey = {
        id: Date.now().toString(),
        provider: newKey.provider,
        name: newKey.name,
        key: newKey.key,
        status: 'active',
        lastUsed: new Date().toISOString().split('T')[0],
        description: newKey.description
      };
      setApiKeys([...apiKeys, key]);
      setNewKey({ provider: '', name: '', key: '', description: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'expired': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '*'.repeat(key.length);
    return key.substring(0, 4) + '*'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-ocean-800">
            <Key className="w-5 h-5 mr-2" />
            Add New API Key
          </CardTitle>
          <CardDescription>Configure a new AI service API key for your microservices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FloatingLabelInput
                label="Provider"
                value={newKey.provider}
                onChange={(value) => setNewKey({ ...newKey, provider: value })}
                placeholder="e.g., OpenAI, Anthropic, Google"
                required
              />
              <FloatingLabelInput
                label="Key Name"
                value={newKey.name}
                onChange={(value) => setNewKey({ ...newKey, name: value })}
                placeholder="e.g., Production GPT-4"
                required
              />
            </div>
            <div className="space-y-4">
              <FloatingLabelInput
                label="API Key"
                type="password"
                value={newKey.key}
                onChange={(value) => setNewKey({ ...newKey, key: value })}
                placeholder="Enter your API key"
                required
              />
              <FloatingLabelInput
                label="Description"
                value={newKey.description}
                onChange={(value) => setNewKey({ ...newKey, description: value })}
                placeholder="Brief description of usage"
                isTextarea
                rows={3}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button 
              onClick={addNewKey}
              className="bg-ocean-gradient hover:opacity-90"
              disabled={!newKey.provider || !newKey.name || !newKey.key}
            >
              Add API Key
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-ocean-800">
            <Key className="w-5 h-5 mr-2" />
            Configured API Keys
          </CardTitle>
          <CardDescription>Manage your AI service API keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                      <Badge 
                        className={`${getStatusColor(apiKey.status)} text-white`}
                      >
                        {apiKey.status}
                      </Badge>
                      <span className="text-sm text-gray-500">({apiKey.provider})</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{apiKey.description}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-500">API Key:</span>
                      <code className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-8 w-8 p-0"
                      >
                        {visibleKeys.has(apiKey.id) ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                        className="h-8 w-8 p-0"
                      >
                        {copiedKey === apiKey.id ? 
                          <Check className="h-4 w-4 text-green-500" /> : 
                          <Copy className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                    <p className="text-xs text-gray-400">Last used: {apiKey.lastUsed}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthKeysManager;
