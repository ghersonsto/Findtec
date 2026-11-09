import { AmbientOrbs } from "@/components/ambient-orbs";
import { HashScroll } from "@/components/hash-scroll";
import { LazyChatbot } from "@/components/lazy-chatbot";
import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { Footer } from "@/components/sections/footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-surface relative min-h-screen overflow-x-hidden text-foreground">
      <AmbientOrbs />
      <ScrollProgress />
      <HashScroll />
      <div className="relative z-10">
        <Navbar />
        {children}
        <Footer />
        <LazyChatbot />
      </div>
    </div>
  );
}
