import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DemoRibbon } from "../_components/ui/DemoRibbon";
import { Sidebar, TabBar } from "../_components/product/doctor/DoctorNav";
import { DoctorTopBar } from "../_components/product/doctor/DoctorTopBar";

export const metadata: Metadata = {
  title: "Panel · Vera",
};

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--ink)",
      }}
    >
      <Sidebar />
      <DemoRibbon />
      <div
        className="vera-doc-content"
        style={{
          flex: 1,
          minWidth: 0,
          paddingLeft: "var(--px-mobile)",
          paddingRight: "var(--px-mobile)",
          paddingBottom: 88,
        }}
      >
        <div
          style={{
            maxWidth: "var(--max-dashboard)",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DoctorTopBar />
          {children}
        </div>
      </div>
      <TabBar />
      <style>{`
        @media (min-width: 640px) {
          .vera-doc-content {
            padding-left: var(--px-tablet);
            padding-right: var(--px-tablet);
          }
        }
        @media (min-width: 1024px) {
          .vera-doc-content {
            padding-left: var(--px-desktop);
            padding-right: var(--px-desktop);
            padding-bottom: var(--space-12);
          }
        }
      `}</style>
    </div>
  );
}
