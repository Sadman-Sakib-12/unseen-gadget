'use client';

import { useRef, useState } from 'react';
import { Plus, Upload, ImageIcon, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { adminApiClient } from '@/lib/api';
import { toast } from 'sonner';

interface ProductMediaCardProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export function ProductMediaCard({ images, setImages }: ProductMediaCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (images.includes(trimmed)) {
      toast.error('Image URL already added');
      return;
    }
    setImages((prev) => [...prev, trimmed]);
    setImageUrlInput('');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    try {
      const res = await adminApiClient.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url || res.data?.data?.url;
      if (url) {
        setImages((prev) => [...prev, url]);
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Upload succeeded but no image URL returned');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Image upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-gray-200 bg-white shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-gray-900">
          <ImageIcon className="h-4 w-4 text-primary" />
          Product Images
        </CardTitle>
        <CardDescription className="text-xs">
          Upload images or paste direct URLs. The first image will be used as the primary thumbnail.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Input
            className="flex-1 min-w-[240px]"
            placeholder="Paste image URL (https://...)"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAddImageUrl}>
            <Plus className="h-4 w-4 mr-1" /> Add URL
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-1" /> Upload File
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center bg-gray-50/50">
            <ImageIcon className="h-8 w-8 text-gray-300 mb-1" />
            <p className="text-xs text-gray-500">No images added yet.</p>
            <p className="text-[11px] text-gray-400">Add an image URL or upload an image file above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Product ${idx + 1}`}
                  className="h-full w-full object-contain p-2"
                />
                {idx === 0 && (
                  <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-xs opacity-0 transition group-hover:opacity-100 hover:bg-red-700"
                  title="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
