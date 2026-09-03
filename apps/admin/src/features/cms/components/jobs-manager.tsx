"use client";

import { useState } from "react";
import { Briefcase, Loader2, Plus, Pencil, Trash2 } from "lucide-react";
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
import type { Job } from "@unseen-gadget/types";

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