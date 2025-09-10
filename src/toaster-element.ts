import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Toast, ToastEmitterEvent, ToastKind, ToastPosition } from './types.ts';
import { toast } from './toast-emitter.ts';
import { TOAST_TYPES } from './constants.ts';

@customElement('app-toaster')
export class ToasterElement extends LitElement {
  @property({ type: Number, attribute: false })
  set toastsLimit(value: number | undefined) {
    this._toastsLimit = value;
    if (value !== undefined) {
      // Update ToastEmitter toastsLimit instance variable value to match element toastsLimit property value
      toast.toastsLimit = value;
    }
  }
  get toastsLimit(): number | undefined {
    return this._toastsLimit;
  }
  @state()
  private _toastsList: Toast[] = [];
  @state()
  private _toastsLimit?: number;

  // Add/remove event listeners for ToastEmitter events
  connectedCallback(): void {
    super.connectedCallback();
    toast.addEventListener(
      ToastEmitterEvent.TOASTS_LIMIT_CHANGE,
      this.onToastsLimitChange
    );
    toast.addEventListener(
      ToastEmitterEvent.TOASTS_CHANGE,
      this.onToastsChange
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    toast.removeEventListener(
      ToastEmitterEvent.TOASTS_LIMIT_CHANGE,
      this.onToastsLimitChange
    );
    toast.removeEventListener(
      ToastEmitterEvent.TOASTS_CHANGE,
      this.onToastsChange
    );
  }

  /**
   * A map that groups each toast position with its own list of toasts
   * @example { "top-left": [Toast, Toast], "bottom-right": [Toast], ... }
   * @satisfies Ensures each position’s toast stack has its own independent index starting at 0
   */
  private get groupedToasts(): Record<ToastPosition, Toast[]> {
    const toastGroups = {} as Record<ToastPosition, Toast[]>;

    for (let i = 0; i < this._toastsList.length; i++) {
      const toast = this._toastsList[i as number];
      const position = toast.position;

      const bucket = toastGroups[position as ToastPosition];
      if (bucket) {
        bucket.push(toast);
      } else {
        toastGroups[position as ToastPosition] = [toast];
      }
    }

    return toastGroups;
  }

  render(): TemplateResult {
    return html`
      ${Object.entries(this.groupedToasts).map(
        ([position, toasts]) => html`
          <div class="toast-container ${position}">
            ${toasts.map(
              (toast) => html`
                <div
                  id="toast-${toast.type}-${toast.id}"
                  class="toast ${toast.state}"
                  role="alert"
                >
                  <div class="toast-${toast.type} toast-icon">
                    ${this.getToastIcon(toast.type)}
                  </div>
                  <div class="toast-message">${toast.message}</div>
                  <button
                    @click=${(): void => this.dismiss(toast)}
                    type="button"
                    class="toast-close"
                    aria-label="Close"
                  >
                    <span class="sr-only">Close</span>
                    X
                  </button>
                </div>
              `
            )}
          </div>
        `
      )}
    `;
  }

  /**
   * Get toast icon
   * @param type
   */
  private getToastIcon(type: ToastKind): string {
    if (!TOAST_TYPES.includes(type)) {
      type = 'info';
    }

    // TODO: Replace with svgs possibly?
    const icons: Record<ToastKind, string> = {
      success: '✓',
      error: '✗',
      warning: '!',
      info: 'i',
    };
    return icons[type as ToastKind];
  }

  /**
   * Dismiss toast
   * @param t
   */
  private dismiss(t: Toast): void {
    toast.remove(t);
  }

  /**
   * Handle toast `toasts-limit-change` event - get updated toasts limit
   * @param event
   */
  private onToastsLimitChange = (event: Event): void => {
    if (event instanceof CustomEvent) {
      // Update element toastsLimit property value to match ToastEmitter toastsLimit instance variable value
      if (event.detail !== undefined && this._toastsLimit !== event.detail) {
        this._toastsLimit = event.detail;
        this.requestUpdate();
      }
    }
  };

  /**
   * Handle toast `toasts-change` event - get updated toasts list
   * @param event
   */
  private onToastsChange = (event: Event): void => {
    if (event instanceof CustomEvent) {
      this._toastsList = event.detail;
      this.requestUpdate();
    }
  };

  static styles = css`
    .toast-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .toast {
      pointer-events: auto;
      margin: 0;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: white;
      width: 100%;
      max-width: 20rem;
      padding: 1rem;
      color: #6b7280;
      box-shadow:
        0 1px 2px #0000000d,
        0 1px 3px #0000001a;
    }

    /** Screen reader only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .toast .toast-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      margin-right: auto;
      font-size: 0.875rem;
      font-weight: 500;
      word-break: break-word;
    }

    .toast-close {
      cursor: pointer;
      border: none;
      background-color: transparent;
      margin-inline-start: auto;
      margin-left: -0.375rem;
      margin-right: -0.375rem;
      margin-top: -0.375rem;
      margin-bottom: -0.375rem;
      color: #f87171;
      border-radius: 0.5rem;
      padding: 0.375rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease-in-out;
      font-weight: bold;
    }

    .toast-close:hover {
      color: #ef4444;
    }

    .toast-close:focus {
      outline: none;
      box-shadow: 0 0 0 0.5px #6d6d6dff;
    }

    .toast-success {
      color: #14b8a6;
    }

    .toast-info {
      color: #3b82f6;
    }

    .toast-warning {
      color: #eab308;
    }

    .toast-error {
      color: #ef4444;
    }

    .toast-container.top-left {
      top: 10px;
      left: 10px;
      align-items: flex-start;
    }

    .toast-container.top-center {
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    .toast-container.top-right {
      top: 10px;
      right: 10px;
      align-items: flex-end;
    }

    .toast-container.bottom-left {
      bottom: 10px;
      left: 10px;
      align-items: flex-start;
      flex-direction: column-reverse;
    }

    .toast-container.bottom-center {
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
      flex-direction: column-reverse;
    }

    .toast-container.bottom-right {
      bottom: 10px;
      right: 10px;
      align-items: flex-end;
      flex-direction: column-reverse;
    }

    .toast.enter {
      animation: onToastEnter 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .toast.leave {
      animation: onToastLeave 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes onToastEnter {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes onToastLeave {
      0% {
        opacity: 1;
        transform: translateY(0) scaleY(1);
      }
      50% {
        transform: translateY(4px) scaleY(0.95);
      }
      100% {
        opacity: 0;
        transform: translateY(24px) scaleY(0.8);
      }
    }

    /* Apply dark mode styles if user’s system or browser theme is set to 'dark' */
    @media (prefers-color-scheme: dark) {
      .toast {
        background-color: #333;
        color: white;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'app-toaster': ToasterElement;
  }
}
