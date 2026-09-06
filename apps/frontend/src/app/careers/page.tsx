"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, ChevronRight, Users, Zap, Heart, Send } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import { apiRequest } from "@/lib/api";
import { ApplyModal, type JobOpening } from "./apply-modal";

const perks = [
  { icon: Zap, label: "Competitive Salary", desc: "We pay above market rate" },
  { icon: Users, label: "Great Team", desc: "Work with passionate people" },
  { icon: Heart, label: "Work-Life Balance", desc: "Flexible working hours" },
  { icon: Briefcase, label: "Growth", desc: "Fast-track your career" },
];

export default function CareersPage() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  useEffect(() => {
    apiRequest("/job")
      .then((res) => {
        setJobs(res.data || []);
      })
      .catch(() => {
        setJobs([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div className="border-b border-border">
        <div className="container-gadget">
          <nav className="flex items-center gap-1.5 py-3 text-xs text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-primary">{t("shop.breadcrumbHome")}</Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground">{t("careers.title")}</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-br from-primary-800 via-primary to-primary-600 py-14">
        <div className="container-gadget text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            <Briefcase className="h-3.5 w-3.5" />
            {t("careers.kicker")}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-white">
            {t("careers.heading")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
            {t("careers.subtitle")}
          </p>
        </div>
      </div>

      <section className="border-b border-border bg-card">
        <div className="container-gadget">
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {perks.map((p) => (
              <div key={p.label} className="flex flex-col items-center bg-card py-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <p.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{p.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-10">
        <div className="container-gadget">
          <h2 className="mb-6 text-lg font-bold text-foreground">{t("careers.openPositions")}</h2>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-lg bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                          {job.department || "General"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {job.type || "Full-time"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {job.location}
                        </span>
                      </div>
                      <h3 className="mt-2 text-base font-bold text-foreground">{job.title}</h3>
                      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{job.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="btn-primary shrink-0"
                    >
                      {t("careers.applyNow")}
                    </button>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card py-10 text-center">
                  <p className="text-sm text-muted-foreground">No open positions at the moment. Check back later!</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-dashed border-border bg-card p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-foreground">{t("careers.noFit")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("careers.noFitHint", { email: "careers@unseengadget.com" })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <ApplyModal
        job={selectedJob}
        isOpen={selectedJob !== null}
        onClose={() => setSelectedJob(null)}
      />
    </>
  );
}
