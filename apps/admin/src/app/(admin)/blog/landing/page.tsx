'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Section {
  id: string;
  title: string;
  isActive: boolean;
}

const initialSections: Section[] = [
  { id: 'hero', title: 'Hero Banners Slider', isActive: true },
  { id: 'categories', title: 'Featured Categories', isActive: true },
  { id: 'flash', title: 'Flash Sale (Countdown)', isActive: true },
  { id: 'new', title: 'New Arrivals', isActive: true },
  { id: 'brands', title: 'Top Brands', isActive: false },
  { id: 'newsletter', title: 'Newsletter Signup', isActive: true },
];

export default function LandingPage() {
  const [sections, setSections] = useState<Section[]>(initialSections);

  const toggleSection = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Landing Page Sections</h1>
          <p className="text-gray-500">Enable or disable sections on the storefront homepage.</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Homepage Layout</CardTitle>
          <p className="text-sm text-gray-500">Drag to reorder (Visual only for now) and toggle visibility.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="font-medium text-gray-900">{section.title}</div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${section.isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {section.isActive ? 'Visible' : 'Hidden'}
                  </span>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${section.isActive ? 'bg-[#1c2b6e]' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${section.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
