<div align="center">
<img alt="lit toaster logo" src="https://res.cloudinary.com/ddlhtsgmp/image/upload/w_300,h_300,c_fill,r_10/v1755055178/lit-toaster-logo-full.png"/>
</div>

<br />

<div align="center">
    <img src="https://img.shields.io/github/v/tag/brysonbw/lit-toaster?style=flat&color=blue&label=npm" alt="github-tag" />
  <img src="https://img.shields.io/npm/dm/lit-toaster?style=flat&label=npm%20downloads" alt="npm-downloads"/>
    <img src="https://img.shields.io/github/actions/workflow/status/brysonbw/lit-toaster/test.yml?branch=main&style=flat&logo=github&label=CI" alt="ci-test-build-status" />
</a>
</div>
<br />
<div align="center"><strong>Notifications for Lit Web Components.</strong></div>
<div align="center">Simple, lightweight, and easy to integrate.</div>
<br />

<div align="center">
<a href="https://lit-toaster.com/">Website</a> 
<span> · </span>
<a href="https://github.com/brysonbw/lit-toaster/blob/main/docs/api-reference/README.md">Documentation</a> 
<span> · </span>
<a href="https://www.npmjs.com/package/lit-toaster">NPM Package</a> 
</div>

## Installation

```bash
npm install lit-toaster
```

## Usage

### 1. After installation, add toaster element to template

```html
<body>
  <my-element></my-element>
  <app-toaster></app-toaster>
</body>
```

> Recommend placing `<app-toaster></app-toaster>` below all other elements.

### 2. Import `toast` (emitter) within your Lit Web Component(s) and call `toast.show()`

```typescript
// my-element.ts
import { LitElement, css, html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { toast } from 'lit-toaster';

@customElement('my-element')
export class MyElement extends LitElement {
  @property()
  name?: string = 'my-element';

  render(): TemplateResult {
    return html`<div>
      <p>${this.name} lit toast.</p>
      <button
        type="button"
        @click=${(): void =>
          toast.show("Here's your toast - peace and much love.")}
      >
        Create toast
      </button>
    </div>`;
  }

  static styles = css`
    :host {
      color: #1e90ff;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
```

## Toaster element properties

| Name          | Attribute |
| ------------- | --------- |
| `toastsLimit` | false     |

## Documentation

For more detailed documentation, please view the [API Reference](docs/api-reference/README.md).

## Contributing

If you have suggestions for how this project could be improved, or want to report a bug, feel free to open an issue! We welcome all contributions.

Likewise, before contributing please read the [contribution guide](CONTRIBUTING.md).

## Credits

Lit Toaster is heavily inspired by [react-hot-toast](https://github.com/timolins/react-hot-toast).

## Motivation

I implemented (toast) notifications in a few small side projects using different frontend frameworks. Instead of copying and modifying the same code for [Lit](https://lit.dev/), I decided to publish it as a public package.

## Resources

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Contributing](CONTRIBUTING.md)
- [Security](SECURITY.md)
- [API Reference](docs/api-reference/README.md)

## License

[MIT](LICENSE)
