import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
}

/**
 * Page-level heading block: one h1 per view, optional plain-text eyebrow
 * (no decorative pill badges) and optional trailing actions.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, eyebrow, actions }) => {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
};
