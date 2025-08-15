[**Lit Toaster API Reference**](../README.md)

***

[Lit Toaster API Reference](../README.md) / ToastEmitterEvent

# Enumeration: ToastEmitterEvent

Enum representing the custom event types emitted by the `ToastEmitter`

## Enumeration Members

### QUEUE\_LIMIT\_CHANGE

> **QUEUE\_LIMIT\_CHANGE**: `"queue-limit-change"`

Dispatched when the queue limit changes via the `queueLimit` setter. Event detail (`event.detail`) contains the updated queue limit as a number

***

### TOASTS\_CHANGE

> **TOASTS\_CHANGE**: `"toasts-change"`

Dispatched when a new toast is added to the toasts list via the `show()` method. Event detail (`event.detail`) contains the updated toasts list as an array
