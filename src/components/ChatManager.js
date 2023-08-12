import React, { useEffect, useRef, useState } from "react";
import { useAgent } from "../App";

const ChatManager = ({}) => {
  const {
    userMessage: voiceMessage,
    setCanUserSpeak,
    agentProfile,
    apiKey,
  } = useAgent();

  const [message, setMessage] = useState("");
  const [streamedResponse, setStreamedResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const controllerRef = useRef(null); // Store the AbortController instance

  useEffect(() => {
    if (agentProfile) setChatHistory(agentProfile.prompt);
  }, [agentProfile]);
  useEffect(() => {
    if (voiceMessage) {
      setMessage(voiceMessage);
      handleSubmit(voiceMessage);
    }
  }, [voiceMessage]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (newMessage) => {
    controllerRef.current = new AbortController();
    const signal = controllerRef.current.signal;

    // Append the new message to the chat history
    setChatHistory([...chatHistory, { role: "user", content: newMessage }]);

    try {
      // Make the API request
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: chatHistory.concat([
              { role: "user", content: newMessage },
            ]),
            max_tokens: 50,
            stream: true, // For streaming responses
          }),
          signal, // Pass the signal to the fetch request
        }
      );

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      var finalResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // Massage and parse the chunk of data
        const chunk = decoder.decode(value);

        const lines = chunk.split("\n");
        const parsedLines = lines
          .map((line) => line.replace(/^data: /, "").trim())
          .filter((line) => line !== "" && line !== "[DONE]")
          .map((line) => JSON.parse(line));

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          const { delta } = choices[0];
          const { content } = delta;
          // Update the UI with the new content
          if (content) {
            console.log(content);
            finalResponse += content;
            setStreamedResponse(
              (streamedResponse) => streamedResponse + content
            );
          }
        }
      }

      setStreamedResponse("");
      setChatHistory((chatHistory) => [
        ...chatHistory,
        { role: "assistant", content: finalResponse },
      ]);

      doSpeechSynthesis(finalResponse, () => {
        setCanUserSpeak(true);
      });
      // setCanUserSpeak(true);
    } catch (error) {
      console.error("Error calling GPT-3 API:", error);
    }

    // Clear the input field
    setMessage("");
  };

  return (
    <div>
      <div className="flex flex-col">
        {chatHistory.map(({ role, content }, index) => (
          <div key={index} className="flex w-full">
            <div className="w-[90px] shrink-0 font-bold capitalize">
              {role}:
            </div>
            <div className="flex text-left">{content}</div>
          </div>
        ))}
      </div>

      {/* streamed response */}

      <div>{streamedResponse}</div>
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(message);
        }}
        className="flex justify-center items-center border-2 border-gray-300 rounded-md mx-4 my-4"
      >
        <textarea
          type="text"
          placeholder="Type a message..."
          className={"h-18 flex-grow"}
          value={message}
          onChange={handleMessageChange}
        />
        <button className={"h-18"} type="submit">
          Send
        </button>
      </form> */}
    </div>
  );
};

export function doSpeechSynthesis(text, callback) {
  if ("speechSynthesis" in window) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[0];
    msg.rate = 0.8;
    msg.pitch = 2;
    msg.text = text;
    msg.onend = function (e) {
      callback && callback();
    };
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
  }
}

export default ChatManager;
