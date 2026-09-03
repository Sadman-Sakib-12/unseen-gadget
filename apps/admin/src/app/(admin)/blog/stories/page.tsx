'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  Upload, X,
  ImageIcon,
  Sparkles,
  Apple,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';

import { useAdminStories, useUpdateAdminStories } from '@/hooks/use-admin-queries';
import { adminApiClient } from '@/lib/api';

const FRONTEND_BASE = process.env.NEXT_PUBLIC_STOREFRONT_URL ?? 'http://localhost:3000';

interface StoryItem {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  coverImage?: string | null;
  mainImage?: string | null;
  content: string;
  highlights: string[];
}

const createEmptyStory = (slug: string): StoryItem => ({
  slug,
  title: '',
  subtitle: '',
  excerpt: '',
  coverImage: null,
  mainImage: null,
  content: '',
  highlights: [],
});

export default function StoryPagesManager() {
  const [stories, setStories] = useState<Record<string, StoryItem>>({});
  const [activeSlug, setActiveSlug] = useState<string>('welcome');
  const { data: storiesRes, isLoading: loading } = useAdminStories();
  const updateStoriesMutation = useUpdateAdminStories();
  const saving = updateStoriesMutation.isPending;
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);

  const coverFileRef = useRef<HTMLInputElement>(null);
  const mainFileRef = useRef<HTMLInputElement>(null);

  const current: StoryItem = stories[activeSlug] || createEmptyStory(activeSlug);

  useEffect(() => {
    if (!storiesRes) return;
    const raw = (storiesRes as any)?.data ?? storiesRes;
    if (raw && typeof raw === 'object') {
      setStories(raw);
    }
  }, [storiesRes]);

  const updateCurrent = (patch: Partial<StoryItem>) => {
    setStories((prev) => ({
      ...prev,
      [activeSlug]: {
        ...current,
        ...patch,
      },
    }));
  };

  const handleUpload = async (file: File, type: 'cover' | 'main') => {
    const setUploading = type === 'cover' ? setUploadingCover : setUploadingMain;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await adminApiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const json = res.data;
      if (json.success && json.data?.url) {
        if (type === 'cover') {
          updateCurrent({ coverImage: json.data.url });
        } else {
          updateCurrent({ mainImage: json.data.url });
        }
        toast.success('Image uploaded successfully');
      } else {
        toast.error(json.error || json.message || 'Failed to upload image');
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await updateStoriesMutation.mutateAsync(stories);
      if (res.success || res.data) {
        toast.success('Story details pages saved successfully! Storefront will update immediately.');
      } else {
        throw new Error(res.error || res.message || 'Failed to save stories');
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to save stories');
    }
  };

  const addHighlight = () => {
    const list = current.highlights || [];
    updateCurrent({ highlights: [...list, 'New key highlight point'] });
  };

  const updateHighlight = (idx: number, val: string) => {
    const list = [...(current.highlights || [])];
    list[idx] = val;
    updateCurrent({ highlights: list });
  };

  const removeHighlight = (idx: number) => {
    const list = (current.highlights || []).filter((_, i) => i !== idx);
    updateCurrent({ highlights: list });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Homepage Stories & Details Pages CMS"
        description="Manage the 2 separate story sections on the homepage and their dedicated full details pages."
        actions={
          <div className="flex items-center gap-2">
            <a
              href={`${FRONTEND_BASE}/story/${activeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Preview Story Page
            </a>
            <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        }
      />

      {/* Story Switcher Tabs */}
      <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => setActiveSlug('welcome')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${activeSlug === 'welcome'
            ? 'bg-white text-indigo-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Sparkles className="h-4 w-4" />
          Story 1: Welcome Story (/story/welcome)
        </button>
        <button
          type="button"
          onClick={() => setActiveSlug('apple-products')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${activeSlug === 'apple-products'
            ? 'bg-white text-amber-600 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          <Apple className="h-4 w-4" />
          Story 2: Apple Products Story (/story/apple-products)
        </button>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Basic Info & Headings */}
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Story Headers & Excerpt</CardTitle>
            <CardDescription>
              Main title and short excerpt shown on the homepage and the top of the details page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Story Title</label>
              <Input
                value={current.title}
                onChange={(e) => updateCurrent({ title: e.target.value })}
                placeholder="Story Title"
                className="font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Subtitle / Tagline</label>
              <Input
                value={current.subtitle}
                onChange={(e) => updateCurrent({ subtitle: e.target.value })}
                placeholder="Subtitle for detail page header"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                Homepage Preview Excerpt (Short description under title on homepage)
              </label>
              <Textarea
                rows={3}
                value={current.excerpt}
                onChange={(e) => updateCurrent({ excerpt: e.target.value })}
                placeholder="Short summary displayed on the storefront homepage..."
                className="text-xs leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        {/* Images: Hero Cover & Story Main Image */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Cover Hero Banner Image */}
          <Card className="border-border bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Hero Cover Banner Image
              </CardTitle>
              <CardDescription className="text-xs">
                Background banner for the detail page header.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                type="file"
                accept="image/*"
                ref={coverFileRef}
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'cover')}
                style={{ display: 'none' }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingCover}
                  onClick={() => coverFileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs"
                >
                  {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Upload Image
                </Button>
                <Input
                  type="text"
                  placeholder="Or paste Image URL..."
                  value={current.coverImage || ''}
                  onChange={(e) => updateCurrent({ coverImage: e.target.value || null })}
                  className="h-8 text-xs flex-1"
                />
              </div>

              {current.coverImage ? (
                <div className="relative mt-2 overflow-hidden rounded-xl border border-gray-200">
                  <img src={current.coverImage} alt="Cover Preview" className="h-40 w-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full"
                    onClick={() => updateCurrent({ coverImage: null })}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
                  No cover banner image set.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Story Image */}
          <Card className="border-border bg-white shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                Main Story Featured Image
              </CardTitle>
              <CardDescription className="text-xs">
                Large photo displayed at the top of the article body.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                type="file"
                accept="image/*"
                ref={mainFileRef}
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'main')}
                style={{ display: 'none' }}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingMain}
                  onClick={() => mainFileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs"
                >
                  {uploadingMain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Upload Image
                </Button>
                <Input
                  type="text"
                  placeholder="Or paste Image URL..."
                  value={current.mainImage || ''}
                  onChange={(e) => updateCurrent({ mainImage: e.target.value || null })}
                  className="h-8 text-xs flex-1"
                />
              </div>

              {current.mainImage ? (
                <div className="relative mt-2 overflow-hidden rounded-xl border border-gray-200">
                  <img src={current.mainImage} alt="Main Image Preview" className="h-40 w-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 rounded-full"
                    onClick={() => updateCurrent({ mainImage: null })}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
                  No main story image set.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detailed Story Paragraphs */}
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <CardTitle className="text-base">Full Article & Story Content</CardTitle>
            <CardDescription>
              Complete multiline text displayed on the dedicated details page ({`/story/${activeSlug}`}).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={8}
              value={current.content}
              onChange={(e) => updateCurrent({ content: e.target.value })}
              placeholder="Write the full detailed story..."
              className="text-xs leading-relaxed"
            />
          </CardContent>
        </Card>

        {/* Key Highlights & Guarantees */}
        <Card className="border-border bg-white shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Key Highlights & Guarantees</CardTitle>
                <CardDescription>
                  Bullet points shown in the highlight card on the details page.
                </CardDescription>
              </div>
              <Button onClick={addHighlight} size="sm" variant="outline" className="flex items-center gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add Point
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {(current.highlights || []).map((hl, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <Input
                  value={hl}
                  onChange={(e) => updateHighlight(idx, e.target.value)}
                  placeholder="Highlight point text..."
                  className="text-xs bg-slate-50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-red-600 shrink-0"
                  onClick={() => removeHighlight(idx)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save button at bottom */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
