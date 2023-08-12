import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import AudioManager from "./components/AudioManager";
import ChatManager from "./components/ChatManager";

const AgentContext = createContext({});
export const useAgent = () => useContext(AgentContext);

const agentStates = ["idle", "listening", "thinking", "speaking"];

const AgentProvider = ({ children }) => {
  const [agentState, setAgentState] = useState(agentStates[0]);
  const [userMessage, setUserMessage] = useState("");
  const [canUserSpeak, setCanUserSpeak] = useState(false);

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
    agentState,
    setAgentState,
    userMessage,
    setUserMessage,
    canUserSpeak,
    setCanUserSpeak,
    apiKey,
  };
  return (
    <AgentContext.Provider value={providerValues}>
      {apiKey && children}
      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="OpenAI API Key"
      />
    </AgentContext.Provider>
  );
};

function App() {
  const [userMessage, setUserMessage] = useState("");
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
