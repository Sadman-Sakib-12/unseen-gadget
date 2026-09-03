"use client";

import { ShoppingCart } from "lucide-react";

export interface WhyChooseData {
  kicker: string;
  title: string;
  cards: {
    icon: any;
    title: string;
    desc: string;
  }[];
}

interface WhyChooseSectionProps {
  data: WhyChooseData | null;
  containerClass?: string;
}

export function WhyChooseSection({
  data,
  containerClass = "mx-auto w-full max-w-[1440px] px-4",
}: WhyChooseSectionProps) {
  if (!data) return null;

  return (
    <section className="border-t border-border py-6">
      <div className={containerClass}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {data.kicker}
        </p>
        <h2 className="mt-1.5 max-w-xl text-[20px] font-bold leading-snug text-foreground">
          {data.title}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.cards.map((card) => {
            const Icon = card.icon || ShoppingCart;
            return (
              <div
                key={card.title}
                className="card-surface p-5 border-l-4 border-l-primary/60"
              >
                <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mt-3 text-[13px] font-bold text-foreground">{card.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
