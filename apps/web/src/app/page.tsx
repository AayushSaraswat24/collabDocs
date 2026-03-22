"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Sparkles, Users, Send, ShieldCheck, Download } from "lucide-react";

// Typing effect Hook
function useTypingEffect(text: string, speed: number = 60) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

// Fade in up on scroll component
function AnimatedFeature({ children, delay }: { children: React.ReactNode, delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
    >
      {children}
    </div>
  );
}

export default function HomePage() {
  const heroText = "Real Time collaborative editor with AI";
  const typedHero = useTypingEffect(heroText, 50);

  const features = [
    {
      title: "AI Powered Editor",
      desc: "Elevate your writing process with built-in AI tools. Summarize quickly, rewrite intelligently, and generate ideas on the fly.",
      icon: <Sparkles className="h-6 w-6 text-indigo-500" />
    },
    {
      title: "Real Time Collaboration with Cursor",
      desc: "Work together seamlessly. See team members' live cursors and changes in real-time as you co-create documents.",
      icon: <Users className="h-6 w-6 text-sky-500" />
    },
    {
      title: "Easily Invite Others with Email",
      desc: "Bring your team in securely and instantly. Just add an email address to send a direct collaborative invitation.",
      icon: <Send className="h-6 w-6 text-emerald-500" />
    },
    {
      title: "Role Based Access",
      desc: "Maintain absolute control over your workspace by assigning precise permissions like Owner, Editor, or Viewer.",
      icon: <ShieldCheck className="h-6 w-6 text-amber-500" />
    },
    {
      title: "Easy to Export",
      desc: "Take your work anywhere. Export perfectly formatted documents to PDF, Markdown, or plain text in just one click.",
      icon: <Download className="h-6 w-6 text-rose-500" />
    }
  ];

  return (
    <main className="flex-1 overflow-x-hidden bg-background font-sans text-foreground">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Subtle Warm Orange Gradient Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] h-[60vh] bg-gradient-to-br from-amber-500/25 via-orange-400/15 to-transparent dark:from-amber-500/15 dark:via-orange-500/10 blur-[120px] rounded-[100%] pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto z-10 flex flex-col items-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-8 min-h-[140px] md:min-h-[200px] leading-[1.1] max-w-4xl">
            {typedHero}
            <span className="font-light animate-pulse inline-block opacity-50 ml-1 text-primary">|</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[2500ms] fill-mode-both">
            A minimalist workspace designed for speed, focus, and ultimate team synergy. Create and collaborate powerfully.
          </p>

          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[2700ms] fill-mode-both">
            <Link
              href="/docs"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_40px_-10px_var(--color-primary)] dark:shadow-[0_0_30px_-5px_var(--color-primary)]"
            >
              Start here <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-32 px-4 border-t border-border/40 bg-muted/20">
        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-24 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Powerful features, zero distractions.
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Equipped with everything your team needs to write and edit dynamically without leaving the document.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, idx) => (
              <AnimatedFeature key={idx} delay={idx * 150}>
                <div className="group h-full p-8 rounded-3xl border border-border/50 bg-background/50 backdrop-blur-md shadow-sm hover:shadow-xl dark:shadow-none hover:border-primary/40 active:scale-[0.98] transition-all duration-500 overflow-hidden relative">
                  {/* Subtle hover gradient inside card */}
                  <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="mb-6 p-4 rounded-2xl bg-muted inline-flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-foreground tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </AnimatedFeature>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="relative py-40 px-4 text-center overflow-hidden border-t border-border/40">
        {/* Bottom Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[600px] h-[300px] bg-gradient-to-t from-primary/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto z-10">
          <h2 className="text-4xl md:text-6xl font-black text-foreground mb-8 tracking-tighter">
            Elevate your collaboration
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 font-medium">
            Jump into the workspace and start creating together right now.
          </p>

          <Link
            href="/docs"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-semibold text-primary-foreground bg-foreground dark:bg-primary rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl"
          >
            Go to Docs <ArrowRight className="h-6 w-6 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </section>

    </main>
  );
}