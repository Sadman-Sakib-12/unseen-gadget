import { Briefcase, MapPin, Clock, ChevronRight, Users, Zap, Heart } from "lucide-react";
import Link from "next/link";

const cx = "mx-auto w-full max-w-[1320px] px-4";

const jobs = [
  {
    title: "Customer Support Executive",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    dept: "Support",
    description:
      "We are looking for a dedicated Customer Support Executive who can handle customer queries, process orders, and ensure a delightful shopping experience.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Digital Marketing Specialist",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    dept: "Marketing",
    description:
      "Looking for a creative Digital Marketing Specialist to manage social media, run paid campaigns, and grow our brand presence across Bangladesh.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    title: "E-commerce Operations Manager",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    dept: "Operations",
    description:
      "Manage end-to-end e-commerce operations including inventory, order fulfillment, courier coordination, and returns processing.",
    color: "bg-emerald-50 text-emerald-600",
  },
];

const perks = [
  { icon: Zap, label: "Competitive Salary", desc: "We pay above market rate" },
  { icon: Users, label: "Great Team", desc: "Work with passionate people" },
  { icon: Heart, label: "Work-Life Balance", desc: "Flexible working hours" },
  { icon: Briefcase, label: "Growth", desc: "Fast-track your career" },
];

export default function CareersPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <nav className="flex items-center gap-1.5 py-3 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900">Careers</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-14">
        <div className={`${cx} text-center`}>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <Briefcase className="h-3.5 w-3.5" />
            We&rsquo;re Hiring
          </div>
          <h1 className="mt-3 text-3xl font-bold text-white">
            Join the Unseen Gadget Team
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-gray-400">
            Be part of Bangladesh&rsquo;s fastest-growing tech store. We&rsquo;re building an amazing team
            and we&rsquo;d love for you to be a part of it.
          </p>
        </div>
      </div>

      {/* Perks */}
      <section className="border-b border-gray-100 bg-white">
        <div className={cx}>
          <div className="grid grid-cols-2 gap-px bg-gray-100 sm:grid-cols-4">
            {perks.map((p) => (
              <div key={p.label} className="flex flex-col items-center bg-white py-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <p.icon className="h-5 w-5 text-blue-600" />
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-900">{p.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="bg-gray-50 py-10">
        <div className={cx}>
          <h2 className="mb-6 text-lg font-bold text-gray-900">Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${job.color}`}>
                        {job.dept}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="h-3 w-3" /> {job.location}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-gray-900">{job.title}</h3>
                    <p className="mt-1.5 max-w-xl text-sm text-gray-600">{job.description}</p>
                  </div>
                  <button className="shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Spontaneous application */}
          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-dashed border-gray-300 bg-white p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100">
              <Briefcase className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">Don&rsquo;t see a fit?</h3>
              <p className="mt-1 text-xs text-gray-500">
                Send your resume to{" "}
                <a
                  href="mailto:careers@unseengadget.com"
                  className="font-medium text-blue-600 hover:underline"
                >
                  careers@unseengadget.com
                </a>{" "}
                and we&rsquo;ll reach out when the right position opens up.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
