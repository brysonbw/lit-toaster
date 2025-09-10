[**Lit Toaster API Reference**](../README.md)

***

[Lit Toaster API Reference](../README.md) / ToastEmitterEvent

# Enumeration: ToastEmitterEvent

Enum representing the custom event types emitted by the `ToastEmitter`

## Enumeration Members

### TOASTS\_CHANGE

> **TOASTS\_CHANGE**: `"toasts-change"`

Dispatched when a new toast is added to the toasts list via the `show()` method. Event detail (`event.detail`) contains the updated toasts list as an array

***

### TOASTS\_LIMIT\_CHANGE

> **TOASTS\_LIMIT\_CHANGE**: `"toasts-limit-change"`

Dispatched when the toasts limit changes via the `toastsLimit` setter. Event detail (`event.detail`) contains the updated toasts limit as a number
