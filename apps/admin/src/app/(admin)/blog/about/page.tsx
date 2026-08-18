'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

export default function AboutPage() {
  const [title, setTitle] = useState('About Unseen Gadget');
  const [content, setContent] = useState('We are a leading provider of premium gadgets...');
  const [vision, setVision] = useState('To be the best gadget store in the country.');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('About page content saved');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="About Us Content"
        description="Edit the information displayed on the About Us page."
        actions={
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Content
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSave}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Content (Story)</label>
              <Textarea
                className="min-h-[150px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Our Vision</label>
              <Textarea
                className="min-h-[100px]"
                value={vision}
                onChange={(e) => setVision(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                Click to upload cover image
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}