import { useCallback, useEffect, useState } from "react";
import { SectionHeader } from "../components/SectionHeader";
import { SurfaceCard } from "../components/SurfaceCard";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import { adminDeleteUser, adminGetUsers, adminUpdateUserRole, type AdminUser } from "../services/api";

const ROLES = ["fan", "band_admin", "venue_admin", "admin"] as const;

const roleLabel: Record<string, string> = {
  fan: "Fan",
  band_admin: "Band Admin",
  venue_admin: "Venue Admin",
  admin: "Admin",
};

const roleBadgeClass: Record<string, string> = {
  fan: "bg-white/10 text-white/70",
  band_admin: "bg-fuchsia-500/20 text-fuchsia-200",
  venue_admin: "bg-sky-500/20 text-sky-200",
  admin: "bg-rose-500/20 text-rose-200",
};

export function AdminUsersPage() {
  const auth = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    if (!auth.token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await adminGetUsers(auth.token);
      setUsers(data);
    } catch {
      setError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSaveRole(userId: number) {
    if (!auth.token) return;
    setSaving(true);
    try {
      const updated = await adminUpdateUserRole(auth.token, userId, editRole);
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditingId(null);
    } catch {
      setError("Failed to update role.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId: number) {
    if (!auth.token) return;
    setDeletingId(userId);
    try {
      await adminDeleteUser(auth.token, userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      setError("Failed to delete user.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <SectionHeader
          eyebrow="Admin"
          title="User Management"
          subtitle="View, edit roles, and remove users from the platform."
        />

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-white/55">Loading users…</p>
        ) : (
          <SurfaceCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/45">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">City</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => {
                    const isEditing = editingId === user.id;
                    const isCurrentUser = auth.user?.id === user.id;

                    return (
                      <tr key={user.id} className="group">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white">{user.displayName}</p>
                          <p className="text-xs text-white/45">{user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value)}
                              className="rounded-md border border-white/15 bg-scene-800 px-2 py-1 text-sm text-white focus:border-rose-400 focus:outline-none"
                            >
                              {ROLES.map((r) => (
                                <option key={r} value={r}>{roleLabel[r]}</option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadgeClass[user.role] ?? "bg-white/10 text-white/70"}`}
                            >
                              {roleLabel[user.role] ?? user.role}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white/60">{user.city ?? "—"}</td>
                        <td className="px-4 py-3 text-white/60">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() => void handleSaveRole(user.id)}
                                  className="rounded-md bg-rose-500 px-3 py-1 text-xs font-medium text-white hover:bg-rose-400 disabled:opacity-50"
                                >
                                  {saving ? "Saving…" : "Save"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                  className="rounded-md border border-white/15 px-3 py-1 text-xs text-white/70 hover:bg-white/5"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  disabled={isCurrentUser}
                                  title={isCurrentUser ? "Cannot edit yourself" : "Edit role"}
                                  onClick={() => {
                                    setEditingId(user.id);
                                    setEditRole(user.role);
                                  }}
                                  className="rounded-md border border-white/15 px-3 py-1 text-xs text-white/70 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  Edit Role
                                </button>
                                <button
                                  type="button"
                                  disabled={isCurrentUser || deletingId === user.id}
                                  title={isCurrentUser ? "Cannot delete yourself" : "Delete user"}
                                  onClick={() => void handleDelete(user.id)}
                                  className="rounded-md border border-rose-500/30 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                  {deletingId === user.id ? "Deleting…" : "Delete"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-white/45">No users found.</p>
              )}
            </div>
          </SurfaceCard>
        )}
      </div>
    </DashboardLayout>
  );
}
