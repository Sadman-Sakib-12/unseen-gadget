'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/layout/page-header';

interface Section {
  id: string;
  title: string;
  isActive: boolean;
}

const initialSections: Section[] = [
  { id: 'hero', title: 'Hero Banners', isActive: true },
  { id: 'benefits', title: 'Benefits Bar', isActive: true },
  { id: 'categories', title: 'Shop by Category', isActive: true },
  { id: 'brands', title: 'Shop By Brand', isActive: true },
  { id: 'ipads', title: 'iPads', isActive: true },
  { id: 'new-arrival', title: 'New Arrival', isActive: true },
  { id: 'budget-tablets', title: 'Budget Tablets', isActive: true },
  { id: 'top-selling', title: 'Top Selling', isActive: true },
  { id: 'handpicked', title: 'Handpicked Products', isActive: true },
  { id: 'why-choose', title: 'Why Choose Us', isActive: true },
  { id: 'articles', title: 'Our Articles', isActive: true },
  { id: 'seo', title: 'SEO Text', isActive: true },
];

export default function LandingPage() {
  const [sections, setSections] = useState<Section[]>(initialSections);

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleSave = () => {
    toast.success('Landing page layout saved');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Home Page Sections"
        description="Enable or disable sections on the storefront homepage."
        actions={
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Homepage Layout</CardTitle>
          <p className="text-sm text-gray-500">Drag to reorder (visual only for now) and toggle visibility.</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-4"
              >
                <div className="font-medium text-gray-900">{section.title}</div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${section.isActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {section.isActive ? 'Visible' : 'Hidden'}
                  </span>
                  <Switch
                    checked={section.isActive}
                    onCheckedChange={() => toggleSection(section.id)}
                    aria-label={`Toggle ${section.title}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}