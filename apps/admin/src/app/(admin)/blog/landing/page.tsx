'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, LayoutTemplate, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';

import { useAdminLanding, useUpdateAdminLanding } from '@/hooks/use-admin-queries';
import type {
  LandingSectionMeta,
  WhyChooseUsData,
  SeoBrandStoryData,
  LandingCmsConfig,
} from '@unseen-gadget/types';

import { LandingSectionsTab } from './components/landing-sections-tab';
import { LandingWhyChooseTab } from './components/landing-why-choose-tab';
import { LandingSeoTab } from './components/landing-seo-tab';

const initialSections: LandingSectionMeta[] = [
  { id: 'hero', title: 'Hero Banners', isActive: true },
  { id: 'benefits', title: 'Benefits Bar', isActive: true },
  { id: 'categories', title: 'Shop by Category', isActive: true },
  { id: 'brands', title: 'Shop By Brand', isActive: true },
  { id: 'ipads', title: 'iPads', isActive: true },
  { id: 'new-arrival', title: 'New Arrival', isActive: true },
  { id: 'budget-tablets', title: 'Budget Tablets', isActive: true },
  { id: 'top-selling', title: 'Top Selling', isActive: true },
  { id: 'handpicked', title: 'Handpicked Products', isActive: true },
  { id: 'why-choose', title: 'Why Choose Us', isActive: true },
  { id: 'articles', title: 'Our Articles', isActive: true },
  { id: 'seo', title: 'Brand Story & SEO Text', isActive: true },
];

const emptyWhyChooseUs: WhyChooseUsData = {
  kicker: '',
  title: '',
  cards: [],
};

const emptySeoStory: SeoBrandStoryData = {
  section1: {
    title: '',
    paragraph1: '',
    paragraph2: '',
  },
  section2: {
    title: '',
    paragraph1: '',
    paragraph2: '',
  },
};

export default function LandingPage() {
  const [sections, setSections] = useState<LandingSectionMeta[]>(initialSections);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsData>(emptyWhyChooseUs);
  const [seoStory, setSeoStory] = useState<SeoBrandStoryData>(emptySeoStory);
  const [activeTab, setActiveTab] = useState<'visibility' | 'why' | 'seo'>('visibility');

  const { data: landingRes, isLoading: loading } = useAdminLanding();
  const updateLanding = useUpdateAdminLanding();
  const saving = updateLanding.isPending;

  useEffect(() => {
    if (!landingRes?.data) return;
    const raw = landingRes.data as any;

    const mergeSections = (saved: LandingSectionMeta[]) => {
      const savedMap = new Map(saved.map((s) => [s.id, s]));
      return initialSections.map((s) => {
        const existing = savedMap.get(s.id);
        return existing ? { ...s, isActive: existing.isActive } : s;
      });
    };

    if (Array.isArray(raw) && raw.length > 0) {
      setSections(mergeSections(raw));
    } else if (typeof raw === 'object') {
      if (Array.isArray(raw.sections) && raw.sections.length > 0) {
        setSections(mergeSections(raw.sections));
      }
      if (raw.whyChooseUs) {
        setWhyChooseUs(raw.whyChooseUs);
      }
      if (raw.seoStory) {
        setSeoStory(raw.seoStory);
      }
    }
  }, [landingRes]);

  const toggleSection = (id: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)));
  };

  const handleSave = async () => {
    try {
      const payload: LandingCmsConfig = {
        sections,
        whyChooseUs,
        seoStory,
      };

      const res = await updateLanding.mutateAsync(payload);
      if (res.success || res.data) {
        toast.success('Homepage CMS settings saved successfully! Storefront will update immediately.');
      } else {
        throw new Error(res.error || res.message || 'Failed to save sections');
      }
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || 'Failed to save sections');
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
    <div className="space-y-6">
      <PageHeader
        title="Home Page Layout & CMS"
        description="Enable/disable homepage sections, edit Why Choose Us cards, and customize the bottom SEO Brand Story text."
        actions={
          <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('visibility')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'visibility' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LayoutTemplate className="h-4 w-4" />
          Section Visibility (On/Off)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('why')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'why' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Why Choose Us (3 Cards)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'seo' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="h-4 w-4" />
          Brand Story & SEO Text
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'visibility' && (
        <LandingSectionsTab sections={sections} onToggle={toggleSection} />
      )}

      {activeTab === 'why' && (
        <LandingWhyChooseTab data={whyChooseUs} onChange={setWhyChooseUs} />
      )}

      {activeTab === 'seo' && (
        <LandingSeoTab data={seoStory} onChange={setSeoStory} />
      )}
    </div>
  );
}