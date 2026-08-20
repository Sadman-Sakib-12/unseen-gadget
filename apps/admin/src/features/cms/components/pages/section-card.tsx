"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SectionCardProps {
  title: string;
  description?: string;
  enabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  children: React.ReactNode;
}

export function SectionCard({
  title,
  description,
  enabled,
  onEnabledChange,
  children,
}: SectionCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-0.5">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {description ? (
            <p className="text-xs leading-relaxed text-gray-500">{description}</p>
          ) : null}
        </div>
        {typeof enabled === "boolean" && onEnabledChange ? (
          <Switch
            checked={enabled}
            onCheckedChange={onEnabledChange}
            aria-label={`Toggle ${title}`}
          />
        ) : null}
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  );
}