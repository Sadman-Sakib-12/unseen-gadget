import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Image, AlignLeft, LayoutTemplate, FileText, Sparkles } from 'lucide-react';

const cmsSections = [
  {
    title: 'Banners',
    description: 'Manage homepage hero banners and promotional images',
    icon: Image,
    href: '/blog/banners',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    title: 'Navbar',
    description: 'Edit navigation links and top menu items',
    icon: AlignLeft,
    href: '/blog/navbar',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    title: 'Landing Pages',
    description: 'Toggle and configure sections on the storefront homepage',
    icon: LayoutTemplate,
    href: '/blog/landing',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Story Pages',
    description: 'Manage the 2 homepage brand stories and their dedicated details pages',
    icon: Sparkles,
    href: '/blog/stories',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    title: 'Blog Posts',
    description: 'Write and publish articles for your customers',
    icon: FileText,
    href: '/blog/posts',
    color: 'text-pink-500',
    bg: 'bg-pink-50',
  },
  {
    title: 'Footer',
    description: 'Manage showroom addresses, social links, payments & link columns',
    icon: LayoutTemplate,
    href: '/cms/footer',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
];

export default function CMSDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Content Management System"
        description="Manage your storefront's dynamic content, banners, and layouts."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cmsSections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-gray-200">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className={`p-3 rounded-lg ${section.bg}`}>
                  <section.icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mt-2">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
