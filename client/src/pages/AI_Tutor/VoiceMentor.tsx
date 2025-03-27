import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophoneLines, FaMicrophoneLinesSlash } from "react-icons/fa6";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

const VoiceMentor = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);
  const pauseTimeoutRef = useRef(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const getAI = async (question) => {
      console.log("Question:", question);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/aitutor/speak",
        { question }
      );
      console.log("AI Response:", response.data.response);
      setText(response.data.response);

      const speech = new SpeechSynthesisUtterance();
      speech.text = response.data.response;
      speech.volume = 1; // 0 to 1
      speech.rate = 1; // 0.1 to 10
      speech.pitch = 1; // 0 to 2

      window.speechSynthesis.speak(speech);
    };

    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onend = () => {
      setListening(false);
      clearTimeout(pauseTimeoutRef.current);
    };

    recognition.onresult = (event) => {
      clearTimeout(pauseTimeoutRef.current);

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      console.log("Final:", finalTranscript);
      console.log("Interim:", interimTranscript);

      const completeTranscript = finalTranscript + interimTranscript;
      setTranscript(completeTranscript);

      // Set a timeout to clear the transcript if no new result is detected within 1.5 seconds
      pauseTimeoutRef.current = setTimeout(async () => {
        await getAI(completeTranscript);
        setTranscript("");
      }, 1500); // Adjust the timeout duration as needed
    };
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      if (listening) {
        setTranscript(""); // Clear the transcript when starting
        recognitionRef.current.start();
      } else {
        recognitionRef.current.stop();
        setTranscript(""); // Ensure transcript is cleared when stopping
      }
    }
  }, [listening]);

  return (
    <>
      <div>
        <ScrollArea className="w-full h-[460px] rounded-md border">
          <div className="xl:p-4 p-1 lg:p-3 md:p-3 sm:p-2">
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={dracula}
                      PreTag="div"
                      language={match[1]}
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </Markdown>
          </div>
        </ScrollArea>
        <div className="flex gap-3">
          <div className="border rounded-full p-5 inline-block m-auto mt-3">
            {listening ? (
              <FaMicrophoneLines
                size={50}
                color="green"
                onClick={() => setListening((prev) => !prev)}
              />
            ) : (
              <FaMicrophoneLinesSlash
                size={50}
                color="red"
                onClick={() => setListening((prev) => !prev)}
              />
            )}
          </div>
          <p> {transcript}</p>
        </div>
      </div>
    </>
  );
};

export default VoiceMentor;
