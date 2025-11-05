"use client";

import { useState } from "react";

export default function LoginPage() {
  const [pin, setPin] = useState("");

  const handleClick = (num: string) => {
    if (pin.length < 4) setPin(pin + num);
  };

  const handleClear = () => setPin("");
  const handleSubmit = () => {
    alert(`Entered PIN: ${pin}`);
    // TODO: Call API or DB check here
    setPin("");
  };

  const buttons = ["1","2","3","4","5","6","7","8","9","0"];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="flex flex-col items-center gap-6 rounded-lg bg-white p-8 shadow-md dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold text-black dark:text-white">
          Enter PIN
        </h1>

        {/* Display entered PIN as dots */}
        <div className="text-3xl font-mono tracking-widest text-zinc-700 dark:text-zinc-200">
          {pin.replace(/./g, "•") || "------"}
        </div>

        {/* Numeric keypad */}
        <div className="grid grid-cols-3 gap-4">
          {buttons.slice(0, 9).map((num) => (
            <button
              key={num}
              onClick={() => handleClick(num)}
              className="h-16 w-16 rounded-md bg-gray-200 text-xl font-bold text-black shadow-sm hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:text-white"
            >
              {num}
            </button>
          ))}
          <div></div> {/* empty spacer */}
          <button
            onClick={() => handleClick("0")}
            className="h-16 w-16 rounded-md bg-gray-200 text-xl font-bold text-black shadow-sm hover:bg-gray-300 active:bg-gray-400 dark:bg-zinc-700 dark:text-white"
          >
            0
          </button>
          <button
            onClick={handleClear}
            className="h-16 w-16 rounded-md bg-red-500 text-xl font-bold text-white hover:bg-red-600 active:bg-red-700"
          >
            C
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-32 rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
