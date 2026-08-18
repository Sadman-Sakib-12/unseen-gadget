'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TablePanel } from '@/components/ui/table-panel';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';

interface NavLink {
  id: string;
  label: string;
  url: string;
  order: number;
}

const initialLinks: NavLink[] = [
  { id: '1', label: 'Terms & Conditions', url: '/terms', order: 1 },
  { id: '2', label: 'Delivery & Return', url: '/delivery-return', order: 2 },
  { id: '3', label: 'Privacy Policy', url: '/privacy', order: 3 },
  { id: '4', label: 'Our Blogs', url: '/blog', order: 4 },
  { id: '5', label: 'Our Contacts', url: '/contact', order: 5 },
];

export default function NavbarPage() {
  const [links, setLinks] = useState<NavLink[]>(initialLinks);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NavLink | null>(null);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  const openAdd = () => {
    setEditingLink(null);
    setLabel('');
    setUrl('');
    setIsEditing(true);
  };

  const openEdit = (link: NavLink) => {
    setEditingLink(link);
    setLabel(link.label);
    setUrl(link.url);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) {
      toast.error('Label and URL are required');
      return;
    }
    if (editingLink) {
      setLinks(links.map((l) => (l.id === editingLink.id ? { ...l, label: label.trim(), url: url.trim() } : l)));
      toast.success('Link updated');
    } else {
      const nextOrder = links.length ? Math.max(...links.map((l) => l.order)) + 1 : 1;
      setLinks([...links, { id: String(Date.now()), label: label.trim(), url: url.trim(), order: nextOrder }]);
      toast.success('Link added');
    }
    setIsEditing(false);
  };

  const handleDelete = (link: NavLink) => {
    setLinks(links.filter((l) => l.id !== link.id));
    setDeleteTarget(null);
    toast.success('Link deleted');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Navbar Management"
        description="Manage the top navigation links of your storefront."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        }
      />

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Link Label</label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. About Us" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL</label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="e.g. /about" />
              </div>
              <div className="flex gap-4">
                <Button type="submit">{editingLink ? 'Save Changes' : 'Save Link'}</Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <TablePanel title="Navigation Links" count={links.length}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Order</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...links].sort((a, b) => a.order - b.order).map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="text-gray-400">{link.order}</TableCell>
                  <TableCell className="font-medium">{link.label}</TableCell>
                  <TableCell className="text-gray-500">{link.url}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(link)} aria-label={`Edit link ${link.label}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setDeleteTarget(link)} aria-label={`Delete link ${link.label}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TablePanel>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete link"
        description={`Are you sure you want to delete "${deleteTarget?.label}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}