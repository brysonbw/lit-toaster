export type ToastKind = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';
/** The animation state of a toast */
export type ToastState = 'enter' | 'leave';
export type Toast = {
  id: string;
  message: string;
  duration: number;
  type: ToastKind;
  position: ToastPosition;
  state: ToastState;
};
/**
 * Enum representing the custom event types emitted by the `ToastEmitter`
 * @enum {string}
 */
export enum ToastEmitterEvent {
  /**
   * Dispatched when the toasts limit changes via the `toastsLimit` setter. Event detail (`event.detail`) contains the updated toasts limit as a number
   */
  TOASTS_LIMIT_CHANGE = 'toasts-limit-change',
  /**
   * Dispatched when a new toast is added to the toasts list via the `show()` method. Event detail (`event.detail`) contains the updated toasts list as an array
   */
  TOASTS_CHANGE = 'toasts-change',
}
