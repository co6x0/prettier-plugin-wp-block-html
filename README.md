# prettier-plugin-wp-block-html

A [Prettier](https://prettier.io/) plugin for HTML in WordPress Block Theme.

This plugin formats unique HTML code including [Block markups](https://developer.wordpress.org/themes/block-themes/templates-and-template-parts/) in the WordPress block theme.

## ⚠️ Warning

This plugin is currently in beta. It may return unexpected results.

## Usage

In most cases, you can just install `prettier-plugin-wp-block-html` and start using it. The plugin will work automatically after installation.

```shell
npm install -D prettier prettier-plugin-wp-block-html
```

If the plugin cannot be found automatically, you can load it as follows:

```javascript
// prettier.config.js
module.exports = {
  plugins: ["prettier-plugin-wp-block-html"],
};
```

Alternatively:

```shell
npx prettier --write ./parts/header.html --plugin prettier-plugin-wp-block-html
```

For more information, please refer to [Prettier documentation](https://prettier.io/docs/en/plugins.html#using-plugins).
