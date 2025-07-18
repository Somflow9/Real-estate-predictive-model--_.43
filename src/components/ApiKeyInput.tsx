
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Key, Eye, EyeOff } from 'lucide-react';
import { openaiService } from '@/services/openaiService';

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

const ApiKeyInput = ({ onApiKeySet }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      openaiService.setApiKey(apiKey.trim());
      onApiKeySet();
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto bg-card">
      <div className="flex items-center gap-2 mb-4">
        <Key className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Enter OpenAI API Key</h2>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        To use the ChatGPT AI chat feature, please enter your OpenAI API key. You can get one from{' '}
        <a 
          href="https://platform.openai.com/api-keys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          OpenAI Platform
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="pr-10 bg-background"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowKey(!showKey)}
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
        
        <Button type="submit" className="w-full" disabled={!apiKey.trim()}>
          Set API Key
        </Button>
      </form>

      <p className="text-xs text-muted-foreground mt-4">
        Your API key is stored locally and never sent to our servers.
      </p>
    </Card>
  );
};

export default ApiKeyInput;
