/*! lit-toaster v0.1.0 Copyright (c) 2025 Bryson Ward and contributors MIT License*/
import { css, LitElement, html } from 'lit';

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const customElement = (tagName) => (classOrTarget, context) => {
    if (context !== undefined) {
        context.addInitializer(() => {
            customElements.define(tagName, classOrTarget);
        });
    }
    else {
        customElements.define(tagName, classOrTarget);
    }
};

const NODE_MODE = false;
const global$1 = globalThis;
const supportsAdoptingStyleSheets = global$1.ShadowRoot &&
    (global$1.ShadyCSS === undefined || global$1.ShadyCSS.nativeShadow) &&
    'adoptedStyleSheets' in Document.prototype &&
    'replace' in CSSStyleSheet.prototype;
const constructionToken = Symbol();
const cssTagCache = new WeakMap();
class CSSResult {
    constructor(cssText, strings, safeToken) {
        this['_$cssResult$'] = true;
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
        this._strings = strings;
    }
    get styleSheet() {
        let styleSheet = this._styleSheet;
        const strings = this._strings;
        if (supportsAdoptingStyleSheets && styleSheet === undefined) {
            const cacheable = strings !== undefined && strings.length === 1;
            if (cacheable) {
                styleSheet = cssTagCache.get(strings);
            }
            if (styleSheet === undefined) {
                (this._styleSheet = styleSheet = new CSSStyleSheet()).replaceSync(this.cssText);
                if (cacheable) {
                    cssTagCache.set(strings, styleSheet);
                }
            }
        }
        return styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
const unsafeCSS = (value) => new CSSResult(typeof value === 'string' ? value : String(value), undefined, constructionToken);
const adoptStyles = (renderRoot, styles) => {
    if (supportsAdoptingStyleSheets) {
        renderRoot.adoptedStyleSheets = styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
    }
    else {
        for (const s of styles) {
            const style = document.createElement('style');
            const nonce = global$1['litNonce'];
            if (nonce !== undefined) {
                style.setAttribute('nonce', nonce);
            }
            style.textContent = s.cssText;
            renderRoot.appendChild(style);
        }
    }
};
const cssResultFromStyleSheet = (sheet) => {
    let cssText = '';
    for (const rule of sheet.cssRules) {
        cssText += rule.cssText;
    }
    return unsafeCSS(cssText);
};
const getCompatibleStyle = supportsAdoptingStyleSheets ||
    (NODE_MODE)
    ? (s) => s
    : (s) => s instanceof CSSStyleSheet ? cssResultFromStyleSheet(s) : s;

const { is, defineProperty, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, getPrototypeOf, } = Object;
const global = globalThis;
let issueWarning$1;
const trustedTypes = global
    .trustedTypes;
const emptyStringForBooleanAttribute = trustedTypes
    ? trustedTypes.emptyScript
    : '';
const polyfillSupport = global.reactiveElementPolyfillSupportDevMode
    ;
{
    global.litIssuedWarnings ??= new Set();
    issueWarning$1 = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!global.litIssuedWarnings.has(warning) &&
            !global.litIssuedWarnings.has(code)) {
            console.warn(warning);
            global.litIssuedWarnings.add(warning);
        }
    };
    queueMicrotask(() => {
        issueWarning$1('dev-mode', `Lit is in dev mode. Not recommended for production!`);
        if (global.ShadyDOM?.inUse && polyfillSupport === undefined) {
            issueWarning$1('polyfill-support-missing', `Shadow DOM is being polyfilled via \`ShadyDOM\` but ` +
                `the \`polyfill-support\` module has not been loaded.`);
        }
    });
}
const debugLogEvent = (event) => {
        const shouldEmit = global
            .emitLitDebugLogEvents;
        if (!shouldEmit) {
            return;
        }
        global.dispatchEvent(new CustomEvent('lit-debug', {
            detail: event,
        }));
    }
    ;
