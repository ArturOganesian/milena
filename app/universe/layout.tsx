import type { Metadata } from "next";
import { Great_Vibes } from "next/font/google";

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  title: "Milena's little universe",
  description: "One wedding, twelve reasons, one star for each.",
};

export default function UniverseLayout({ children }: LayoutProps<"/universe">) {
  return <div className={greatVibes.variable}>{children}</div>;
}
