// @ts-nocheck
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ToasterElement } from '../toaster-element.ts';
import { Toast, ToastEmitterEvent } from '../types.ts';
import { toast } from '../toast-emitter.ts';

describe('<app-toaster> element', () => {
  let appToasterElement: ToasterElement | null;

  beforeEach(() => {
    document.body.innerHTML = '';
    appToasterElement = new ToasterElement();
    (appToasterElement as any)._toastsList = [];
    document.body.appendChild(appToasterElement);
  });

  afterEach(() => {
    if (appToasterElement) {
      appToasterElement.remove();
      appToasterElement = null;
    }
  });

  it('renders', async () => {
    expect(appToasterElement).toBeDefined();
  });

  it(`renders toast message on ${ToastEmitterEvent.TOASTS_CHANGE} event`, async () => {
    // Wait for connectedCallback to finish setting up listener
    await new Promise((r) => setTimeout(r, 10));

    const emittedToast: Partial<Toast> = {
      message: 'Toast emitted and created successfully!',
      duration: 7000,
      type: 'success',
      position: 'top-right',
    };

    // Emit toast
    toast.show(
      emittedToast.message as string,
      emittedToast.duration,
      emittedToast.type,
      emittedToast.position
    );

    if (appToasterElement && 'updateComplete' in appToasterElement) {
      await appToasterElement.updateComplete;
    } else {
      throw new Error('app-toaster not found');
    }

    // Toast elements
    const toastEl = appToasterElement?.shadowRoot?.querySelector(
      `#toast-${emittedToast.type}-1`
    );
    const toastContainerEl = toastEl?.parentElement;

    expect(toastContainerEl).toBeDefined();
    expect(toastEl).toBeDefined();

    expect(toastEl?.textContent).toContain('✓');
    expect(toastEl?.textContent).toContain(emittedToast.message);
    expect(toastEl?.textContent).toContain('X');
    expect(toastEl?.classList).contains(['toast']);
    expect(toastContainerEl?.classList).contains([
      'toast-container',
      `${emittedToast.position}`,
    ]);
    expect((appToasterElement as any)._toastsList.length).toEqual(1);
  });

  describe('properties', () => {
    describe('queueLimit', () => {
      it('has undefined default value', async () => {
        const toastQueueLimitDefault = 7;
        expect(appToasterElement).toBeDefined();
        expect(appToasterElement?.queueLimit).toBeUndefined();

        // Element property undefined, yet toast (emitter) queueLimit will still take effect
        expect((toast as any)._queueLimit).toEqual(toastQueueLimitDefault);
      });

      it('updates when set with new value and updates ToastEmitter queueLimit instance variable', async () => {
        const newQueueLimit = 10;
        expect(appToasterElement).toBeDefined();
        expect(appToasterElement?.queueLimit).toBeUndefined();

        appToasterElement.queueLimit = newQueueLimit;
        // Element property set, so toast (emitter) get's set to same value
        expect((toast as any)._queueLimit).toEqual(newQueueLimit);
      });

      it('updates when set with new value via ToastEmitter queueLimit setter', async () => {
        const newQueueLimit = 10;
        expect(appToasterElement).toBeDefined();
        expect(appToasterElement?.queueLimit).toBeUndefined();

        toast.queueLimit = newQueueLimit;

        expect((toast as any)._queueLimit).toEqual(newQueueLimit);
        expect(appToasterElement.queueLimit).toEqual(newQueueLimit);
      });
    });
  });
});
