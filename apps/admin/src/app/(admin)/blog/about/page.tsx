'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, Upload, X, ImageIcon, Info, Sparkles, Building2, Apple, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

import { useAdminAbout, useUpdateAdminAbout } from '@/hooks/use-admin-queries';
import { adminApiClient } from '@/lib/api';

interface AboutData {
  title: string;
  subtitle: string;
  coverImage?: string | null;
  story: string;
  appleStory?: string;
  deliveryStory?: string;
  vision: string;
  mission: string;
}

const emptyAbout: AboutData = {
  title: '',
  subtitle: '',
  coverImage: null,
  story: '',
  appleStory: '',
  deliveryStory: '',
  vision: '',
  mission: '',
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(emptyAbout);
  const { data: aboutRes, isLoading: loading } = useAdminAbout();
  const updateAboutMutation = useUpdateAdminAbout();
  const saving = updateAboutMutation.isPending;
  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!aboutRes) return;
    const raw = (aboutRes as any)?.data ?? aboutRes;
    if (raw && typeof raw === 'object') {
      setData((prev) => ({
        ...prev,
        ...raw,
      }));
    }
  }, [aboutRes]);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const res = await adminApiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const json = res.data;
      if (json.success && json.data?.url) {
        setData((prev) => ({ ...prev, coverImage: json.data.url }));
        toast.success('Cover image uploaded successfully');
      } else {
        toast.error(json.error || json.message || 'Failed to upload cover image');
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Cover image upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await updateAboutMutation.mutateAsync(data);
      if (res.success || res.data) {
        toast.success('About & 3-Column Story content saved successfully! Storefront will update immediately.');
      } else {
        throw new Error(res.error || res.message || 'Failed to save about content');
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to save about content');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="About Us & 3-Column Story CMS"
        description="Manage the 3 core story columns, hero cover image, vision and mission displayed on the storefront /about page."
        actions={
          <Button onClick={() => handleSave()} disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        }
      />

      <form onSubmit={handleSave} className="space-y-6">
        {/* Cover / Banner Image */}
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              Hero Cover Banner
            </CardTitle>
            <CardDescription>Featured background banner image displayed at the top of the About Us page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload(e.target.files)}
                style={{ display: 'none' }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? 'Uploading...' : 'Upload Cover Image'}
              </Button>
              <div className="flex flex-1 items-center gap-1 min-w-[240px]">
                <Input
                  type="text"
                  placeholder="Or paste image URL (https://...)"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs"
                  disabled={!imageUrlInput.trim()}
                  onClick={() => {
                    if (imageUrlInput.trim()) {
                      setData((prev) => ({ ...prev, coverImage: imageUrlInput.trim() }));
                      setImageUrlInput('');
                    }
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>

            {data.coverImage ? (
              <div className="relative mt-2 max-w-xl overflow-hidden rounded-xl border border-gray-200 shadow-xs">
                <img src={data.coverImage} alt="Cover Preview" className="h-52 w-full object-cover" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-7 w-7 rounded-full shadow-md"
                  onClick={() => setData({ ...data, coverImage: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-400">
                <ImageIcon className="h-4 w-4" />
                <span>No cover image uploaded yet. (Default dark gradient will be rendered).</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Page Headings */}
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              Page Headers
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Main Title</label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="e.g. About Unseen Gadget"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Subtitle / Tagline</label>
              <Input
                value={data.subtitle}
                onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                placeholder="e.g. Bangladesh's Most Trusted Destination for Apple & Gadgets"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── 3 STORY COLUMNS ── */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            3-Column Core Stories (Details Page Content)
          </h3>
          <p className="text-xs text-gray-500">
            These 3 stories power the 3-column philosophy cards on the About Us page.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Column 1: Welcome Story */}
          <Card className="border-border bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-600">
                <Sparkles className="h-4 w-4" />
                Column 1: Welcome Story
              </CardTitle>
              <CardDescription className="text-xs">Brand origin and commitment.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[180px] text-xs leading-relaxed"
                value={data.story}
                onChange={(e) => setData({ ...data, story: e.target.value })}
                placeholder="Write your welcome story..."
                required
              />
            </CardContent>
          </Card>

          {/* Column 2: Apple Ecosystem */}
          <Card className="border-border bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <Apple className="h-4 w-4" />
                Column 2: Apple Ecosystem
              </CardTitle>
              <CardDescription className="text-xs">Genuine Apple tech & warranty.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[180px] text-xs leading-relaxed"
                value={data.appleStory || ''}
                onChange={(e) => setData({ ...data, appleStory: e.target.value })}
                placeholder="Write Apple authenticity details..."
              />
            </CardContent>
          </Card>

          {/* Column 3: Express Delivery & Trust */}
          <Card className="border-border bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-600">
                <Truck className="h-4 w-4" />
                Column 3: Delivery & Guarantees
              </CardTitle>
              <CardDescription className="text-xs">64 districts delivery & replacement.</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[180px] text-xs leading-relaxed"
                value={data.deliveryStory || ''}
                onChange={(e) => setData({ ...data, deliveryStory: e.target.value })}
                placeholder="Write delivery & guarantee terms..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Vision & Mission */}
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Vision & Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Our Vision</label>
              <Textarea
                className="min-h-[100px] text-xs leading-relaxed"
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                placeholder="Our Vision..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Our Mission</label>
              <Textarea
                className="min-h-[100px] text-xs leading-relaxed"
                value={data.mission}
                onChange={(e) => setData({ ...data, mission: e.target.value })}
                placeholder="Our Mission..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button type="submit" disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}