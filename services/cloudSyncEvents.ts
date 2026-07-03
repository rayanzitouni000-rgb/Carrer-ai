const listeners = new Set<() => void>();

export function subscribeCloudDataRefresh(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitCloudDataRefresh(): void {
  listeners.forEach((listener) => listener());
}
