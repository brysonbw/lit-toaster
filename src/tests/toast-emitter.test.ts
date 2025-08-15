/* eslint-disable prefer-const */
// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ToastEmitter } from '../toast-emitter.ts';
import { Toast, ToastEmitterEvent } from '../types.ts';

describe('Toast Emitter', () => {
  let toast!: ToastEmitter | null;
  let onQueueLimitChange: ReturnType<typeof vi.fn>;
  let onToastChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    toast = new ToastEmitter();
    onQueueLimitChange = vi.fn();
    onToastChange = vi.fn();
    toast?.addEventListener(
      ToastEmitterEvent.QUEUE_LIMIT_CHANGE,
      onQueueLimitChange
    );
    toast?.addEventListener(ToastEmitterEvent.TOASTS_CHANGE, onToastChange);
  });

  afterEach(() => {
    if (toast) {
      toast?.addEventListener(
        ToastEmitterEvent.QUEUE_LIMIT_CHANGE,
        onQueueLimitChange
      );
      toast.removeEventListener(ToastEmitterEvent.TOASTS_CHANGE, onToastChange);
    }
    toast = null;
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
      let newToast: Toast = {
        id: '',
        message: 'This is a toast message!',
        duration: 7000,
        type: 'success',
        position: 'top-center',
      };
      toast?.show(
        newToast.message,
        newToast.duration,
        newToast.type,
        newToast.position
      );

      expect(toast?.toasts.length).toEqual(1);
      newToast.id = toast?.toasts[0].id;
      expect(toast?.toasts[0]).toEqual(newToast);
      expect(onToastChange).toHaveBeenCalled();
    });

    it('dispatches event via show() method and displays fallback toast massage if message not typeof string', () => {
      let newToast: Toast = {
        id: '',
        message: Symbol('This is a symbol'),
        duration: 7000,
        type: 'success',
        position: 'top-center',
      };
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

      let timeoutID = setTimeout(() => {
        expect(toast?.remove).toHaveBeenCalledWith(newToast);
        expect(onToastChange).toHaveBeenCalledTimes(2);
        expect(toast?.toasts.length).toEqual(0);
      }, newToast.duration);
      clearTimeout(timeoutID);
    });

    it('dispatches event via remove() method', () => {
      let newToast: Toast = {
        id: '',
        message: 'This is a toast message!',
        duration: 7000,
        type: 'success',
        position: 'top-center',
      };
      toast?.show(
        newToast.message,
        newToast.duration,
        newToast.type,
        newToast.position
      );
      expect(toast?.toasts.length).toEqual(1);
      newToast.id = toast?.toasts[0].id;
      expect(toast?.toasts[0]).toEqual(newToast);

      let timeoutID = setTimeout(() => {
        expect(toast?.remove).toHaveBeenCalledWith(newToast);
        expect(onToastChange).toHaveBeenCalledTimes(2);
        expect(toast?.toasts.length).toEqual(0);
      }, newToast.duration);
      clearTimeout(timeoutID);
    });

    it(`dispatches ${ToastEmitterEvent.TOASTS_CHANGE} event via show() method for 'Too many notifications' warning`, () => {
      let queueLimitWarningToast: Toast = {
        id: '',
        message:
          'Too many notifications. Please wait a moment and/or close existing ones.',
        duration: 7000,
        type: 'warning',
        position: 'bottom-center',
      };
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