const JSCompiler_renameProperty = (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                value = value ? emptyStringForBooleanAttribute : null;
                break;
            case Object:
            case Array:
                value = value == null ? value : JSON.stringify(value);
                break;
        }
        return value;
    },
    fromAttribute(value, type) {
        let fromValue = value;
        switch (type) {
            case Boolean:
                fromValue = value !== null;
                break;
            case Number:
                fromValue = value === null ? null : Number(value);
                break;
            case Object:
            case Array:
                try {
                    fromValue = JSON.parse(value);
                }
                catch (e) {
                    fromValue = null;
                }
                break;
        }
        return fromValue;
    },
};
const notEqual = (value, old) => !is(value, old);
const defaultPropertyDeclaration$1 = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    useDefault: false,
    hasChanged: notEqual,
};
Symbol.metadata ??= Symbol('metadata');
global.litPropertyMetadata ??= new WeakMap();
class ReactiveElement
 extends HTMLElement {
    static addInitializer(initializer) {
        this.__prepare();
        (this._initializers ??= []).push(initializer);
    }
    static get observedAttributes() {
        this.finalize();
        return (this.__attributeToPropertyMap && [...this.__attributeToPropertyMap.keys()]);
    }
    static createProperty(name, options = defaultPropertyDeclaration$1) {
        if (options.state) {
            options.attribute = false;
        }
        this.__prepare();
        if (this.prototype.hasOwnProperty(name)) {
            options = Object.create(options);
            options.wrapped = true;
        }
        this.elementProperties.set(name, options);
        if (!options.noAccessor) {
            const key = Symbol.for(`${String(name)} (@property() cache)`)
                ;
            const descriptor = this.getPropertyDescriptor(name, key, options);
            if (descriptor !== undefined) {
                defineProperty(this.prototype, name, descriptor);
            }
        }
    }
    static getPropertyDescriptor(name, key, options) {
        const { get, set } = getOwnPropertyDescriptor(this.prototype, name) ?? {
            get() {
                return this[key];
            },
            set(v) {
                this[key] = v;
            },
        };
        if (get == null) {
            if ('value' in (getOwnPropertyDescriptor(this.prototype, name) ?? {})) {
                throw new Error(`Field ${JSON.stringify(String(name))} on ` +
                    `${this.name} was declared as a reactive property ` +
                    `but it's actually declared as a value on the prototype. ` +
                    `Usually this is due to using @property or @state on a method.`);
            }
            issueWarning$1('reactive-property-without-getter', `Field ${JSON.stringify(String(name))} on ` +
                `${this.name} was declared as a reactive property ` +
                `but it does not have a getter. This will be an error in a ` +
                `future version of Lit.`);
        }
        return {
            get,
            set(value) {
                const oldValue = get?.call(this);
                set?.call(this, value);
                this.requestUpdate(name, oldValue, options);
            },
            configurable: true,
            enumerable: true,
        };
    }
    static getPropertyOptions(name) {
        return this.elementProperties.get(name) ?? defaultPropertyDeclaration$1;
    }
    static __prepare() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('elementProperties'))) {
            return;
        }
        const superCtor = getPrototypeOf(this);
        superCtor.finalize();
        if (superCtor._initializers !== undefined) {
            this._initializers = [...superCtor._initializers];
        }
        this.elementProperties = new Map(superCtor.elementProperties);
    }
    static finalize() {
        if (this.hasOwnProperty(JSCompiler_renameProperty('finalized'))) {
            return;
        }
        this.finalized = true;
        this.__prepare();
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties'))) {
            const props = this.properties;
            const propKeys = [
                ...getOwnPropertyNames(props),
                ...getOwnPropertySymbols(props),
            ];
            for (const p of propKeys) {
                this.createProperty(p, props[p]);
            }
        }
        const metadata = this[Symbol.metadata];
        if (metadata !== null) {
            const properties = litPropertyMetadata.get(metadata);
            if (properties !== undefined) {
                for (const [p, options] of properties) {
                    this.elementProperties.set(p, options);
                }
            }
        }
        this.__attributeToPropertyMap = new Map();
        for (const [p, options] of this.elementProperties) {
            const attr = this.__attributeNameForProperty(p, options);
            if (attr !== undefined) {
                this.__attributeToPropertyMap.set(attr, p);
            }
        }
        this.elementStyles = this.finalizeStyles(this.styles);
        {
            if (this.hasOwnProperty('createProperty')) {
                issueWarning$1('no-override-create-property', 'Overriding ReactiveElement.createProperty() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
            if (this.hasOwnProperty('getPropertyDescriptor')) {
                issueWarning$1('no-override-get-property-descriptor', 'Overriding ReactiveElement.getPropertyDescriptor() is deprecated. ' +
                    'The override will not be called with standard decorators');
            }
        }
    }
    static finalizeStyles(styles) {
        const elementStyles = [];
        if (Array.isArray(styles)) {
            const set = new Set(styles.flat(Infinity).reverse());
            for (const s of set) {
                elementStyles.unshift(getCompatibleStyle(s));
            }
        }
        else if (styles !== undefined) {
            elementStyles.push(getCompatibleStyle(styles));
        }
        return elementStyles;
    }
    static __attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false
            ? undefined
            : typeof attribute === 'string'
                ? attribute
                : typeof name === 'string'
                    ? name.toLowerCase()
                    : undefined;
    }
    constructor() {
        super();
        this.__instanceProperties = undefined;
        this.isUpdatePending = false;
        this.hasUpdated = false;
        this.__reflectingProperty = null;
        this.__initialize();
    }
    __initialize() {
        this.__updatePromise = new Promise((res) => (this.enableUpdating = res));
        this._$changedProperties = new Map();
        this.__saveInstanceProperties();
        this.requestUpdate();
        this.constructor._initializers?.forEach((i) => i(this));
    }
    addController(controller) {
        (this.__controllers ??= new Set()).add(controller);
        if (this.renderRoot !== undefined && this.isConnected) {
            controller.hostConnected?.();
        }
    }
    removeController(controller) {
        this.__controllers?.delete(controller);
    }
    __saveInstanceProperties() {
        const instanceProperties = new Map();
        const elementProperties = this.constructor
            .elementProperties;
        for (const p of elementProperties.keys()) {
            if (this.hasOwnProperty(p)) {
                instanceProperties.set(p, this[p]);
                delete this[p];
            }
        }
        if (instanceProperties.size > 0) {
            this.__instanceProperties = instanceProperties;
        }
    }
    createRenderRoot() {
        const renderRoot = this.shadowRoot ??
            this.attachShadow(this.constructor.shadowRootOptions);
        adoptStyles(renderRoot, this.constructor.elementStyles);
        return renderRoot;
    }
    connectedCallback() {
        this.renderRoot ??=
            this.createRenderRoot();
        this.enableUpdating(true);
        this.__controllers?.forEach((c) => c.hostConnected?.());
    }
    enableUpdating(_requestedUpdate) { }
    disconnectedCallback() {
        this.__controllers?.forEach((c) => c.hostDisconnected?.());
    }
    attributeChangedCallback(name, _old, value) {
        this._$attributeToProperty(name, value);
    }
    __propertyToAttribute(name, value) {
        const elemProperties = this.constructor.elementProperties;
        const options = elemProperties.get(name);
        const attr = this.constructor.__attributeNameForProperty(name, options);
        if (attr !== undefined && options.reflect === true) {
            const converter = options.converter?.toAttribute !==
                undefined
                ? options.converter
                : defaultConverter;
            const attrValue = converter.toAttribute(value, options.type);
            if (this.constructor.enabledWarnings.includes('migration') &&
                attrValue === undefined) {
                issueWarning$1('undefined-attribute-value', `The attribute value for the ${name} property is ` +
                    `undefined on element ${this.localName}. The attribute will be ` +
                    `removed, but in the previous version of \`ReactiveElement\`, ` +
                    `the attribute would not have changed.`);
            }
            this.__reflectingProperty = name;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            this.__reflectingProperty = null;
        }
    }
    _$attributeToProperty(name, value) {
        const ctor = this.constructor;
        const propName = ctor.__attributeToPropertyMap.get(name);
        if (propName !== undefined && this.__reflectingProperty !== propName) {
            const options = ctor.getPropertyOptions(propName);
            const converter = typeof options.converter === 'function'
                ? { fromAttribute: options.converter }
                : options.converter?.fromAttribute !== undefined
                    ? options.converter
                    : defaultConverter;
            this.__reflectingProperty = propName;
            const convertedValue = converter.fromAttribute(value, options.type);
            this[propName] =
                convertedValue ??
                    this.__defaultValues?.get(propName) ??
                    convertedValue;
            this.__reflectingProperty = null;
        }
    }
    requestUpdate(name, oldValue, options) {
        if (name !== undefined) {
            if (name instanceof Event) {
                issueWarning$1(``, `The requestUpdate() method was called with an Event as the property name. This is probably a mistake caused by binding this.requestUpdate as an event listener. Instead bind a function that will call it with no arguments: () => this.requestUpdate()`);
            }
            const ctor = this.constructor;
            const newValue = this[name];
            options ??= ctor.getPropertyOptions(name);
            const changed = (options.hasChanged ?? notEqual)(newValue, oldValue) ||
                (options.useDefault &&
                    options.reflect &&
                    newValue === this.__defaultValues?.get(name) &&
                    !this.hasAttribute(ctor.__attributeNameForProperty(name, options)));
            if (changed) {
                this._$changeProperty(name, oldValue, options);
            }
            else {
                return;
            }
        }
        if (this.isUpdatePending === false) {
            this.__updatePromise = this.__enqueueUpdate();
        }
    }
    _$changeProperty(name, oldValue, { useDefault, reflect, wrapped }, initializeValue) {
        if (useDefault && !(this.__defaultValues ??= new Map()).has(name)) {
            this.__defaultValues.set(name, initializeValue ?? oldValue ?? this[name]);
            if (wrapped !== true || initializeValue !== undefined) {
                return;
            }
        }
        if (!this._$changedProperties.has(name)) {
            if (!this.hasUpdated && !useDefault) {
                oldValue = undefined;
            }
            this._$changedProperties.set(name, oldValue);
        }
        if (reflect === true && this.__reflectingProperty !== name) {
            (this.__reflectingProperties ??= new Set()).add(name);
        }
    }
    async __enqueueUpdate() {
        this.isUpdatePending = true;
        try {
            await this.__updatePromise;
        }
        catch (e) {
            Promise.reject(e);
        }
        const result = this.scheduleUpdate();
        if (result != null) {
            await result;
        }
        return !this.isUpdatePending;
    }
    scheduleUpdate() {
        const result = this.performUpdate();
        if (this.constructor.enabledWarnings.includes('async-perform-update') &&
            typeof result?.then ===
                'function') {
            issueWarning$1('async-perform-update', `Element ${this.localName} returned a Promise from performUpdate(). ` +
                `This behavior is deprecated and will be removed in a future ` +
                `version of ReactiveElement.`);
        }
        return result;
    }
    performUpdate() {
        if (!this.isUpdatePending) {
            return;
        }
        debugLogEvent?.({ kind: 'update' });
        if (!this.hasUpdated) {
            this.renderRoot ??=
                this.createRenderRoot();
            {
                const ctor = this.constructor;
                const shadowedProperties = [...ctor.elementProperties.keys()].filter((p) => this.hasOwnProperty(p) && p in getPrototypeOf(this));
                if (shadowedProperties.length) {
                    throw new Error(`The following properties on element ${this.localName} will not ` +
                        `trigger updates as expected because they are set using class ` +
                        `fields: ${shadowedProperties.join(', ')}. ` +
                        `Native class fields and some compiled output will overwrite ` +
                        `accessors used for detecting changes. See ` +
                        `https://lit.dev/msg/class-field-shadowing ` +
                        `for more information.`);
                }
            }
            if (this.__instanceProperties) {
                for (const [p, value] of this.__instanceProperties) {
                    this[p] = value;
                }
                this.__instanceProperties = undefined;
            }
            const elementProperties = this.constructor
                .elementProperties;
            if (elementProperties.size > 0) {
                for (const [p, options] of elementProperties) {
                    const { wrapped } = options;
                    const value = this[p];
                    if (wrapped === true &&
                        !this._$changedProperties.has(p) &&
                        value !== undefined) {
                        this._$changeProperty(p, undefined, options, value);
                    }
                }
            }
        }
        let shouldUpdate = false;
        const changedProperties = this._$changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.willUpdate(changedProperties);
                this.__controllers?.forEach((c) => c.hostUpdate?.());
                this.update(changedProperties);
            }
            else {
                this.__markUpdated();
            }
        }
        catch (e) {
            shouldUpdate = false;
            this.__markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            this._$didUpdate(changedProperties);
        }
    }
    willUpdate(_changedProperties) { }
    _$didUpdate(changedProperties) {
        this.__controllers?.forEach((c) => c.hostUpdated?.());
        if (!this.hasUpdated) {
            this.hasUpdated = true;
            this.firstUpdated(changedProperties);
        }
        this.updated(changedProperties);
        if (this.isUpdatePending &&
            this.constructor.enabledWarnings.includes('change-in-update')) {
            issueWarning$1('change-in-update', `Element ${this.localName} scheduled an update ` +
                `(generally because a property was set) ` +
                `after an update completed, causing a new update to be scheduled. ` +
                `This is inefficient and should be avoided unless the next update ` +
                `can only be scheduled as a side effect of the previous update.`);
        }
    }
    __markUpdated() {
        this._$changedProperties = new Map();
        this.isUpdatePending = false;
    }
    get updateComplete() {
        return this.getUpdateComplete();
    }
    getUpdateComplete() {
        return this.__updatePromise;
    }
    shouldUpdate(_changedProperties) {
        return true;
    }
    update(_changedProperties) {
        this.__reflectingProperties &&= this.__reflectingProperties.forEach((p) => this.__propertyToAttribute(p, this[p]));
        this.__markUpdated();
    }
    updated(_changedProperties) { }
    firstUpdated(_changedProperties) { }
}
ReactiveElement.elementStyles = [];
ReactiveElement.shadowRootOptions = { mode: 'open' };
ReactiveElement[JSCompiler_renameProperty('elementProperties')] = new Map();
ReactiveElement[JSCompiler_renameProperty('finalized')] = new Map();
polyfillSupport?.({ ReactiveElement });
{
    ReactiveElement.enabledWarnings = [
        'change-in-update',
        'async-perform-update',
    ];
    const ensureOwnWarnings = function (ctor) {
        if (!ctor.hasOwnProperty(JSCompiler_renameProperty('enabledWarnings'))) {
            ctor.enabledWarnings = ctor.enabledWarnings.slice();
        }
    };
    ReactiveElement.enableWarning = function (warning) {
        ensureOwnWarnings(this);
        if (!this.enabledWarnings.includes(warning)) {
            this.enabledWarnings.push(warning);
        }
    };
    ReactiveElement.disableWarning = function (warning) {
        ensureOwnWarnings(this);
        const i = this.enabledWarnings.indexOf(warning);
        if (i >= 0) {
            this.enabledWarnings.splice(i, 1);
        }
    };
}
(global.reactiveElementVersions ??= []).push('2.1.1');
if (global.reactiveElementVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning$1('multiple-versions', `Multiple versions of Lit loaded. Loading multiple versions ` +
            `is not recommended.`);
    });
}

