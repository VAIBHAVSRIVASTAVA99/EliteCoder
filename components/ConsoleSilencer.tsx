"use client"

import { useEffect } from "react"

export default function ConsoleSilencer() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const noop = () => {};
      console.log = noop;
      console.error = noop;
      console.warn = noop;
      console.info = noop;
      console.debug = noop;
    }
  }, []);
  return null;
}
