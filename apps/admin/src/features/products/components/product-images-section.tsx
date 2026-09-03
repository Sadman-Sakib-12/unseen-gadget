import { useRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductImagesSectionProps {
  productImages: string[];
  setProductImages: (images: string[]) => void;
  imageUrlInput: string;
  setImageUrlInput: (val: string) => void;
  uploadingImage: boolean;
  onImageAdd: (files: FileList) => void;
  onAddImageUrl: () => void;
}

export function ProductImagesSection({
  productImages,
  setProductImages,
  imageUrlInput,
  setImageUrlInput,
  uploadingImage,
  onImageAdd,
  onAddImageUrl,
}: ProductImagesSectionProps) {
  const productImageRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-700">Product images</label>
      <div className="space-y-3">
        {productImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {productImages.map((img, idx) => (
              <div key={idx} className="relative group h-14 w-14 border rounded overflow-hidden">
                <img
                  src={img}
                  alt={`Product ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-0 m-auto h-6 w-6 rounded-full bg-red-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setProductImages(productImages.filter((_, i) => i !== idx))}
                  aria-label="Remove image"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="file"
            multiple
            accept="image/*"
            ref={productImageRef}
            onChange={(e) => {
              if (e.target.files) onImageAdd(e.target.files);
            }}
            style={{ display: 'none' }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => productImageRef.current?.click()}
            disabled={uploadingImage}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            {uploadingImage ? 'Uploading...' : 'Upload Image'}
          </Button>

          <div className="flex flex-1 items-center gap-1.5 min-w-[200px]">
            <Input
              type="text"
              placeholder="Or paste image URL..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddImageUrl();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={onAddImageUrl}
              disabled={!imageUrlInput.trim()}
            >
              Add URL
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
