import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const minifyHtml = require('../../../src/utils/minify-html');

describe('minify-html', () => {
  it('minifies html output', () => {
    const content = '<!doctype html>\n<html>  <body><!--x--><p> hi </p></body></html>';

    expect(minifyHtml(content, 'index.html')).toBe('<!doctype html><html><body><p> hi </p></body></html>');
  });

  it('returns non-html output unchanged', () => {
    const content = ' body { color: red; } ';

    expect(minifyHtml(content, 'styles.css')).toBe(content);
  });
});
