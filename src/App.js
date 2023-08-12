import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import AudioManager from "./components/AudioManager";
import ChatManager from "./components/ChatManager";
import { Button } from "./components/Helpers";

const AgentContext = createContext({});
export const useAgent = () => useContext(AgentContext);

const agentProfiles = [
  {
    name: "Goat",
    prompt: [
      {
        role: "system",
        content:
          "You are a telephone receptionist. Provide short and helpful answers as if you were speaking to a customer on the phone.",
      },
      {
        role: "assistant",
        content: "Hello, I'm Goat from Foundation. How can I help you?",
      },
    ],
  },
];

const AgentProvider = ({ children }) => {
  const [userMessage, setUserMessage] = useState("");
  const [canUserSpeak, setCanUserSpeak] = useState(false);

  const [agentProfile, setAgentProfile] = useState();

  const [apiKey, setApiKey] = useState();

  useEffect(() => {
    // save the api key to local storage
    if (apiKey) localStorage.setItem("apiKey", apiKey);
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) {
      const savedKey = localStorage.getItem("apiKey");
      if (savedKey) setApiKey(savedKey);
    }
  }, []);

  const providerValues = {
    userMessage,
    setUserMessage,
    canUserSpeak,
    setCanUserSpeak,
    agentProfile,
    apiKey,
  };
  return (
    <AgentContext.Provider value={providerValues}>
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="OpenAI API Key"
      />
      <div>
        {agentProfiles.map((profile) => (
          <Button onClick={() => setAgentProfile(profile)}>
            Call {profile.name}
          </Button>
        ))}
      </div>

      {apiKey && agentProfile && children}
    </AgentContext.Provider>
  );
};

function App() {
  return (
    <div className="App">
      <AgentProvider>
        <ChatManager />
        <AudioManager />
      </AgentProvider>
    </div>
  );
}

export default App;
