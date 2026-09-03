'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { WhyChooseUsData, WhyCard } from '@unseen-gadget/types';

interface LandingWhyChooseTabProps {
  data: WhyChooseUsData;
  onChange: (data: WhyChooseUsData) => void;
}

export function LandingWhyChooseTab({ data, onChange }: LandingWhyChooseTabProps) {
  const updateCard = (index: number, patch: Partial<WhyCard>) => {
    const nextCards = [...data.cards];
    nextCards[index] = { ...nextCards[index], ...patch };
    onChange({ ...data, cards: nextCards });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Section Headings</CardTitle>
          <CardDescription>Top kicker badge and main title for the Why Choose Us section.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Kicker Text (Small Tag)</label>
            <Input
              value={data.kicker || ''}
              onChange={(e) => onChange({ ...data, kicker: e.target.value })}
              placeholder="e.g. WHY CHOOSE UNSEEN GADGET"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Main Title</label>
            <Input
              value={data.title || ''}
              onChange={(e) => onChange({ ...data, title: e.target.value })}
              placeholder="e.g. Bangladesh's Trusted Online Store for Genuine Tech & Accessories"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {data.cards.map((card, idx) => (
          <Card key={idx} className="border-border bg-white shadow-xs">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-primary">Feature Card 0{idx + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Card Title</label>
                <Input
                  value={card.title}
                  onChange={(e) => updateCard(idx, { title: e.target.value })}
                  placeholder="Card Title"
                  className="text-xs font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Description</label>
                <Textarea
                  value={card.desc}
                  onChange={(e) => updateCard(idx, { desc: e.target.value })}
                  placeholder="Card Description"
                  rows={5}
                  className="text-xs leading-relaxed"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
