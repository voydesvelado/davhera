import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { HandlApp } from "./components/HandlApp";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClearPath · A care guidance prototype · David Herrera Ramírez",
  robots: { index: false },
};

export default function HandlPage() {
  return (
    <div className={poppins.variable}>
      <HandlApp />
    </div>
  );
}
