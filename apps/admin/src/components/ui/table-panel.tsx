'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

interface TablePanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Card title shown in the panel header. */
  title?: React.ReactNode;
  /** Optional subtitle under the title. */
  description?: React.ReactNode;
  /** Rendered as a small count badge next to the title. */
  count?: number;
  /** Right-aligned controls: search, selects, actions. Wraps on narrow widths. */
  toolbar?: React.ReactNode;
  /** Footer slot: pagination, "Showing X of Y", summary rows. */
  footer?: React.ReactNode;
  /** Optional extra block between the header row and the table. */
  section?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The single table shell used across the admin so every list page shares the
 * same elevation, header rhythm, and density. Drop-in replacement for the
 * hand-rolled `div.rounded-xl.border` wrappers and the older `Card` lists.
 */
function TablePanel({
  title,
  description,
  count,
  toolbar,
  footer,
  section,
  children,
  className,
  ...props
}: TablePanelProps) {
  const hasHeader = title !== undefined || toolbar !== undefined;

  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      {hasHeader ? (
        <CardHeader className="gap-2.5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            {title !== undefined ? (
              <div className="flex min-w-0 items-center gap-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {count !== undefined ? <Badge variant="secondary">{count}</Badge> : null}
              </div>
            ) : null}
            {toolbar ? (
              <div className="flex flex-wrap items-center gap-2">{toolbar}</div>
            ) : null}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </CardHeader>
      ) : null}

      {section ? <div className="border-b border-gray-100 px-4 pb-4">{section}</div> : null}

      <CardContent className="p-0">{children}</CardContent>

      {footer ? (
        <div className="border-t border-gray-100 px-4 py-3">{footer}</div>
      ) : null}
    </Card>
  );
}

export { TablePanel };