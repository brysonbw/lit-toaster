import { Toast, ToastKind, ToastPosition } from '../../types';

/** Get mock toast object */
export function getToastObject(
  message: string = 'This is a toast message!',
  duration: number = 7000,
  type: ToastKind = 'success',
  position: ToastPosition = 'top-center'
): Toast {
  return {
    id: '',
    message,
    duration,
    type,
    position,
    state: 'enter',
  };
}
