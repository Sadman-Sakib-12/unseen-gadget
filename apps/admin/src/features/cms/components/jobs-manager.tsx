"use client";

import { useState } from "react";
import { Briefcase, Loader2, Plus, Pencil, Trash2, Users, ExternalLink, Mail, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/ui/empty-state";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCmsResource } from "@/features/cms/hooks/use-cms-resource";
import { apiRequest } from "@/lib/api";
import type { Job, JobApplication } from "@unseen-gadget/types";

const lineToItems = (value: string): string[] =>
  value
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}

const emptyJob = (): Job => ({
  id: "",
  title: "",
  department: "",
  type: "Full-time",
  location: "Dhaka, Bangladesh",
  description: "",
  responsibilities: [],
  requirements: [],
  active: true,
});

export function JobsManager() {
  const { items, loading, create, update, remove } = useCmsResource<Job>("/cms/jobs");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [draft, setDraft] = useState<Job>(emptyJob());
  const [removing, setRemoving] = useState<Job | null>(null);

  // Applications viewing state
  const [viewingJobApplications, setViewingJobApplications] = useState<Job | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyJob());
    setOpen(true);
  };

  const startEdit = (job: Job) => {
    setEditing(job);
    setDraft({ ...job, responsibilities: [...job.responsibilities], requirements: [...job.requirements] });
    setOpen(true);
  };

  const handleSave = async () => {
    const job: Job = {
      ...draft,
      responsibilities: lineToItems(draft.responsibilities.join("\n")),
      requirements: lineToItems(draft.requirements.join("\n")),
    };
    if (editing) await update(job);
    else await create(job);
    setOpen(false);
  };

  const openApplications = async (job: Job) => {
    setViewingJobApplications(job);
    setApplicationsLoading(true);
    try {
      const res = await apiRequest<JobApplication[]>(`/cms/jobs/${job.id}/applications`);
      setApplications(res.data || []);
    } catch {
      setApplications([]);
    } finally {
      setApplicationsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={startCreate}>
          <Plus className="h-4 w-4" /> Add Job
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs"
          description="Add your first job opening to get started."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-left text-xs font-semibold text-gray-500">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Applications</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                  <td className="px-4 py-3 text-gray-600">{job.department}</td>
                  <td className="px-4 py-3 text-gray-600">{job.type}</td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs font-medium"
                      onClick={() => openApplications(job)}
                    >
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>{job._count?.applications ?? 0}</span>
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={job.active}
                      onCheckedChange={(checked) => update({ ...job, active: checked })}
                      aria-label={`Toggle ${job.title}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEdit(job)} aria-label={`Edit ${job.title}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-600"
                        onClick={() => setRemoving(job)}
                        aria-label={`Delete ${job.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit / Add Job Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader close>
          <DialogTitle>{editing ? "Edit Job" : "Add Job"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update the job opening details." : "Create a new job opening."}
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          <form
            id="job-form"
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  required
                />
              </Field>
              <Field label="Department">
                <Input
                  value={draft.department}
                  onChange={(e) => setDraft({ ...draft, department: e.target.value })}
                  placeholder="Support"
                />
              </Field>
              <Field label="Type">
                <Input
                  value={draft.type}
                  onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                  placeholder="Full-time"
                />
              </Field>
              <Field label="Location">
                <Input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description">
              <Textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={3}
              />
            </Field>
            <Field label="Responsibilities (one per line)">
              <Textarea
                value={draft.responsibilities.join("\n")}
                onChange={(e) => setDraft({ ...draft, responsibilities: lineToItems(e.target.value) })}
                rows={3}
              />
            </Field>
            <Field label="Requirements (one per line)">
              <Textarea
                value={draft.requirements.join("\n")}
                onChange={(e) => setDraft({ ...draft, requirements: lineToItems(e.target.value) })}
                rows={3}
              />
            </Field>
            <div className="flex items-center gap-2">
              <Switch
                checked={draft.active}
                onCheckedChange={(checked) => setDraft({ ...draft, active: checked })}
                id="job-active"
                aria-label="Active"
              />
              <label htmlFor="job-active" className="text-sm text-gray-700">
                Active (visible on the public Careers page)
              </label>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" form="job-form">
            {editing ? "Update Job" : "Add Job"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Applications Dialog */}
      <Dialog
        open={viewingJobApplications !== null}
        onOpenChange={(open) => !open && setViewingJobApplications(null)}
        size="3xl"
      >
        <DialogHeader close>
          <DialogTitle>Applications: {viewingJobApplications?.title}</DialogTitle>
          <DialogDescription>
            Candidates who submitted an application for this role.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="max-h-[70vh] overflow-y-auto">
          {applicationsLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applications yet"
              description="No candidates have submitted an application for this position yet."
            />
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-border bg-gray-50/60 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{app.name}</h4>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                        <a
                          href={`mailto:${app.email}`}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {app.email}
                        </a>
                        {app.phone && (
                          <a
                            href={`tel:${app.phone}`}
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            {app.phone}
                          </a>
                        )}
                        <span className="flex items-center gap-1 text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(app.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {app.resume && (
                      <a
                        href={app.resume.startsWith("http") ? app.resume : `https://${app.resume}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Resume / Link
                      </a>
                    )}
                  </div>

                  {app.coverLetter && (
                    <div className="rounded-lg border border-border bg-white p-3 text-xs text-gray-700">
                      <p className="font-semibold text-gray-500 mb-1 text-[11px] uppercase tracking-wider">
                        Cover Letter / Message:
                      </p>
                      <p className="whitespace-pre-wrap leading-relaxed">{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setViewingJobApplications(null)}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="Remove job?"
        description={removing ? `"${removing.title}" will be removed permanently.` : undefined}
        confirmLabel="Remove"
        destructive
        onConfirm={() => removing && void remove(removing.id)}
      />
    </div>
  );
}