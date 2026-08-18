'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TablePanel } from '@/components/ui/table-panel';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';

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
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const openAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setSubtitle('');
    setIsEditing(true);
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim()) {
      toast.error('Title and subtitle are required');
      return;
    }
    if (editingBanner) {
      setBanners(banners.map((b) => (b.id === editingBanner.id ? { ...b, title: title.trim(), subtitle: subtitle.trim() } : b)));
      toast.success('Banner updated');
    } else {
      const newBanner: Banner = {
        id: String(Date.now()),
        title: title.trim(),
        subtitle: subtitle.trim(),
        status: 'Draft',
      };
      setBanners([...banners, newBanner]);
      toast.success('Banner added');
    }
    setIsEditing(false);
  };

  const handleDelete = (banner: Banner) => {
    setBanners(banners.filter((b) => b.id !== banner.id));
    setDeleteTarget(null);
    toast.success('Banner deleted');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners Management"
        description="Add, edit, or remove hero banners from the storefront."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Banner
          </Button>
        }
      />

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="space-y-2">
                <label className="text-sm font-medium">Banner Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Flash Sale" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Get 20% off today" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image Upload</label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500">
                  Click to upload banner image (1920x1080 recommended)
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="submit">{editingBanner ? 'Save Changes' : 'Save Banner'}</Button>
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <TablePanel title="Banners" count={banners.length}>
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
                  <TableCell className="text-gray-500">{banner.subtitle}</TableCell>
                  <TableCell>
                    <StatusBadge status={banner.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(banner)} aria-label={`Edit banner ${banner.title}`}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-600" onClick={() => setDeleteTarget(banner)} aria-label={`Delete banner ${banner.title}`}>
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
        title="Delete banner"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}