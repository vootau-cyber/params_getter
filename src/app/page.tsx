"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    window.location.replace("/static/index.html");
  }, []);

  return <div style={{ display: "none" }} />;
}
