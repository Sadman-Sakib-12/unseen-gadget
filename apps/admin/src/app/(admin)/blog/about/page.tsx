'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const [title, setTitle] = useState('About Unseen Gadget');
  const [content, setContent] = useState('We are a leading provider of premium gadgets...');
  const [vision, setVision] = useState('To be the best gadget store in the country.');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">About Us Content</h1>
          <p className="text-gray-500">Edit the information displayed on the About Us page.</p>
        </div>
        <Button>Save Content</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Page Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Content (Story)</label>
              <textarea 
                className="w-full min-h-[150px] p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b6e]"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Our Vision</label>
              <textarea 
                className="w-full min-h-[100px] p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1c2b6e]"
                value={vision}
                onChange={e => setVision(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 cursor-pointer hover:bg-gray-50">
                Click to upload cover image
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
