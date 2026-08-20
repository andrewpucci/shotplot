// @vitest-environment jsdom

import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  appendShotCircle,
  deemphasizeRow,
  deemphasizeShot,
  emphasizeRow,
  emphasizeShot,
} from '../../../src/js/shot-dom.js';

const createSvgCircle = (doc, id) => {
  const circle = doc.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('id', id);
  circle.classList.add('shot');
  return circle;
};

describe('shot dom helpers', () => {
  it('toggles the emphasized class on table rows', () => {
    const row = document.createElement('tr');

    emphasizeRow(row);
    expect(row.classList.contains('emphasized-row')).toBe(true);

    deemphasizeRow(row);
    expect(row.classList.contains('emphasized-row')).toBe(false);
  });

  it('emphasizes the hovered shot and fades sibling shots', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const shot1 = createSvgCircle(document, 'shot-1');
    const shot2 = createSvgCircle(document, 'shot-2');

    svg.appendChild(shot1);
    svg.appendChild(shot2);

    emphasizeShot(shot2, 'NA');

    expect(shot2.getAttribute('r')).toBe('45');
    expect(shot2.classList.contains('faded')).toBe(false);
    expect(shot1.classList.contains('faded')).toBe(true);
  });

  it('deemphasizes the shot and clears faded state from siblings', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const shot1 = createSvgCircle(document, 'shot-1');
    const shot2 = createSvgCircle(document, 'shot-2');

    svg.appendChild(shot1);
    svg.appendChild(shot2);
    emphasizeShot(shot2, 'NA');

    deemphasizeShot(shot2, 'NA');

    expect(shot2.getAttribute('r')).toBe('25');
    expect(shot1.classList.contains('faded')).toBe(false);
    expect(shot2.classList.contains('faded')).toBe(false);
  });

  it('appends a shot circle with the expected attributes and hover callbacks', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const onMouseOver = vi.fn();
    const onMouseOut = vi.fn();

    const circle = appendShotCircle(svg, 7, { x: 10, y: 20 }, 'IIHF', {
      onMouseOver,
      onMouseOut,
    });

    expect(svg.lastChild).toBe(circle);
    expect(circle.getAttribute('id')).toBe('shot-7');
    expect(circle.getAttribute('cx')).toBe('10');
    expect(circle.getAttribute('cy')).toBe('20');
    expect(circle.getAttribute('r')).toBe('114');
    expect(circle.getAttribute('fill')).toBe('#D59E0D');
    expect(circle.classList.contains('shot')).toBe(true);

    circle.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    expect(onMouseOver).toHaveBeenCalledWith(circle);
    expect(circle.classList.contains('faded')).toBe(false);

    circle.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
    expect(onMouseOut).toHaveBeenCalledWith(circle);
    expect(circle.getAttribute('r')).toBe('64');
  });
});
