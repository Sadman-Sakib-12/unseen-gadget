'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Phone, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { TablePanel } from '@/components/ui/table-panel';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { PageHeader } from '@/components/layout/page-header';
import { apiRequest } from '@/lib/api';

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
  const [supportPhone, setSupportPhone] = useState('');
  const [supportLabel, setSupportLabel] = useState('Support');
  const [savingContact, setSavingContact] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NavLink | null>(null);
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');

  // Load existing navbar and general settings
  useEffect(() => {
    Promise.all([
      apiRequest('/cms/navbar').catch(() => null),
      apiRequest('/cms/general').catch(() => null),
    ])
      .then(([navRes, genRes]) => {
        const navData = navRes?.data as any;
        const genData = genRes?.data as any;

        if (navData && typeof navData === 'object') {
          if (Array.isArray(navData)) {
            setLinks(navData);
          } else if (Array.isArray(navData.links)) {
            setLinks(navData.links);
          }
          if (navData.supportPhone) setSupportPhone(navData.supportPhone);
          if (navData.supportLabel) setSupportLabel(navData.supportLabel);
        }

        if (genData && typeof genData === 'object') {
          if (!supportPhone && (genData.supportPhone || genData.storePhone)) {
            setSupportPhone(genData.supportPhone || genData.storePhone);
          }
          if (genData.supportLabel) setSupportLabel(genData.supportLabel);
        }
      });
  }, []);

  const handleSaveSupportContact = async () => {
    setSavingContact(true);
    try {
      // 1. Update CMS Navbar
      await apiRequest('/cms/navbar', {
        method: 'PUT',
        body: JSON.stringify({
          supportPhone: supportPhone.trim(),
          supportLabel: supportLabel.trim() || 'Support',
          links,
        }),
      });

      // 2. Also sync to CMS General so both match 100%
      const genRes = await apiRequest('/cms/general').catch(() => null);
      const currentGen = (genRes?.data && typeof genRes.data === 'object') ? (genRes.data as any) : {};
      await apiRequest('/cms/general', {
        method: 'PUT',
        body: JSON.stringify({
          ...currentGen,
          supportPhone: supportPhone.trim(),
          supportLabel: supportLabel.trim() || 'Support',
          storePhone: supportPhone.trim() || currentGen.storePhone,
        }),
      }).catch(() => {});

      toast.success('Navbar Support Contact updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save support contact');
    } finally {
      setSavingContact(false);
    }
  };

  const persistLinks = async (updatedLinks: NavLink[]) => {
    setLinks(updatedLinks);
    try {
      await apiRequest('/cms/navbar', {
        method: 'PUT',
        body: JSON.stringify({
          supportPhone: supportPhone.trim(),
          supportLabel: supportLabel.trim() || 'Support',
          links: updatedLinks,
        }),
      });
    } catch (e) {
      console.error('Failed to sync navbar links to CMS:', e);
    }
  };

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

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) {
      toast.error('Label and URL are required');
      return;
    }
    if (editingLink) {
      const updated = links.map((l) =>
        l.id === editingLink.id ? { ...l, label: label.trim(), url: url.trim() } : l
      );
      void persistLinks(updated);
      toast.success('Link updated');
    } else {
      const nextOrder = links.length ? Math.max(...links.map((l) => l.order)) + 1 : 1;
      const updated = [
        ...links,
        { id: String(Date.now()), label: label.trim(), url: url.trim(), order: nextOrder },
      ];
      void persistLinks(updated);
      toast.success('Link added');
    }
    setIsEditing(false);
  };

  const handleDelete = (link: NavLink) => {
    const updated = links.filter((l) => l.id !== link.id);
    void persistLinks(updated);
    setDeleteTarget(null);
    toast.success('Link deleted');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Navbar Management"
        description="Manage the top navigation links and hotline/support phone of your storefront."
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add Link
          </Button>
        }
      />

      {/* ── Support Number / Hotline Card ── */}
      <Card className="border-primary/20 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Navbar Support Phone (হটলাইন নম্বর)</CardTitle>
              <CardDescription className="text-xs">
                This phone number and label are displayed in the header next to the search bar on desktop.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Support Phone Number (ফোন নম্বর)</label>
              <Input
                type="text"
                placeholder="e.g. +880 1886-054504"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Support Label (লেবেল)</label>
              <Input
                type="text"
                placeholder="e.g. Support or হটলাইন"
                value={supportLabel}
                onChange={(e) => setSupportLabel(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSaveSupportContact}
              disabled={savingContact}
              className="gap-2"
            >
              {savingContact ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Support Contact
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ── Navigation Links Table & Form ── */}
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingLink ? 'Edit Link' : 'Add New Link'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSaveLink}>
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