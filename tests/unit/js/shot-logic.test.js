import { describe, expect, it } from 'vitest';

import {
  DEFAULT_UNITS,
  convertCoordinates,
  convertTableData,
  generateX,
  generateY,
} from '../../../src/js/shot-logic.js';

describe('shot logic', () => {
  it('exposes the default units per rink type', () => {
    expect(DEFAULT_UNITS).toEqual({
      NA: 'in',
      IIHF: 'cm',
    });
  });

  it('converts x coordinates for both rink types across units', () => {
    expect(generateX(1202, 'in', 'NA')).toBe(0);
    expect(generateX(1214, 'ft', 'NA')).toBe(1);
    expect(generateX(1212, 'cm', 'NA')).toBe(25);

    expect(generateX(3005, 'cm', 'IIHF')).toBe(0);
    expect(generateX(3030.4, 'in', 'IIHF')).toBe(10);
    expect(generateX(3035.48, 'ft', 'IIHF')).toBe(1);
  });

  it('converts y coordinates for both rink types across units', () => {
    expect(generateY(512, 'in', 'NA')).toBe(0);
    expect(generateY(500, 'in', 'NA')).toBe(12);
    expect(generateY(524, 'ft', 'NA')).toBe(-1);

    expect(generateY(1504.5, 'cm', 'IIHF')).toBe(0);
    expect(generateY(1479.1, 'in', 'IIHF')).toBe(10);
    expect(generateY(1534.98, 'ft', 'IIHF')).toBe(-1);
  });

  it('converts a shot row without changing its id', () => {
    expect(convertCoordinates({ x: 1214, y: 500, id: 2 }, 'in', 'NA')).toEqual({
      x: 12,
      y: 12,
      id: 2,
    });
  });

  it('maps table rows in their current order', () => {
    expect(convertTableData([
      { x: 1214, y: 500, id: 2 },
      { x: 1202, y: 512, id: 1 },
    ], 'in', 'NA')).toEqual([
      { x: 12, y: 12, id: 2 },
      { x: 0, y: 0, id: 1 },
    ]);
  });
});