let issueWarning;
{
    globalThis.litIssuedWarnings ??= new Set();
    issueWarning = (code, warning) => {
        warning += ` See https://lit.dev/msg/${code} for more information.`;
        if (!globalThis.litIssuedWarnings.has(warning) &&
            !globalThis.litIssuedWarnings.has(code)) {
            console.warn(warning);
            globalThis.litIssuedWarnings.add(warning);
        }
    };
}
const legacyProperty = (options, proto, name) => {
    const hasOwnProperty = proto.hasOwnProperty(name);
    proto.constructor.createProperty(name, options);
    return hasOwnProperty
        ? Object.getOwnPropertyDescriptor(proto, name)
        : undefined;
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual,
};
const standardProperty = (options = defaultPropertyDeclaration, target, context) => {
    const { kind, metadata } = context;
    if (metadata == null) {
        issueWarning('missing-class-metadata', `The class ${target} is missing decorator metadata. This ` +
            `could mean that you're using a compiler that supports decorators ` +
            `but doesn't support decorator metadata, such as TypeScript 5.1. ` +
            `Please update your compiler.`);
    }
    let properties = globalThis.litPropertyMetadata.get(metadata);
    if (properties === undefined) {
        globalThis.litPropertyMetadata.set(metadata, (properties = new Map()));
    }
    if (kind === 'setter') {
        options = Object.create(options);
        options.wrapped = true;
    }
    properties.set(context.name, options);
    if (kind === 'accessor') {
        const { name } = context;
        return {
            set(v) {
                const oldValue = target.get.call(this);
                target.set.call(this, v);
                this.requestUpdate(name, oldValue, options);
            },
            init(v) {
                if (v !== undefined) {
                    this._$changeProperty(name, undefined, options, v);
                }
                return v;
            },
        };
    }
    else if (kind === 'setter') {
        const { name } = context;
        return function (value) {
            const oldValue = this[name];
            target.call(this, value);
            this.requestUpdate(name, oldValue, options);
        };
    }
    throw new Error(`Unsupported decorator location: ${kind}`);
};
function property(options) {
    return (protoOrTarget, nameOrContext
    ) => {
        return (typeof nameOrContext === 'object'
            ? standardProperty(options, protoOrTarget, nameOrContext)
            : legacyProperty(options, protoOrTarget, nameOrContext));
    };
}

