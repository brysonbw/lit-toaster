import * as lit from 'lit';
import { LitElement, TemplateResult } from 'lit';

type ToastKind = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
type ToastState = 'enter' | 'leave';
type Toast = {
    id: string;
    message: string;
    duration: number;
    type: ToastKind;
    position: ToastPosition;
    state: ToastState;
};
declare enum ToastEmitterEvent {
    TOASTS_LIMIT_CHANGE = "toasts-limit-change",
    TOASTS_CHANGE = "toasts-change"
}

declare class ToastEmitter extends EventTarget {
    private _toastsLimit;
    private _toasts;
    get toasts(): Toast[];
    set toastsLimit(value: string | number);
    show(message: string, duration?: number, type?: ToastKind, position?: ToastPosition): void;
    remove(toast: Toast): void;
    private emitToastsLimitChange;
    private emitToastsChange;
}
declare const toast: ToastEmitter;

declare class ToasterElement extends LitElement {
    set toastsLimit(value: number | undefined);
    get toastsLimit(): number | undefined;
    private _toastsList;
    private _toastsLimit?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private get groupedToasts();
    render(): TemplateResult;
    private getToastIcon;
    private dismiss;
    private onToastsLimitChange;
    private onToastsChange;
    static styles: lit.CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'app-toaster': ToasterElement;
    }
}

export { ToastEmitterEvent, ToasterElement, toast };
export type { Toast, ToastKind, ToastPosition, ToastState };
