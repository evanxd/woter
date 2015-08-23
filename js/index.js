/* global ace */
'use strict';

(function() {
  var log = document.querySelector('#log');
  var run = document.querySelector('#run');
  var htmlEditor = ace.edit('html-editor');
  var jsEditor = ace.edit('js-editor');
  var cssEditor = ace.edit('css-editor');

  htmlEditor.setTheme("ace/theme/twilight");
  htmlEditor.getSession().setMode("ace/mode/html");
  jsEditor.setTheme("ace/theme/twilight");
  jsEditor.getSession().setMode("ace/mode/javascript");
  cssEditor.setTheme("ace/theme/twilight");
  cssEditor.getSession().setMode("ace/mode/css");

  run.addEventListener('click', function() {
    // Create sandbox.
    var sandbox = document.querySelector('#sandbox');
    var result = document.querySelector('#result');
    if (sandbox) {
      sandbox.parentNode.removeChild(sandbox);
    }
    sandbox = document.createElement('iframe');
    sandbox.id = 'sandbox';
    result.appendChild(sandbox);
    sandbox.src = 'sandbox.html';
    // Run code in sandbox.
    sandbox.addEventListener('load', function() {
      var doc = sandbox.contentWindow.document;
      doc.body.innerHTML = htmlEditor.getValue();

      var script = document.createElement('script');
      script.text = `
        window.addEventListener('boardready', function() {
          console.log('Arduino board is running.');
          parent.postMessage('Arduino board is running.', '*');
          ${jsEditor.getValue()}
        });
      `;
      doc.head.appendChild(script);

      var style = document.createElement('style');
      style.appendChild(document.createTextNode(cssEditor.getValue()));
      doc.head.appendChild(style);
    });
  });

  window.addEventListener('message', function(evt) {
    log.innerHTML = evt.data;
  });
}());
