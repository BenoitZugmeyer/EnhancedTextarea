/*
Copyright (c) 2013 Benoît Zugmeyer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*jshint unused: true, undef: true*/
/*exported EnhancedTextarea*/

var EnhancedTextarea = (function () {
  'use strict';

  function EnhancedTextarea(textarea, options) {
    this.input = textarea;

    if (!options) {
      options = {};
    }

    this.indentChar = options.indentChar || ' ';
    this.indentLevel = options.indentLevel || 4;
    this.indentSpaces = this.spaces(this.indentLevel);
    this.startingIndentRE = new RegExp('^\\s{0,' + this.indentLevel + '}');

    this.listener = function (event) {
      var keys = [
        event.ctrlKey ? 'C-' : '',
        event.metaKey ? 'M-' : '',
        event.shiftKey ? 'S-' : '',
        event.altKey ? 'A-' : '',
        event.keyCode
      ].join('');

      if (this.shortcuts[keys]) {
        event.preventDefault();
        this.shortcuts[keys].call(this);
      }
    }.bind(this);

    this.attach();
  }

  var proto = EnhancedTextarea.prototype;

  proto.attach = function () {
    this.input.addEventListener('keydown', this.listener, false);
  };

  proto.detach = function () {
    this.input.removeEventListener('keydown', this.listener, false);
  };

  proto.spaces = function (count) {
    return new Array(count + 1).join(this.indentChar);
  };

  proto.getStart = function () {
    return this.input.value.slice(0, this.input.selectionStart);
  };

  proto.getEnd = function () {
    return this.input.value.slice(this.input.selectionEnd);
  };

  proto.getLine = function () {
    var startLines = this.getStart().split('\n');
    return startLines[startLines.length - 1];
  };

  proto.setValue = function (start, inside, end) {
    if (start === undefined) {
      start = this.getStart();
    }
    if (inside === undefined) {
      inside = '';
    }
    if (end === undefined) {
      end = this.getEnd();
    }
    this.input.value = start + inside + end;
    this.input.selectionEnd = this.input.selectionStart = start.length + inside.length;
  };

  proto.indentLines = function (direction) {
    var input = this.input;
    var offset = 0;
    var start = input.selectionStart;
    var end = input.selectionEnd;

    input.value = input.value.split('\n').map(function (line) {
      var result;
      if (offset + line.length >= input.selectionStart && offset <= input.selectionEnd) {
        if (direction > 0) {
          result = this.indentSpaces + line;
        } else {
          result = line.replace(this.startingIndentRE, '');
        }

        var removed = result.length - line.length;
        if (offset <= input.selectionStart) {
          start += Math.max(removed, offset - input.selectionStart);
        }
        end += Math.max(removed, offset - input.selectionEnd);
      }
      else {
        result = line;
      }
      offset += line.length + 1;
      return result;
    }, this).join('\n');
    input.selectionStart = start;
    input.selectionEnd = end;
  };

  proto.shortcuts = {
    // Return
    '13': function () {
      this.setValue(undefined, '\n' + this.getLine().match(/^\s*/)[0]);
    },

    // Backspace
    '8': function () {
      if (this.input.selectionStart !== this.input.selectionEnd) {
        this.setValue();
      }
      else {
        var line = this.getLine();
        var columnOffset = Math.floor((line.length - 1) / this.indentLevel) * this.indentLevel;
        var count = line.slice(columnOffset).match(/\s*$/)[0].length || 1;
        this.setValue(this.getStart().slice(0, -count));
      }
    },

    // Tab
    '9': function () {
      if (this.input.selectionStart !== this.input.selectionEnd) {
        this.indentLines(1);
      }
      else {
        this.setValue(undefined, this.spaces(this.indentLevel - this.getLine().length % this.indentLevel));
      }
    },

    // S-Tab
    'S-9': function () {
      this.indentLines(-1);
    },

    // Home
    '36': function () {
      var line = this.getLine();
      var count = line.match(/^\s*/)[0].length;
      if (count === line.length) {
        this.input.selectionEnd = this.input.selectionStart -= count;
      }
      else {
        this.input.selectionEnd = this.input.selectionStart -= line.length - count;
      }
    }
  };

  return EnhancedTextarea;
}());
