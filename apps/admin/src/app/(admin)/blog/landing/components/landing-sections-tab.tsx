'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { LandingSectionMeta } from '@unseen-gadget/types';

interface LandingSectionsTabProps {
  sections: LandingSectionMeta[];
  onToggle: (id: string) => void;
}

export function LandingSectionsTab({ sections, onToggle }: LandingSectionsTabProps) {
  return (
    <Card className="border-border bg-white shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Homepage Sections Visibility</CardTitle>
        <CardDescription>Toggle on or off any section displayed on the storefront landing page.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 transition-all hover:bg-gray-50"
            >
              <div className="font-medium text-sm text-gray-900">{section.title}</div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold ${section.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {section.isActive ? 'Visible' : 'Hidden'}
                </span>
                <Switch
                  checked={section.isActive}
                  onCheckedChange={() => onToggle(section.id)}
                  aria-label={`Toggle ${section.title}`}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
