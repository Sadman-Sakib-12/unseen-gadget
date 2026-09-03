import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProductSpecsSectionProps {
  specifications: Record<string, string | undefined>;
  specKey: string;
  setSpecKey: (val: string) => void;
  specValue: string;
  setSpecValue: (val: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
}

export function ProductSpecsSection({
  specifications,
  specKey,
  setSpecKey,
  specValue,
  setSpecValue,
  onAdd,
  onRemove,
}: ProductSpecsSectionProps) {
  const entries = Object.entries(specifications).filter(([, val]) => val !== undefined);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-900">Specifications</h4>
      </div>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-500">No specifications added yet.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50/50 px-3 py-2"
            >
              <p className="text-sm text-gray-700">
                <span className="font-medium">{key}:</span> {value}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => onRemove(key)}
                aria-label={`Remove specification ${key}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2">
        <Input
          type="text"
          placeholder="Key (e.g. Display)"
          className="min-w-0"
          value={specKey}
          onChange={(e) => setSpecKey(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Value (e.g. 6.1 inch)"
          className="min-w-0"
          value={specValue}
          onChange={(e) => setSpecValue(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onAdd}
          aria-label="Add specification"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
