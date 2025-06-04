import './style.css';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
const editorZone = document.querySelector('.editor-container');
const editor_js = editorZone.querySelector('.editor-js');
const editor_css = editorZone.querySelector('.editor-css');
const editor_html = editorZone.querySelector('.editor-html');
const output_frame = document.querySelector('#output-frame');
const btn = document.querySelector('.btn');
const btn_save = document.querySelector('.btn-save');

let editorJs = new EditorView({
  extensions: [basicSetup, javascript(), oneDark],
  parent: editor_js,
  //   theme: 'dracula',
});
let editorCss = new EditorView({
  extensions: [basicSetup, css(), oneDark],
  parent: editor_css,
});
let editorHtml = new EditorView({
  extensions: [basicSetup, html(), oneDark],
  parent: editor_html,
});

btn.addEventListener('click', () => {
  const doc =
    output_frame.contentDocument || output_frame.contentWindow.document;

  const htmlCode = editorHtml.state.doc.toString();
  const cssCode = editorCss.state.doc.toString();
  const jsCode = editorJs.state.doc.toString();

  doc.open();
  doc.write(`
  <html>
    <head>
      <style>
      body {
      color:white
      }
      ${cssCode}</style>
    </head>
    <body>
      ${htmlCode}
      <script>
  console.log = function(message) {
    const pre = document.createElement('pre');
    pre.textContent = message;
    document.body.appendChild(pre);
  }
  try {
    ${jsCode}
  } catch (error) {
    console.log(error);
  }
<\/script>
    </body>
  </html>
`);
  doc.close();
});

btn_save.addEventListener('click', () => {
  const htmlCode = editorHtml.state.doc.toString();
  const cssCode = editorCss.state.doc.toString();
  const jsCode = editorJs.state.doc.toString();
  const fullHtml = `
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Creation</title>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    ${jsCode}
  <\/script>
</body>
</html>
  `;

  const blob = new Blob([fullHtml], { type: 'text/html' });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'index.html';
  a.click();

  URL.revokeObjectURL(blob);
});
