import { useMemo } from "react";
import { Button } from "../components/Button";
import { DashboardLayout } from "../components/DashboardLayout";
import { FormInput } from "../components/FormInput";
import { SectionHeader } from "../components/SectionHeader";
import type { User } from "../types";

export function DashboardPage() {
  const user = useMemo(() => {
    const raw = localStorage.getItem("sceneforge_user");
    return raw ? (JSON.parse(raw) as User) : null;
  }, []);

  const role = user?.role ?? "fan";
  const canManage = role === "admin" || role === "band_admin" || role === "venue_admin";

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Workspace"
        title="Dashboard"
        subtitle="Manage events, profiles, and poster uploads with role-aware controls."
      />
      <DashboardLayout>
        {canManage ? (
          <div className="space-y-6">
            <p className="text-sm text-zinc-400">Role: {role}</p>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Draft Events</p>
                <p className="mt-2 text-2xl font-black">03</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Published This Month</p>
                <p className="mt-2 text-2xl font-black">08</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">Poster Uploads</p>
                <p className="mt-2 text-2xl font-black">14</p>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 md:p-5">
              <h2 className="text-lg font-bold">Create or Update Event</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <FormInput label="Event title" placeholder="Enter event title" />
                <FormInput label="Date" type="date" />
                <FormInput label="Venue ID" placeholder="venue id" />
                <FormInput label="Band IDs" placeholder="band-1,band-2" />
                <FormInput label="Poster file placeholder" placeholder="black-steel-friday.jpg" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>Create event</Button>
              <Button variant="secondary">Edit selected event</Button>
              <Button variant="ghost">Upload poster (mock)</Button>
            </div>
          </div>
        ) : (
          <p className="text-zinc-400">Fan role can view saved activity only. Login with admin/band_admin/venue_admin to manage records.</p>
        )}
      </DashboardLayout>
    </div>
  );
}
