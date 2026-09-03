'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { SeoBrandStoryData } from '@unseen-gadget/types';

interface LandingSeoTabProps {
  data: SeoBrandStoryData;
  onChange: (data: SeoBrandStoryData) => void;
}

export function LandingSeoTab({ data, onChange }: LandingSeoTabProps) {
  const section1 = data.section1 || { title: '', paragraph1: '', paragraph2: '' };
  const section2 = data.section2 || { title: '', paragraph1: '', paragraph2: '' };

  return (
    <div className="space-y-6">
      {/* Section 1 */}
      <Card className="border-border bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Story Section 1 (Top Paragraph)</CardTitle>
          <CardDescription>First SEO & brand introduction paragraph displayed at the bottom of homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-3xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Section Title</label>
            <Input
              value={section1.title || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  section1: { ...section1, title: e.target.value },
                })
              }
              placeholder="e.g. Welcome to Unseen Gadget"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Paragraph 1</label>
            <Textarea
              value={section1.paragraph1 || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  section1: { ...section1, paragraph1: e.target.value },
                })
              }
              rows={4}
              placeholder="Main introductory paragraph..."
              className="text-xs leading-relaxed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Paragraph 2 (Optional)</label>
            <Textarea
              value={section1.paragraph2 || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  section1: { ...section1, paragraph2: e.target.value },
                })
              }
              rows={3}
              placeholder="Secondary paragraph..."
              className="text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2 */}
      <Card className="border-border bg-white shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Story Section 2 (Bottom Paragraph)</CardTitle>
          <CardDescription>Second SEO block highlighting authenticity, nationwide delivery, and showrooms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 max-w-3xl">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Section Title</label>
            <Input
              value={section2.title || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  section2: { ...section2, title: e.target.value },
                })
              }
              placeholder="e.g. Why Shop With Us?"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Paragraph 1</label>
            <Textarea
              value={section2.paragraph1 || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  section2: { ...section2, paragraph1: e.target.value },
                })
              }
              rows={4}
              placeholder="Second story block paragraph..."
              className="text-xs leading-relaxed"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700">Paragraph 2 (Optional)</label>
            <Textarea
              value={section2.paragraph2 || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  section2: { ...section2, paragraph2: e.target.value },
                })
              }
              rows={3}
              placeholder="Additional conclusion text..."
              className="text-xs leading-relaxed"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
