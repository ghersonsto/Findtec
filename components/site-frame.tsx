import { AmbientOrbs } from "@/components/ambient-orbs";
import { HashScroll } from "@/components/hash-scroll";
import { LazyChatbot } from "@/components/lazy-chatbot";
import { Navbar } from "@/components/navbar";
import { ScrollProgress } from "@/components/scroll-progress";
import { Footer } from "@/components/sections/footer";
import { SiteProtection } from "@/components/security/site-protection";

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
      {/* Solo en build de producción; en localhost el componente no activa listeners. */}
      {process.env.NODE_ENV === "production" ? <SiteProtection /> : null}
    </div>
  );
}
