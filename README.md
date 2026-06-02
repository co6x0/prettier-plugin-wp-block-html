# prettier-plugin-wp-block-html

A [Prettier](https://prettier.io/) plugin for HTML in WordPress Block Theme.

This plugin formats unique HTML code including [Block markups](https://developer.wordpress.org/themes/block-themes/templates-and-template-parts/) in the WordPress block theme.

## ⚠️ Warning

This plugin is currently in beta. It may return unexpected results.

## Usage

Install Prettier 3 and this plugin:

```shell
npm install -D prettier prettier-plugin-wp-block-html
```

Use the explicit `wp-block-html` parser for files that contain WordPress block comments.
For block themes, this usually means `parts`, `templates`, and `patterns`:

```json
{
  "plugins": ["prettier-plugin-wp-block-html"],
  "overrides": [
    {
      "files": ["parts/**/*.html", "templates/**/*.html", "patterns/**/*.html"],
      "options": {
        "parser": "wp-block-html"
      }
    }
  ]
}
```

You can also pass the parser on the command line:

```shell
npx prettier --write "parts/**/*.html" "templates/**/*.html" "patterns/**/*.html" --plugin prettier-plugin-wp-block-html --parser wp-block-html
```

For compatibility with existing setups, the plugin still exposes an `html` parser wrapper.

For more information, please refer to [Prettier documentation](https://prettier.io/docs/en/plugins.html#using-plugins).

## Using with other Prettier plugins

This plugin uses specific Prettier APIs, which may conflict with other plugins that use similar APIs.

To avoid this problem, consider the order of the `plugins` in the Prettier configuration file. Now you can use this plugin with `prettier-plugin-tailwindcss`.

```json
// .prettierrc.json
{
  "plugins": ["prettier-plugin-tailwindcss", "prettier-plugin-wp-block-html"]
}
```
