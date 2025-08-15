/*! lit-toaster v0.1.1 Copyright (c) 2025 Bryson Ward and contributors MIT License*/
import { css, LitElement, html } from 'lit';
import { property, state, customElement } from 'lit/decorators.js';

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var ToastEmitterEvent;
(function (ToastEmitterEvent) {
    ToastEmitterEvent["QUEUE_LIMIT_CHANGE"] = "queue-limit-change";
    ToastEmitterEvent["TOASTS_CHANGE"] = "toasts-change";
})(ToastEmitterEvent || (ToastEmitterEvent = {}));

const DEFAULT_TOASTS_LIMIT = 7;
const TOAST_TYPES = [
    'success',
    'error',
    'warning',
    'info',
];

const GUID = (() => {
    let count = 0;
    return () => {
        return (++count).toString();
    };
})();

class ToastEmitter extends EventTarget {
    constructor() {
        super(...arguments);
        this._queueLimit = DEFAULT_TOASTS_LIMIT;
        this._toasts = [];
    }
    get toasts() {
        return this._toasts;
    }
    set queueLimit(value) {
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
        this._queueLimit = Math.max(0, updatedQueueLimit);
        this.emitQueueLimitChange();
    }
    show(message, duration = 7000, type = 'success', position = 'top-center') {
        if (this._queueLimit > 0 && this._toasts.length + 1 >= this._queueLimit) {
            const existingWarningToast = this._toasts.find((t) => t.type === 'warning' &&
                t.message.toLowerCase().includes('too many notifications'));
            if (!existingWarningToast) {
                const warningToast = {
                    id: GUID(),
                    message: 'Too many notifications. Please wait a moment and/or close existing ones.',
                    duration,
                    type: 'warning',
                    position: 'bottom-center',
                };
                this._toasts = [...this._toasts, warningToast];
                this.emitToastsChange();
                setTimeout(() => this.remove(warningToast), duration);
            }
            return;
        }
        const newToast = {
            id: GUID(),
            message: typeof message === 'string'
                ? message.trim()
                : `Notification: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            duration,
            type,
            position,
        };
        this._toasts = [...this._toasts, newToast];
        this.emitToastsChange();
        if (duration > 0) {
            setTimeout(() => this.remove(newToast), duration);
        }
    }
    remove(t) {
        this._toasts = this._toasts.filter((item) => item !== t);
        this.emitToastsChange();
    }
    emitQueueLimitChange() {
        this.dispatchEvent(new CustomEvent(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, {
            detail: this._queueLimit,
        }));
    }
    emitToastsChange() {
        this.dispatchEvent(new CustomEvent(ToastEmitterEvent.TOASTS_CHANGE, {
            detail: this._toasts,
        }));
    }
}
const toast = new ToastEmitter();

let ToasterElement = class ToasterElement extends LitElement {
    constructor() {
        super(...arguments);
        this._toastsList = [];
        this.onQueueLimitChange = (event) => {
            if (event instanceof CustomEvent) {
                if (event.detail !== undefined && this._queueLimit !== event.detail) {
                    this._queueLimit = event.detail;
                    this.requestUpdate();
                }
            }
        };
        this.onToastsChange = (event) => {
            if (event instanceof CustomEvent) {
                this._toastsList = event.detail;
                this.requestUpdate();
            }
        };
    }
    set queueLimit(value) {
        this._queueLimit = value;
        if (value !== undefined) {
            toast.queueLimit = value;
        }
    }
    get queueLimit() {
        return this._queueLimit;
    }
    connectedCallback() {
        super.connectedCallback();
        toast.addEventListener(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, this.onQueueLimitChange);
        toast.addEventListener(ToastEmitterEvent.TOASTS_CHANGE, this.onToastsChange);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        toast.removeEventListener(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, this.onQueueLimitChange);
        toast.removeEventListener(ToastEmitterEvent.TOASTS_CHANGE, this.onToastsChange);
    }
    get groupedToasts() {
        const toastGroups = {};
        for (let i = 0; i < this._toastsList.length; i++) {
            const toast = this._toastsList[i];
            const position = toast.position;
            const bucket = toastGroups[position];
            if (bucket) {
                bucket.push(toast);
            }
            else {
                toastGroups[position] = [toast];
            }
        }
        return toastGroups;
    }
    render() {
        return html `
      ${Object.entries(this.groupedToasts).map(([position, toasts]) => html `
          <div class="toast-container ${position}">
            ${toasts.map((toast) => html `
                <div
                  id="toast-${toast.type}-${toast.id}"
                  class="toast"
                  role="alert"
                >
                  <div class="toast-${toast.type} toast-icon">
                    ${this.getToastIcon(toast.type)}
                  </div>
                  <div class="toast-message">${toast.message}</div>
                  <button
                    @click=${() => this.dismiss(toast)}
                    type="button"
                    class="toast-close"
                    aria-label="Close"
                  >
                    <span class="sr-only">Close</span>
                    X
                  </button>
                </div>
              `)}
          </div>
        `)}
    `;
    }
    getToastIcon(type) {
        if (!TOAST_TYPES.includes(type)) {
            type = 'info';
        }
        const icons = {
            success: '✓',
            error: '✗',
            warning: '!',
            info: 'i',
        };
        return icons[type];
    }
    dismiss(t) {
        toast.remove(t);
    }
};
ToasterElement.styles = css `
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

    /** Screen ready only */
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

    /* Apply dark mode styles if user’s system or browser theme is set to 'dark' */
    @media (prefers-color-scheme: dark) {
      .toast {
        background-color: #333;
        color: white;
      }
    }
  `;
__decorate([
    property({ type: Number, attribute: false })
], ToasterElement.prototype, "queueLimit", null);
__decorate([
    state()
], ToasterElement.prototype, "_toastsList", void 0);
__decorate([
    state()
], ToasterElement.prototype, "_queueLimit", void 0);
ToasterElement = __decorate([
    customElement('app-toaster')
], ToasterElement);

export { ToasterElement, toast };
