import { ToastKind } from './types.ts';

export const DEFAULT_TOASTS_LIMIT: number = 7;
export const TOAST_TYPES: readonly ToastKind[] = [
  'success',
  'error',
  'warning',
  'info',
];
export const TOAST_ANIMATION_DURATION = 200; // In milliseconds
