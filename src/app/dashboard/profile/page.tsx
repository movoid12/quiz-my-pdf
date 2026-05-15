"use client";

import { type SyntheticEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, refetch } = authClient.useSession();
  const user = session?.user;

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get("name") as string).trim();
    if (!name) {
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await authClient.updateUser({ name });

    if (error) {
      setMessage({ type: "error", text: error.message ?? "Failed to update" });
    } else {
      setMessage({ type: "success", text: "Name updated" });
      refetch();
    }

    setSaving(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center gap-6">
          <div className="avatar avatar-placeholder">
            <div className="bg-neutral text-neutral-content w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100 text-3xl">
              {user.name?.slice(0, 2).toUpperCase()}
            </div>
          </div>

          <p className="text-sm text-base-content/60">{user.email}</p>

          <form onSubmit={handleSave} className="w-full max-w-xs contents">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Display name</span>
              </div>
              <input
                name="name"
                type="text"
                defaultValue={user.name ?? ""}
                className="input input-bordered w-full"
                placeholder="Your name"
              />
            </label>

            {message && (
              <div
                role="alert"
                className={`alert ${message.type === "success" ? "alert-success" : "alert-error"} py-2`}
              >
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary w-full max-w-xs"
            >
              {saving && <span className="loading loading-spinner" />}
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
