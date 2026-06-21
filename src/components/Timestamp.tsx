"use client";
import { useState, useEffect } from "react";

export default function Timestamp() {
  const [t, setT] = useState("");
  useEffect(() => {
    setT(
      new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
        dateStyle: "medium",
        timeStyle: "short",
      })
    );
  }, []);
  if (!t) return null;
  return <span className="text-[#aeaeb2]">{t} ET</span>;
}