function state(options) {
    return property({
        ...options,
        state: true,
        attribute: false,
    });
}

{
    globalThis.litIssuedWarnings ??= new Set();
}

var ToastEmitterEvent;
(function (ToastEmitterEvent) {
    ToastEmitterEvent["QUEUE_LIMIT_CHANGE"] = "queue-limit-change";
    ToastEmitterEvent["TOASTS_CHANGE"] = "toasts-change";
})(ToastEmitterEvent || (ToastEmitterEvent = {}));

const DEFAULT_TOASTS_LIMIT = 7;
const TOAST_TYPES = [
    'success',
    'error',
    'warning',
    'info',
];

const GUID = (() => {
    let count = 0;
    return () => {
        return (++count).toString();
    };
})();

class ToastEmitter extends EventTarget {
    constructor() {
        super(...arguments);
        this._queueLimit = DEFAULT_TOASTS_LIMIT;
        this._toasts = [];
    }
    get toasts() {
        return this._toasts;
    }
    set queueLimit(value) {
        let updatedQueueLimit = this._queueLimit;
        if (typeof value === 'number') {
            updatedQueueLimit = value;
        }
        if (typeof value === 'string') {
            const valueToNum = Number(value);
            if (!isNaN(valueToNum)) {
                updatedQueueLimit = valueToNum;
            }
        }
        this._queueLimit = Math.max(0, updatedQueueLimit);
        this.emitQueueLimitChange();
    }
    show(message, duration = 7000, type = 'success', position = 'top-center') {
        if (this._queueLimit > 0 && this._toasts.length + 1 >= this._queueLimit) {
            const existingWarningToast = this._toasts.find((t) => t.type === 'warning' &&
                t.message.toLowerCase().includes('too many notifications'));
            if (!existingWarningToast) {
                const warningToast = {
                    id: GUID(),
                    message: 'Too many notifications. Please wait a moment and/or close existing ones.',
                    duration,
                    type: 'warning',
                    position: 'bottom-center',
                };
                this._toasts = [...this._toasts, warningToast];
                this.emitToastsChange();
                setTimeout(() => this.remove(warningToast), duration);
            }
            return;
        }
        const newToast = {
            id: GUID(),
            message: typeof message === 'string'
                ? message.trim()
                : `Notification: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
            duration,
            type,
            position,
        };
        this._toasts = [...this._toasts, newToast];
        this.emitToastsChange();
        if (duration > 0) {
            setTimeout(() => this.remove(newToast), duration);
        }
    }
    remove(t) {
        this._toasts = this._toasts.filter((item) => item !== t);
        this.emitToastsChange();
    }
    emitQueueLimitChange() {
        this.dispatchEvent(new CustomEvent(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, {
            detail: this._queueLimit,
        }));
    }
    emitToastsChange() {
        this.dispatchEvent(new CustomEvent(ToastEmitterEvent.TOASTS_CHANGE, {
            detail: this._toasts,
        }));
    }
}
const toast = new ToastEmitter();

let ToasterElement = class ToasterElement extends LitElement {
    constructor() {
        super(...arguments);
        this._toastsList = [];
        this.onQueueLimitChange = (event) => {
            if (event instanceof CustomEvent) {
                if (event.detail !== undefined && this._queueLimit !== event.detail) {
                    this._queueLimit = event.detail;
                    this.requestUpdate();
                }
            }
        };
        this.onToastsChange = (event) => {
            if (event instanceof CustomEvent) {
                this._toastsList = event.detail;
                this.requestUpdate();
            }
        };
    }
    set queueLimit(value) {
        this._queueLimit = value;
        if (value !== undefined) {
            toast.queueLimit = value;
        }
    }
    get queueLimit() {
        return this._queueLimit;
    }
    connectedCallback() {
        super.connectedCallback();
        toast.addEventListener(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, this.onQueueLimitChange);
        toast.addEventListener(ToastEmitterEvent.TOASTS_CHANGE, this.onToastsChange);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        toast.removeEventListener(ToastEmitterEvent.QUEUE_LIMIT_CHANGE, this.onQueueLimitChange);
        toast.removeEventListener(ToastEmitterEvent.TOASTS_CHANGE, this.onToastsChange);
    }
    get groupedToasts() {
        const toastGroups = {};
        for (let i = 0; i < this._toastsList.length; i++) {
            const toast = this._toastsList[i];
            const position = toast.position;
            const bucket = toastGroups[position];
            if (bucket) {
                bucket.push(toast);
            }
            else {
                toastGroups[position] = [toast];
            }
        }
        return toastGroups;
    }
    render() {
        return html `
      ${Object.entries(this.groupedToasts).map(([position, toasts]) => html `
          <div class="toast-container ${position}">
            ${toasts.map((toast) => html `
                <div
                  id="toast-${toast.type}-${toast.id}"
                  class="toast"
                  role="alert"
                >
                  <div class="toast-${toast.type} toast-icon">
                    ${this.getToastIcon(toast.type)}
                  </div>
                  <div class="toast-message">${toast.message}</div>
                  <button
                    @click=${() => this.dismiss(toast)}
                    type="button"
                    class="toast-close"
                    aria-label="Close"
                  >
                    <span class="sr-only">Close</span>
                    X
                  </button>
                </div>
              `)}
          </div>
        `)}
    `;
    }
    getToastIcon(type) {
        if (!TOAST_TYPES.includes(type)) {
            type = 'info';
        }
        const icons = {
            success: '✓',
            error: '✗',
            warning: '!',
            info: 'i',
        };
        return icons[type];
    }
    dismiss(t) {
        toast.remove(t);
    }
};
ToasterElement.styles = css `
    .toast-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .toast {
      pointer-events: auto;
      margin: 0;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: white;
      width: 100%;
      max-width: 20rem;
      padding: 1rem;
      color: #6b7280;
      box-shadow:
        0 1px 2px #0000000d,
        0 1px 3px #0000001a;
    }

    /** Screen ready only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .toast .toast-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      margin-right: auto;
      font-size: 0.875rem;
      font-weight: 500;
      word-break: break-word;
    }

    .toast-close {
      cursor: pointer;
      border: none;
      background-color: transparent;
      margin-inline-start: auto;
      margin-left: -0.375rem;
      margin-right: -0.375rem;
      margin-top: -0.375rem;
      margin-bottom: -0.375rem;
      color: #f87171;
      border-radius: 0.5rem;
      padding: 0.375rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease-in-out;
      font-weight: bold;
    }

    .toast-close:hover {
      color: #ef4444;
    }

    .toast-close:focus {
      outline: none;
      box-shadow: 0 0 0 0.5px #6d6d6dff;
    }

    .toast-success {
      color: #14b8a6;
    }

    .toast-info {
      color: #3b82f6;
    }

    .toast-warning {
      color: #eab308;
    }

    .toast-error {
      color: #ef4444;
    }

    .toast-container.top-left {
      top: 10px;
      left: 10px;
      align-items: flex-start;
    }

    .toast-container.top-center {
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
    }

    .toast-container.top-right {
      top: 10px;
      right: 10px;
      align-items: flex-end;
    }

    .toast-container.bottom-left {
      bottom: 10px;
      left: 10px;
      align-items: flex-start;
      flex-direction: column-reverse;
    }

    .toast-container.bottom-center {
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      align-items: center;
      flex-direction: column-reverse;
    }

    .toast-container.bottom-right {
      bottom: 10px;
      right: 10px;
      align-items: flex-end;
      flex-direction: column-reverse;
    }

    /* Apply dark mode styles if user’s system or browser theme is set to 'dark' */
    @media (prefers-color-scheme: dark) {
      .toast {
        background-color: #333;
        color: white;
      }
    }
  `;
__decorate([
    property({ type: Number, attribute: false })
], ToasterElement.prototype, "queueLimit", null);
__decorate([
    state()
], ToasterElement.prototype, "_toastsList", void 0);
__decorate([
    state()
], ToasterElement.prototype, "_queueLimit", void 0);
ToasterElement = __decorate([
    customElement('app-toaster')
], ToasterElement);

export { ToasterElement, toast };
