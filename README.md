EnhancedTextarea
================

EnhancedTextarea is a small project aimed to enhance a textarea. No color
highlighting or complex indentation here: just the minimal set of features
needed to ease the edition of native textarea. A balanced solution between the
plain textarea and the hacky thousands-lines-of-code code editor.

Features
--------

* No dependency, slim, fast, easily customizable.
* \<return\> inserts a new line, keeping the indentation of the current line.
* \<tab\> inserts or completes a level of indentation.
* \<backspace\> removes at most one level of indentation next to the caret.
* \<shift-tab\> unindents the line.
* Selection + \<tab\> indents all the lines of the selection.
* Selection + \<shift-tab\> unindents all the lines of the selection.

Usage
-----

```javascript
// Get the textarea (you could use jQuery('.my-textarea')[0] or whatever)
var textarea = document.querySelector('.my-textarea');

// Create the instance
var et = new EnhancedTextarea(textarea, {
  indentChar: ' ',  // you could set it to '\t' if you want
  indentLevel: 4    // 4 spaces
});

// (Optional) Use .detach to remove the enhancements, and .attach to readd them.
if (the_user_doesnt_want_enhancements) {
  et.detach();
} else {
  et.attach();
}
```

Notes
-----

* Only tested on Chromium (Google Chrome) and Firefox. Won't work on Internet Explorer < 10 for now.
* There is a known bug in Chromium: when you press return at the bottom of the textarea, the scroll won't follow. As it is a tiny problem, and the solution is non-trivial (and hacky), this will be fixed later.
* I'm open to suggestions.
