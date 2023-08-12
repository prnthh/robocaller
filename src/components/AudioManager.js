import { useWhisper } from "@chengsokdara/use-whisper";
import { useEffect, useState } from "react";
import { IconRecordFill, IconSpeech_typing } from "./icons";
import { useAgent } from "../App";
import { Button } from "./Helpers";

export default function AudioManager({}) {
  const { apiKey, setUserMessage, canUserSpeak, setCanUserSpeak } = useAgent();

  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: apiKey,
    removeSilence: true,
    // nonStop: true,
    // stopTimeout: 3000,
    // streaming: true,
    // timeSlice: 1_000, // 1 second
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    if (transcript.text) setUserMessage(transcript.text);
  }, [transcript]);

  // cheap cutoff for when the user stops speaking

  const [startedSpeaking, setStartedSpeaking] = useState(false);
  useEffect(() => {
    if (speaking && !startedSpeaking) {
      setStartedSpeaking(true);
      speechSynthesis.cancel();
    }
    if (!speaking && startedSpeaking) {
      setStartedSpeaking(false);
      stopRecording();
    }
  }, [speaking]);

  useEffect(() => {
    if (canUserSpeak && !recording) {
      startRecording();
      setCanUserSpeak(false);
    }
  }, [canUserSpeak]);

  return (
    <div>
      <div className="flex justify-center">
        {
          <IconRecordFill
            className={`${recording ? "text-red-500" : "text-black/5"}`}
          />
        }
        {
          <IconSpeech_typing
            className={`${speaking ? "text-sky-500" : "text-black/5"}`}
          />
        }
        {transcribing && " Transcribing "}
        {error && JSON.stringify(error)}
      </div>
      <Button onClick={() => startRecording()}>Start</Button>
      {/* <Button onClick={() => pauseRecording()}>Pause</Button> */}
      <Button onClick={() => stopRecording()}>Stop</Button>
    </div>
  );
}
