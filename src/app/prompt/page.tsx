"use client";

import { useEffect, useState } from "react";
import { fetchPrompt } from "@/lib/api";
import { Spinner } from "@/components/ui/Spinner";

export default function PromptPage() {
  const [prompt, setPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrompt()
      .then((text) => {
        setPrompt(text);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Assessment System Prompt</h1>
        <p className="mt-1 text-sm text-gray-500">
          This is the full system prompt sent to Claude at the start of every assessment,
          rendered with the actual domain knowledge (standards, misconceptions, and learning progression).
        </p>
      </div>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-gray-800">
          {prompt}
        </pre>
      </div>
    </div>
  );
}
