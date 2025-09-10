import { DEFAULT_TOASTS_LIMIT, TOAST_ANIMATION_DURATION } from './constants.ts';
import { Toast, ToastEmitterEvent, ToastKind, ToastPosition } from './types.ts';
import { GUID } from './utils.ts';

export class ToastEmitter extends EventTarget {
  private _queueLimit: number = DEFAULT_TOASTS_LIMIT;
  private _toasts: Toast[] = [];

  /**
   * Get toasts
   */
  public get toasts(): Toast[] {
    return this._toasts;
  }

  /** Set toasts queue limit */
  public set queueLimit(value: string | number) {
    let updatedQueueLimit = this._queueLimit;

    if (typeof value === 'number') {
      updatedQueueLimit = value;
    }

    if (typeof value === 'string') {
      const valueToNum = Number(value);
      if (!isNaN(valueToNum)) {
        updatedQueueLimit = valueToNum;
      }
    }

    this._queueLimit = Math.max(0, updatedQueueLimit); // Set any negative value to 0
    this.emitQueueLimitChange();
  }

  /**
   * Show toast notification
   * @param message
   * @param duration
   * @param type
   * @param position
   */
  public show(
    message: string,
    duration: number = 7000,
    type: ToastKind = 'success',
    position: ToastPosition = 'top-center'
  ): void {
    // Check if next toast added will hit the queue limit. Less than 0 = no limit
    if (this._queueLimit > 0 && this._toasts.length + 1 >= this._queueLimit) {
      // Only add a warning toast if one isn't already present
      const existingWarningToast = this._toasts.find(
        (t) =>
          t.type === 'warning' &&
          t.message.toLowerCase().includes('too many notifications')
      );

      if (!existingWarningToast) {
        const warningToast: Toast = {
          id: GUID(),
          message:
            'Too many notifications. Please wait a moment and/or close existing ones.',
          duration,
          type: 'warning',
          position: 'bottom-center',
          state: 'enter',
        };
        this._toasts = [...this._toasts, warningToast];
        this.emitToastsChange();
        setTimeout(() => this.remove(warningToast), duration);
      }

      return;
    }

    const newToast: Toast = {
      id: GUID(),
      message:
        typeof message === 'string'
          ? message.trim()
          : `Notification: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      duration,
      type,
      position,
      state: 'enter',
    };

    this._toasts = [newToast, ...this._toasts];
    this.emitToastsChange();

    // Toast will not auto remove if duration `-1` - onClick to close toast
    if (duration > 0) {
      setTimeout(() => this.remove(newToast), duration);
    }
  }

  /**
   * Remove toast
   * @param toast
   */
  public remove(toast: Toast): void {
    const index = this._toasts.indexOf(toast);
    if (index === -1) return;
    this._toasts[index as number].state = 'leave';
    this.emitToastsChange();

    setTimeout(() => {
      this._toasts = this._toasts.filter((item) => item !== toast);
      this.emitToastsChange();
    }, TOAST_ANIMATION_DURATION);
  }

  /**
   * Dispatch `queue-limit-change` event
   */
  private emitQueueLimitChange(): void {
    this.dispatchEvent(
      new CustomEvent(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, {
        detail: this._queueLimit,
      })
    );
  }

  /**
   * Dispatch `toasts-change` event
   */
  private emitToastsChange(): void {
    this.dispatchEvent(
      new CustomEvent(ToastEmitterEvent.TOASTS_CHANGE, {
        detail: this._toasts,
      })
    );
  }
}

export const toast = new ToastEmitter();
