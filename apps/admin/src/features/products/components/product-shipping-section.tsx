import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ProductShippingSectionProps {
  shippingType: 'FREE' | 'PAID';
  shippingCost: number;
  onShippingTypeChange: (type: 'FREE' | 'PAID') => void;
  onShippingCostChange: (cost: number) => void;
}

export function ProductShippingSection({
  shippingType,
  shippingCost,
  onShippingTypeChange,
  onShippingCostChange,
}: ProductShippingSectionProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Shipping Configuration</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700">Shipping Type</label>
          <Select
            value={shippingType}
            onChange={(e) => {
              const val = e.target.value as 'FREE' | 'PAID';
              onShippingTypeChange(val);
            }}
            options={[
              { value: 'FREE', label: 'Free Shipping' },
              { value: 'PAID', label: 'Paid Shipping' },
            ]}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700">Shipping Cost (BDT)</label>
          <Input
            type="number"
            min="0"
            value={shippingCost}
            disabled={shippingType === 'FREE'}
            onChange={(e) => onShippingCostChange(Number(e.target.value))}
            placeholder={shippingType === 'FREE' ? '0 (Free)' : 'e.g. 100'}
            required={shippingType === 'PAID'}
          />
        </div>
      </div>
    </div>
  );
}
