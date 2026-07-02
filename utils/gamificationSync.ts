type Listener = () => void;

const listeners = new Set<Listener>();

export function subscribeGamification(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function notifyGamification(): void {
  listeners.forEach((listener) => listener());
}
