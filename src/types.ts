export type ToastKind = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition =
  | 'top-left'
  | 'top-right'
  | 'top-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom-center';
export type Toast = {
  id: string;
  message: string;
  duration: number;
  type: ToastKind;
  position: ToastPosition;
};
/**
 * Enum representing the custom event types emitted by the `ToastEmitter`
 * @enum {string}
 */
export enum ToastEmitterEvent {
  /**
   * Dispatched when the queue limit changes via the `queueLimit` setter. Event detail (`event.detail`) contains the updated queue limit as a number
   */
  QUEUE_LIMIT_CHANGE = 'queue-limit-change',
  /**
   * Dispatched when a new toast is added to the toasts list via the `show()` method. Event detail (`event.detail`) contains the updated toasts list as an array
   */
  TOASTS_CHANGE = 'toasts-change',
}
