"use client";

import Logo from "@/components/Logo";
import Image from "next/image";
import { useEffect, useState } from "react";
// This is your custom hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
export default function Home() {
  const emotions: any = {
    anger: "😡",
    anticipation: "😬",
    disgust: "🤢",
    fear: "😱",
    joy: "😂",
    love: "😍",
    optimism: "😇",
    pessimism: "😒",
    sadness: "😢",
    surprise: "😲",
    trust: "🤗",
  };

  const [activeEmotions, setActiveEmotions] = useState<string[]>([]);

  const [note, setNote] = useState("");
  const debouncedNote = useDebounce(note, 500);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (debouncedNote) {
      // do your search or other side effects here
      setLoading(true);
      fetch("api/predict", {
        method: "POST",
        body: JSON.stringify({ text: debouncedNote }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data: number[]) => {
          // process the data
          const emotionKeys = Object.keys(emotions);
          const newActiveEmotions = [];
          for (let i = 0; i < data.length; i++) {
            if (data[i] > 0.5) {
              newActiveEmotions.push(emotionKeys[i]);
            }
          }

          setActiveEmotions(newActiveEmotions);
          setLoading(false);
        });
    } else {
      setActiveEmotions([]);
    }
  }, [debouncedNote]);

  return (
    <main className="flex min-h-screen  max-w-screen-sm flex-col items-center justify-between p-24 mx-auto">
      <div>
        <Logo />
      </div>
      <div className="min-w-full">
        <div className="flex gap-2 justify-center mb-4">
          {Object.keys(emotions).map((emotion) => (
            <div
              className="flex flex-col items-center justify-center"
              key={emotion}
            >
              <span
                className={`text-xl ${
                  activeEmotions.includes(emotion) ? "!text-5xl" : ""
                }`}
              >
                {emotions[emotion]}
              </span>
            </div>
          ))}
        </div>
        <div className="relative p-8 block w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-2xl animated-border overflow-hidden">
          {loading && (
            <div className="loader h-1 absolute w-full left-0 bottom-0"></div>
          )}
          <textarea
            id="message"
            rows={4}
            className="text-lg grow bg-transparent outline-none w-full"
            placeholder="Write your thoughts here..."
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>
        <div className="flex mt-6 justify-center">
          {activeEmotions.map((emotion) => (
            <div
              className="flex justify-center items-center m-1 px-2 py-1 border border-gray-300 rounded-full bg-gray-200 text-base text-gray-700 font-medium"
              key={emotion}
            >
              <div className="flex-initial max-w-full leading-none text-xs font-normal capitalize">
                {emotion}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]"></div>
    </main>
  );
}
