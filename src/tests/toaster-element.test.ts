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

    expect(toastContainerEl).not.toBeNull();
    expect(toastEl).not.toBeNull();

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
    describe('toastsLimit', () => {
      it('has undefined default value', async () => {
        const toastToastsLimitDefault = 7;
        expect(appToasterElement).toBeDefined();
        expect(appToasterElement?.toastsLimit).toBeUndefined();

        // Element property undefined, yet toast (emitter) toastsLimit will still take effect
        expect((toast as any)._toastsLimit).toEqual(toastToastsLimitDefault);
      });

      it('updates when set with new value and updates ToastEmitter toastsLimit instance variable', async () => {
        const newToastsLimit = 10;
        expect(appToasterElement).toBeDefined();
        expect(appToasterElement?.toastsLimit).toBeUndefined();

        appToasterElement.toastsLimit = newToastsLimit;
        // Element property set, so toast (emitter) get's set to same value
        expect((toast as any)._toastsLimit).toEqual(newToastsLimit);
      });

      it('updates when set with new value via ToastEmitter toastsLimit setter', async () => {
        const newToastsLimit = 10;
        expect(appToasterElement).toBeDefined();
        expect(appToasterElement?.toastsLimit).toBeUndefined();

        toast.toastsLimit = newToastsLimit;

        expect((toast as any)._toastsLimit).toEqual(newToastsLimit);
        expect(appToasterElement.toastsLimit).toEqual(newToastsLimit);
      });
    });
  });

  describe('toast animations', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.resetAllMocks();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('handles enter and leave toast animation states', async () => {
      vi.spyOn(toast, 'remove');

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
      }

      // Toast element
      const toastEl = appToasterElement.shadowRoot?.querySelector(
        `#toast-${emittedToast.type}-1`
      );
      expect(toastEl).not.toBeNull();

      // Initial state
      expect((appToasterElement as any)._toastsList[0].state).toEqual('enter');
      expect(toastEl?.classList.contains('enter')).toBe(true);
      expect(toastEl?.classList.contains('leave')).toBe(false);

      // Advance time with toast duration
      vi.advanceTimersByTime(emittedToast.duration);

      // After state change. Now in 'leave' state
      expect(toast.toasts[0].state).toEqual('leave');
      await appToasterElement.updateComplete;
      expect((appToasterElement as any)._toastsList[0].state).toEqual('leave');
    });
  });
});
