// Utility functions

export function generateCircuitId(): string {
  return `circuit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
