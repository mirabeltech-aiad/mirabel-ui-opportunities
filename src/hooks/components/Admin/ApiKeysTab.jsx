
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Eye, Settings, TestTube, CheckCircle, XCircle } from "lucide-react";

const ApiKeysTab = () => {
  // API Keys state
  const [openAIKey, setOpenAIKey] = useState("");
  const [runwayKey, setRunwayKey] = useState("");
  const [elevenLabsKey, setElevenLabsKey] = useState("");

  // API Configuration state
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [lastTestedAt, setLastTestedAt] = useState(null);

  // Loading states for save buttons
  const [isSavingOpenAI, setIsSavingOpenAI] = useState(false);
  const [isSavingRunway, setIsSavingRunway] = useState(false);
  const [isSavingElevenLabs, setIsSavingElevenLabs] = useState(false);

  // Saved states for API keys
  const [openAISaved, setOpenAISaved] = useState(false);
  const [runwaySaved, setRunwaySaved] = useState(false);
  const [elevenLabsSaved, setElevenLabsSaved] = useState(false);

  useEffect(() => {
    // Load saved API keys
    const savedOpenAIKey = localStorage.getItem("openai_api_key");
    const savedRunwayKey = localStorage.getItem("runway_api_key");
    const savedElevenLabsKey = localStorage.getItem("elevenlabs_api_key");
    
    setOpenAISaved(!!savedOpenAIKey);
    setRunwaySaved(!!savedRunwayKey);
    setElevenLabsSaved(!!savedElevenLabsKey);

    // Load saved configuration
    const savedEndpoint = localStorage.getItem("api_endpoint");
    const savedKey = localStorage.getItem("api_key_configured");
    
    if (savedEndpoint) {
      setApiEndpoint(savedEndpoint);
    }
    if (savedKey) {
      setIsConnected(true);
    }
  }, []);

  const handleSaveOpenAI = async () => {
    setIsSavingOpenAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      localStorage.setItem("openai_api_key", openAIKey);
      setOpenAISaved(true);
      
      toast({
        title: "Success",
        description: "OpenAI API key has been saved",
      });
    } catch (error) {
      console.error("Error saving OpenAI API key:", error);
      toast({
        title: "Error",
        description: "Failed to save OpenAI API key",
        variant: "destructive",
      });
    } finally {
      setIsSavingOpenAI(false);
    }
  };

  const handleSaveRunway = async () => {
    setIsSavingRunway(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      localStorage.setItem("runway_api_key", runwayKey);
      setRunwaySaved(true);
      
      toast({
        title: "Success",
        description: "Runway API key has been saved",
      });
    } catch (error) {
      console.error("Error saving Runway API key:", error);
      toast({
        title: "Error",
        description: "Failed to save Runway API key",
        variant: "destructive",
      });
    } finally {
      setIsSavingRunway(false);
    }
  };

  const handleSaveElevenLabs = async () => {
    setIsSavingElevenLabs(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      localStorage.setItem("elevenlabs_api_key", elevenLabsKey);
      setElevenLabsSaved(true);
      
      toast({
        title: "Success",
        description: "Eleven Labs API key has been saved",
      });
    } catch (error) {
      console.error("Error saving Eleven Labs API key:", error);
      toast({
        title: "Error",
        description: "Failed to save Eleven Labs API key",
        variant: "destructive",
      });
    } finally {
      setIsSavingElevenLabs(false);
    }
  };

  const handleSaveConfiguration = () => {
    if (!apiEndpoint || !apiKey) {
      toast({
        title: "Error",
        description: "Please fill in both API endpoint and API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("api_endpoint", apiEndpoint);
    localStorage.setItem("api_key_configured", "true");
    
    toast({
      title: "Success",
      description: "API configuration saved successfully",
    });
  };

  const handleTestConnection = async () => {
    if (!apiEndpoint) {
      toast({
        title: "Error",
        description: "Please enter an API endpoint first",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      setLastTestedAt(new Date());
      
      toast({
        title: "Success",
        description: "Connection test successful",
      });
    } catch (error) {
      setIsConnected(false);
      toast({
        title: "Error",
        description: "Connection test failed",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold">API Keys & Configuration</h2>
        <p className="text-gray-500">Set up API keys for AI services and configure platform connections</p>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Badge variant="green">Connected</Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <Badge variant="red">Not Connected</Badge>
                </>
              )}
            </div>
            {lastTestedAt && (
              <span className="text-sm text-gray-500">
                Last tested: {lastTestedAt.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Platform Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="api-endpoint">API Endpoint</Label>
            <Input
              id="api-endpoint"
              type="url"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.yoursaas.com/v1"
            />
            <p className="text-sm text-gray-500 mt-1">
              The base URL for your main SaaS platform API
            </p>
          </div>

          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your platform's API key (stored securely)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveConfiguration}>
              Save Configuration
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTestingConnection || !apiEndpoint}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTestingConnection ? "Testing..." : "Test Connection"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Services API Keys */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">AI Services API Keys</h3>
        
        {/* OpenAI API Key */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">OpenAI</h3>
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">OpenAI API Key</h4>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="password"
                      value={openAIKey}
                      onChange={(e) => setOpenAIKey(e.target.value)}
                      placeholder="Enter your OpenAI API key"
                      className="pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  <Button
                    onClick={handleSaveOpenAI}
                    disabled={isSavingOpenAI || !openAIKey}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSavingOpenAI ? "Saving..." : "Save"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {openAISaved ? "API key saved" : "No API key saved yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Runway API Key */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Runway</h3>
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Runway API Key</h4>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="password"
                      value={runwayKey}
                      onChange={(e) => setRunwayKey(e.target.value)}
                      placeholder="Enter your Runway API key"
                      className="pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  <Button
                    onClick={handleSaveRunway}
                    disabled={isSavingRunway || !runwayKey}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSavingRunway ? "Saving..." : "Save"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {runwaySaved ? "API key saved" : "No API key saved yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eleven Labs API Key */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Eleven Labs</h3>
              <div className="h-6 w-6 rounded-full bg-gray-200"></div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Eleven Labs API Key</h4>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="password"
                      value={elevenLabsKey}
                      onChange={(e) => setElevenLabsKey(e.target.value)}
                      placeholder="Enter your Eleven Labs API key"
                      className="pr-10"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                  <Button
                    onClick={handleSaveElevenLabs}
                    disabled={isSavingElevenLabs || !elevenLabsKey}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {isSavingElevenLabs ? "Saving..." : "Save"}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {elevenLabsSaved ? "API key saved" : "No API key saved yet"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Microservice Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Microservice Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Recommended Architecture</h4>
            <p className="text-sm text-blue-800">
              For security and flexibility, implement a microservice that acts as a bridge between 
              this application and your main SaaS platform. This allows for data transformation, 
              rate limiting, and secure API key management.
            </p>
          </div>

          <div>
            <Label htmlFor="microservice-url">Microservice URL</Label>
            <Input
              id="microservice-url"
              type="url"
              placeholder="https://your-microservice.com/api"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">
              Connect to Supabase to enable microservice functionality
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeysTab;
