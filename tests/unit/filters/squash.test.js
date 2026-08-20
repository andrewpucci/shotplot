import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const squash = require('../../../src/filters/squash');

describe('squash', () => {
  it('removes html, entities, duplicate words, and stop words', () => {
    expect(squash('<p>the puck and the puck</p> &amp; goal')).toBe(' puck goal');
  });

  it('preserves the first instance of a word while deduplicating later repeats', () => {
    expect(squash('goal goal shot goal rebound')).toBe('goal shot rebound');
  });

  it('removes punctuation and newlines from the final search string', () => {
    expect(squash('one one two, two three\nthree?')).toBe('one two two threethree');
  });
});
