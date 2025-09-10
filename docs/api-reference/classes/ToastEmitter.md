[**Lit Toaster API Reference**](../README.md)

***

[Lit Toaster API Reference](../README.md) / ToastEmitter

# Class: ToastEmitter

## Extends

- `EventTarget`

## Constructors

### Constructor

> **new ToastEmitter**(): `ToastEmitter`

#### Returns

`ToastEmitter`

#### Inherited from

`EventTarget.constructor`

## Accessors

### queueLimit

#### Set Signature

> **set** **queueLimit**(`value`): `void`

Set toasts queue limit

##### Parameters

###### value

`string` | `number`

##### Returns

`void`

***

### toasts

#### Get Signature

> **get** **toasts**(): [`Toast`](../type-aliases/Toast.md)[]

Get toasts

##### Returns

[`Toast`](../type-aliases/Toast.md)[]

## Methods

### addEventListener()

> **addEventListener**(`type`, `callback`, `options?`): `void`

The **`addEventListener()`** method of the EventTarget interface sets up a function that will be called whenever the specified event is delivered to the target.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

#### Parameters

##### type

`string`

##### callback

`null` | `EventListenerOrEventListenerObject`

##### options?

`boolean` | `AddEventListenerOptions`

#### Returns

`void`

#### Inherited from

`EventTarget.addEventListener`

***

### dispatchEvent()

> **dispatchEvent**(`event`): `boolean`

The **`dispatchEvent()`** method of the EventTarget sends an Event to the object, (synchronously) invoking the affected event listeners in the appropriate order.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/dispatchEvent)

#### Parameters

##### event

`Event`

#### Returns

`boolean`

#### Inherited from

`EventTarget.dispatchEvent`

***

### remove()

> **remove**(`toast`): `void`

Remove toast

#### Parameters

##### toast

[`Toast`](../type-aliases/Toast.md)

#### Returns

`void`

***

### removeEventListener()

> **removeEventListener**(`type`, `callback`, `options?`): `void`

The **`removeEventListener()`** method of the EventTarget interface removes an event listener previously registered with EventTarget.addEventListener() from the target.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/removeEventListener)

#### Parameters

##### type

`string`

##### callback

`null` | `EventListenerOrEventListenerObject`

##### options?

`boolean` | `EventListenerOptions`

#### Returns

`void`

#### Inherited from

`EventTarget.removeEventListener`

***

### show()

> **show**(`message`, `duration`, `type`, `position`): `void`

Show toast notification

#### Parameters

##### message

`string`

##### duration

`number` = `7000`

##### type

[`ToastKind`](../type-aliases/ToastKind.md) = `'success'`

##### position

[`ToastPosition`](../type-aliases/ToastPosition.md) = `'top-center'`

#### Returns

`void`
