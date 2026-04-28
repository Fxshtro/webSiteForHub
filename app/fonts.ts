import { Jost, Unbounded } from "next/font/google";

export const jost = Jost({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jost",
  display: "swap",
});

export const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
  display: "swap",
});

export const fontVariables = `${jost.variable} ${unbounded.variable}`;
