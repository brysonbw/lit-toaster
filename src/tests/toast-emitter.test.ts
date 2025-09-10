/* eslint-disable prefer-const */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastEmitter } from '../toast-emitter.ts';
import { Toast, ToastEmitterEvent } from '../types.ts';
import { getToastObject } from '../testing/mocks/toast.ts';
import { TOAST_ANIMATION_DURATION } from '../constants.ts';

describe('Toast Emitter', () => {
  let toast!: ToastEmitter | null;
  let onQueueLimitChange: ReturnType<typeof vi.fn>;
  let onToastsChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetAllMocks();
    toast = new ToastEmitter();
    onQueueLimitChange = vi.fn();
    onToastsChange = vi.fn();
    toast?.addEventListener(
      ToastEmitterEvent.QUEUE_LIMIT_CHANGE,
      onQueueLimitChange
    );
    toast?.addEventListener(ToastEmitterEvent.TOASTS_CHANGE, onToastsChange);
  });

  afterEach(() => {
    if (toast) {
      toast?.addEventListener(
        ToastEmitterEvent.QUEUE_LIMIT_CHANGE,
        onQueueLimitChange
      );
      toast.removeEventListener(
        ToastEmitterEvent.TOASTS_CHANGE,
        onToastsChange
      );
    }
    toast = null;
    vi.useRealTimers();
  });

  describe(`${ToastEmitterEvent.QUEUE_LIMIT_CHANGE} event`, () => {
    it('dispatches event via queueLimit setter', () => {
      const updatedQueueLimit = 10;
      toast.queueLimit = updatedQueueLimit;
      expect((toast as any)._queueLimit).toEqual(updatedQueueLimit);
      expect(onQueueLimitChange).toHaveBeenCalledTimes(1);
    });
  });

  describe(`${ToastEmitterEvent.TOASTS_CHANGE} event`, () => {
    it('dispatches event via show() method', () => {
      let newToast: Toast = getToastObject();
      toast?.show(
        newToast.message,
        newToast.duration,
        newToast.type,
        newToast.position
      );

      expect(toast?.toasts.length).toEqual(1);
      newToast.id = toast?.toasts[0].id;
      expect(toast?.toasts[0]).toEqual(newToast);
      expect(onToastsChange).toHaveBeenCalled();
    });

    it('dispatches event via show() method and displays fallback toast massage if message not typeof string', async () => {
      vi.spyOn(toast, 'remove');

      let newToast: Toast = getToastObject(Symbol('This is a symbol'));
      toast?.show(
        newToast.message,
        newToast.duration,
        newToast.type,
        newToast.position
      );
      expect(toast?.toasts.length).toEqual(1);
      expect(toast?.toasts[0].message).not.toEqual(newToast.message);
      newToast.id = toast?.toasts[0].id;
      newToast.message = toast?.toasts[0].message;
      expect(toast?.toasts[0]).toEqual(newToast);
      expect(toast?.toasts[0].message.toLowerCase()).toEqual(
        `notification: ${newToast.type}`
      );

      // Advance time with toast duration
      vi.advanceTimersByTime(newToast.duration);
      await vi.runAllTimersAsync(); // Invoking every timer so the nested `setTimeout()` within remove(), which actually removes the toast from the toasts list - bypassing for this test

      newToast.state = 'leave';
      expect(toast?.remove).toHaveBeenCalledWith(newToast);
      expect(onToastsChange).toHaveBeenCalledTimes(3);
      expect(toast.toasts.length).toEqual(0);
    });

    it('dispatches event via remove() method', async () => {
      vi.spyOn(toast, 'remove');
      let newToast: Toast = getToastObject();
      toast?.show(
        newToast.message,
        newToast.duration,
        newToast.type,
        newToast.position
      );
      expect(toast?.toasts.length).toEqual(1);
      newToast.id = toast?.toasts[0].id;
      expect(toast?.toasts[0]).toEqual(newToast);

      // Advance time with toast duration
      vi.advanceTimersByTime(newToast.duration);

      // Toast is now in 'leave' state
      newToast.state = 'leave';
      expect(toast?.remove).toHaveBeenCalledWith(newToast);
      expect(toast?.toasts[0].state).toEqual('leave');
      expect(onToastsChange).toHaveBeenCalledTimes(2);

      // Advance time with toast animation duration to actually remove the toast from the toasts list
      vi.advanceTimersByTime(TOAST_ANIMATION_DURATION);
      await vi.runAllTimersAsync();

      // Toast removed
      expect(toast.toasts.length).toEqual(0);
      expect(onToastsChange).toHaveBeenCalledTimes(3);
    });

    it(`dispatches ${ToastEmitterEvent.TOASTS_CHANGE} event via show() method for 'Too many notifications' warning`, () => {
      let queueLimitWarningToast: Toast = getToastObject(
        'Too many notifications. Please wait a moment and/or close existing ones.',
        undefined,
        'warning',
        'bottom-center'
      );
      for (let i = 0; i <= toast._queueLimit - 1; i++) {
        toast?.show('This is a toast message!', 7000, 'success', 'top-center');
      }
      expect(toast?.toasts.length).toEqual(7);
      queueLimitWarningToast.id = toast?.toasts[6].id;
      expect(toast?.toasts[6]).toEqual(queueLimitWarningToast);
    });
  });

  describe('queueLimit setter', () => {
    it('sets new queueLimit from number value', () => {
      const newQueueLimit = 10;
      toast.queueLimit = newQueueLimit;
      expect(toast?._queueLimit).toBeDefined();
      expect(toast?._queueLimit).toBeTypeOf('number');
      expect(toast?._queueLimit).toEqual(newQueueLimit);
    });

    it('sets new queueLimit value from string (number) value', () => {
      const toast = new ToastEmitter();
      const newQueueLimit = '10';
      toast.queueLimit = newQueueLimit;
      expect(toast?._queueLimit).toBeDefined();
      expect(toast?._queueLimit).toBeTypeOf('number');
      expect(toast?._queueLimit).toEqual(Number(10));
    });

    it('sets queueLimit to provided valid value or default if new value is not typeof number', () => {
      const defaultValue = toast._queueLimit;
      const validValue = 10;
      const cases = [
        {},
        true,
        null,
        undefined,
        Symbol('id'),
        9007199254740991n,
        ['array'],
      ];

      // Sets default value
      for (const i of cases) {
        toast.queueLimit = i;
        expect(toast?._queueLimit).toBeDefined();
        expect(toast?._queueLimit).toBeTypeOf('number');
        expect(toast._queueLimit).toEqual(defaultValue);
      }

      toast.queueLimit = validValue;
      // Sets to previous valid value
      for (const i of cases) {
        toast.queueLimit = i;
        expect(toast?._queueLimit).toBeDefined();
        expect(toast?._queueLimit).toBeTypeOf('number');
        expect(toast._queueLimit).toEqual(validValue);
      }
    });

    it(`sets new queueLimit value to 0 (no limit) if provided value is less than 0`, () => {
      const newQueueLimit = -10;
      toast.queueLimit = newQueueLimit;
      expect(toast?._queueLimit).toBeDefined();
      expect(toast?._queueLimit).toBeTypeOf('number');
      expect(toast?._queueLimit).toEqual(0);
    });
  });
});
