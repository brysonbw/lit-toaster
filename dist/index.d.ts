import * as lit from 'lit';
import { LitElement, TemplateResult } from 'lit';

type ToastKind = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right' | 'bottom-center';
type Toast = {
    id: string;
    message: string;
    duration: number;
    type: ToastKind;
    position: ToastPosition;
};
declare enum ToastEmitterEvent {
    QUEUE_LIMIT_CHANGE = "queue-limit-change",
    TOASTS_CHANGE = "toasts-change"
}

declare class ToastEmitter extends EventTarget {
    private _queueLimit;
    private _toasts;
    get toasts(): Toast[];
    set queueLimit(value: string | number);
    show(message: string, duration?: number, type?: ToastKind, position?: ToastPosition): void;
    remove(t: Toast): void;
    private emitQueueLimitChange;
    private emitToastsChange;
}
declare const toast: ToastEmitter;

declare class ToasterElement extends LitElement {
    set queueLimit(value: number | undefined);
    get queueLimit(): number | undefined;
    private _toastsList;
    private _queueLimit?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private get groupedToasts();
    render(): TemplateResult;
    private getToastIcon;
    private dismiss;
    private onQueueLimitChange;
    private onToastsChange;
    static styles: lit.CSSResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'app-toaster': ToasterElement;
    }
}

declare const GUID: () => string;

export { GUID, ToastEmitter, ToastEmitterEvent, ToasterElement, toast };
export type { Toast, ToastKind, ToastPosition };
