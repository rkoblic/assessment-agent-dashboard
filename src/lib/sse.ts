/**
 * SSE-over-POST streaming client.
 *
 * The browser's native EventSource only supports GET, but our assessment
 * endpoints are POST. This module uses fetch() with a streaming reader
 * and manual SSE frame parsing.
 */

import { API_BASE } from "./constants";

export interface SSEOptions {
  /** Path relative to API_BASE (e.g. "/assess") */
  path: string;
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
  onEvent: (eventType: string, data: unknown) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
  signal?: AbortSignal;
}

export async function connectSSE(options: SSEOptions): Promise<void> {
  const { path, method = "POST", body, onEvent, onError, onComplete, signal } = options;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    onError?.(err as Error);
    return;
  }

  if (!response.ok) {
    onError?.(new Error(`SSE connection failed: ${response.status}`));
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError?.(new Error("No response body"));
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent = "";
  let currentData = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const dataContent = line.slice(5).trim();
          currentData += (currentData ? "\n" : "") + dataContent;
        } else if (line.trim() === "") {
          // Blank line = end of event
          if (currentEvent && currentData) {
            try {
              const parsed = JSON.parse(currentData);
              onEvent(currentEvent, parsed);
            } catch {
              // Skip malformed JSON
            }
          }
          currentEvent = "";
          currentData = "";
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    onError?.(err as Error);
    return;
  }

  onComplete?.();
}
