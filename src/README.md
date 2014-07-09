
# Documentation for the "detimag" project

---

## Project notes

### VK.com share button

To enable VK.com share button the following should be done:
1. Register your App at [here](https://vk.com/dev)
2. Copy your App ID and put the following in `<head>`:
```
<script>window.vkAppId = [AppId];</script>
```
where `[AppId]` is your App ID.


---


## Project structure

### Overview

```
project root
- css [all of project stylesheets]
- images [images required for stylesheets only]
- js [all project scripts]
- tmp [temporary files: content images, downloads, etc]
- *.html
- favicon.ico
- README.md
```

Note: you can delete `tmp` directory after development.

### CSS

This project contains the following css files:
* `style.css` - all project styles, including vendor css
* `wysiwyg.css` - project styles to use inside wysiwyg editors
* `custom-styles.css` - empty file for your own styles

All project styles have 3 versions (3 files):
1. `*.css` - source file
2. `*.min.css` - minified version
3. `*-no-base64.css` - version without inline images

Note: use `custom-styles.css` instead of directly editing project styles. This can simplify future updates and bug fixes.

### JavaScript

This project contains the following script files:

* `vendor.js` - all vendor scripts [concatenated] (see whats included below)
* `vendor-html5shiv.js` - html5 polyfill for IE (excluded from `vendor.js`)
* `scripts-head.js` - all project scripts to use inside `<head>` tag [concatenated]
* `scripts-bottom.js` - all project scripts to use at the end of `<body>` tag [concatenated]
* `vendor-src/*` - this directory contains source files for vendor scripts (useful to resolve conflicts)

All project scripts have 3 files:
1. `*.js` - source file
2. `*.min.js` - minified version
3. `*.min.map` - source map for minified file


---


## Included libraries

### JavaScript

* [html5shiv](https://github.com/typekit/webfontloader) - with printshiv
* [jQuery](http://jquery.com/) - this project contains v1.11.0, but should also works with v1.8+
* [jQuery UI](http://jqueryui.com/) - full bundle
* [Web Font Loader](https://github.com/typekit/webfontloader)
* [jQuery Colorbox](https://github.com/jackmoore/colorbox)
* [jQuery Flexslider](https://github.com/woothemes/flexslider)
* [eazyzoom](https://github.com/i-like-robots/EasyZoom)
* [socialite](http://socialitejs.com/)

### CSS

* [normalize.css](http://necolas.github.io/normalize.css/)
* [Direction CSS framework](https://github.com/Nodge/direction-css)
* `jquery.ui.core.css` from [jQuery UI](http://jqueryui.com/) styles
* `jquery.ui.dialog.css` from [jQuery UI](http://jqueryui.com/) styles
* `colorbox.css` for [jQuery Colorbox](https://github.com/jackmoore/colorbox) plugin
* `easyzoom.css` for [eazyzoom](https://github.com/i-like-robots/EasyZoom) plugin


---

## Useful components

### Buttons

This project contains few CSS classes to style buttons:
* `app-btn`
* `app-btn-large`
* `app-btn-xlarge`
* `app-cart-btn`
* `app-cart-btn-large`

You can also add CSS classes to change button appearance
* `app-btn` + `app-btn_danger`
* `app-btn-large` + `app-btn-large_danger`

This CSS classes can be used with `<a>`, `<input type="submit" />` and `<button>` tags.

### Tooltips

You can easily add tooltip to any element. Just use `data-tooltip` attribute like so:
```
<span data-tooltip="Tooltip text">any text on content</span>
```

### Numeric input with plus/minus controls

To use this widget you should add `app-numeric` class to text field like so:
```
<input type="text" value="1" class="app-numeric" data-min="1" data-max="5" data-step="1" />
```

This widget is configurable through data attributes:
* `data-min` - min possible value
* `data-max` - max possible value
* `data-step` - step for controls

### Styled dropdown list

To use styled dropdowns you should add `app-select` class like so:
```
<select class="app-select">
   ...
</select>
```

### Styled checkbox and radio buttons

Styled checkbox requires `<label>` element right after `<input>` and `app-checkbox` class like so:
```
<input id="input1" type="checkbox" class="app-checkbox" />
<label for="input1">...</label>
```

Example for radio button (use `app-radio` class):
```
<input id="input2" type="radio" class="app-radio" />
<label for="input2">...</label>
```

In both cases `<label>` should be linked to `<input>` through `for` attribute.


---


## Typography

### Text blocks

The most of text styles are isolated with `d-text` CSS class. You should wrap your content into any HTML tag with `d-text` CSS class.

Example of unstyled text:
```
<ul>
  <li>This list is not visible</li>
  <li><h2>But headings works fine!</h2></li>
</ul>
```

Example of styled text:
```
<div class="d-text">
  <ul>
    <li>This list is not visible</li>
    <li><h2>But headings works fine!</h2></li>
  </ul>
</div>
```

### Common CSS classes

* `d-clearfix` - Clearing floats
* `d-left` - Align content to left
* `d-right` - Align content to right
* `d-before-list` - Reduce margin before this element and `<ul>`/`<ol>` lists
* `d-list-unstyled` - Remove lists styles
* `d-list-unstyled-nested` - Remove lists styles for all nested lists
* `d-quote-author` - Style quote author inside `<blockquote>` tag
* `d-muted` - style text as muted
* `d-hidden` - hide element
* `d-table` - base styles for table
* `d-table-bordered` - bordered tables
* `d-table-striped` - striped tables
* `d-table-hover` - highlight table rows on hover
* `d-table-condensed` - reduce space in table cells

### Wysiwyg editors

* Do not include `style.css` to your wysisyg. Include `wysiwyg.css` instead.
* No any additional configuration needed (no `d-text` or anything).
* All text styles are applied to `<body>`
* This wysiwyg styles tested with Tinymce v3.x

---

## Author

Developed by: Maxim Zemskov

Email: nodge@yandex.ru

Url: [nodge.ru](http://nodge.ru/)
