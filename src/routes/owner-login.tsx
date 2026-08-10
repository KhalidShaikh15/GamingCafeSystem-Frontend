import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  loginOwner,
  saveOwnerToken,
} from "@/api/api";

export const Route = createFileRoute("/owner-login")({
  component: OwnerLoginPage,
});

function OwnerLoginPage() {
  const navigate = useNavigate();

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();

    if (!password.trim()) {
      setError(
        "Please enter your owner password."
      );

      return;
    }

    try {

      setLoading(true);
      setError("");

      const result =
        await loginOwner(password);

      if (!result.token) {
        throw new Error(
          "Authentication token was not received."
        );
      }

      saveOwnerToken(result.token);

      navigate({
        to: "/reports",
      });

    } catch (error) {

      console.error(
        "Owner login failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Invalid owner password."
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      <div className="w-full max-w-md">

        <div className="rounded-xl border bg-card p-8 shadow-sm">

          <div className="text-center mb-8">

            <h1 className="text-2xl font-bold">
              Owner Access
            </h1>

            <p className="text-sm text-muted-foreground mt-2">
              Enter your owner password to access
              business reports.
            </p>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            <div className="space-y-2">

              <label
                htmlFor="owner-password"
                className="text-sm font-medium"
              >
                Owner Password
              </label>

              <input
                id="owner-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoFocus
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

            </div>


            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading
                ? "Checking..."
                : "Unlock Owner Access"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}