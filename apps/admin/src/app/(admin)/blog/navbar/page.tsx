'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';

interface NavLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

const initialLinks: NavLink[] = [
  { id: '1', label: 'Home', url: '/', order: 1 },
  { id: '2', label: 'Shop', url: '/shop', order: 2 },
  { id: '3', label: 'Categories', url: '/categories', order: 3 },
  { id: '4', label: 'Contact', url: '/contact', order: 4 },
];

export default function NavbarPage() {
  const [links, setLinks] = useState<NavLink[]>(initialLinks);
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Navbar Management</h1>
          <p className="text-gray-500">Manage the top navigation links of your storefront.</p>
        </div>
        <Button onClick={() => setIsEditing(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Link
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Link</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsEditing(false); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Label</label>
                <Input placeholder="e.g. About Us" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input placeholder="e.g. /about" />
              </div>
              <div className="flex gap-4">
                <Button type="submit">Save Link</Button>
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
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.sort((a,b) => a.order - b.order).map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    </TableCell>
                    <TableCell className="font-medium">{link.label}</TableCell>
                    <TableCell className="text-gray-500">{link.url}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(link.id)}>
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
