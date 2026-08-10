'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  status: 'Active' | 'Draft';
}

const initialBanners: Banner[] = [
  { id: '1', title: 'Eid Mega Sale', subtitle: 'Up to 50% off on all gadgets', status: 'Active' },
  { id: '2', title: 'iPhone 15 Pro Launch', subtitle: 'Pre-order now and get free airpods', status: 'Draft' },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Banners Management</h1>
          <p className="text-gray-500">Add, edit, or remove hero banners from the storefront.</p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Banner
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Banner</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Banner Title</label>
                <Input placeholder="e.g. Flash Sale" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input placeholder="e.g. Get 20% off today" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500 cursor-pointer hover:bg-gray-50">
                  Click to upload banner image (1920x1080 recommended)
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit">Save Banner</Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell className="font-medium">{banner.title}</TableCell>
                    <TableCell>{banner.subtitle}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${banner.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {banner.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
