"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isToggled, setIsToggled] = React.useState(false);

  // Sync body class with dark mode
  React.useEffect(() => {
    if (isToggled) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isToggled]);

  return (
    <Button
      size="icon"
      className="rounded-full text-white bg-primary shadow-none "
      onClick={() => setIsToggled(!isToggled)}
    >
      {isToggled ? <Sun fill="white" />:<Moon fill="white" />}
    </Button>
  );
}
