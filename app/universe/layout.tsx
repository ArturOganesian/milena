import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Milena's little universe",
  description: "A sky full of reasons, one for every star.",
};

export default function UniverseLayout({ children }: LayoutProps<"/universe">) {
  return children;
}
