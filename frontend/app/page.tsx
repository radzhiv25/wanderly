"use client";

import { FormEvent, useMemo, useState } from "react";

type HealthResponse = {
  status: string;
};

type MessageResponse = {
  greeting: string;
  original_message: string;
  message_length: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001";

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string>("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState<MessageResponse | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const healthText = useMemo(() => {
    if (health?.status) return `Backend status: ${health.status}`;
    if (healthError) return healthError;
    return "Click \"Check backend\" to verify the connection.";
  }, [health, healthError]);

  async function checkBackend(): Promise<void> {
    setHealthError("");
    setHealth(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/health`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Health check failed (${res.status})`);
      const data = (await res.json()) as HealthResponse;
      setHealth(data);
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : "Could not reach backend");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitError("");
    setResponse(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/v1/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Request failed (${res.status})`);
      }

      const data = (await res.json()) as MessageResponse;
      setResponse(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Wanderly FE-BE Connection</h1>
      <p className="mt-2 text-sm text-gray-600">Frontend: http://localhost:3000 | Backend: {API_URL}</p>

      <section className="mt-8 rounded-xl border p-5">
        <h2 className="text-xl font-semibold">1. Health Check</h2>
        <p className="mt-2 text-sm text-gray-700">{healthText}</p>
        <button
          type="button"
          onClick={checkBackend}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          Check backend
        </button>
      </section>

      <section className="mt-6 rounded-xl border p-5">
        <h2 className="text-xl font-semibold">2. Message API Test</h2>
        <form className="mt-4 space-y-3" onSubmit={onSubmit}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Your name"
            minLength={2}
            maxLength={50}
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Your message"
            minLength={1}
            maxLength={500}
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send to backend"}
          </button>
        </form>

        {submitError ? <p className="mt-3 text-sm text-red-600">{submitError}</p> : null}

        {response ? (
          <div className="mt-4 rounded-md bg-gray-50 p-3 text-sm">
            <p>{response.greeting}</p>
            <p>Original: {response.original_message}</p>
            <p>Length: {response.message_length}</p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
