export const RINK_URLS = {
  NA: 'assets/img/na-rink.svg',
  IIHF: 'assets/img/iihf-rink.svg',
};

export const DEFAULT_UNITS = {
  NA: 'in',
  IIHF: 'cm',
};

const X_OFFSET = {
  NA: 1202,
  IIHF: 3005,
};

const Y_OFFSET = {
  NA: 512,
  IIHF: 1504.5,
};

function normalizeZero(value) {
  return Object.is(value, -0) ? 0 : value;
}

export function generateX(num, unitType, rinkType) {
  if (rinkType === 'NA') {
    return normalizeZero({
      cm: Math.round((num - X_OFFSET[rinkType]) * 2.54, 1),
      in: Math.round(num - X_OFFSET[rinkType], 1),
      ft: Math.round((num - X_OFFSET[rinkType]) / 12, 1),
    }[unitType]);
  }

  return normalizeZero({
    cm: Math.round(num - X_OFFSET[rinkType], 1),
    in: Math.round((num - X_OFFSET[rinkType]) / 2.54, 1),
    ft: Math.round((num - X_OFFSET[rinkType]) / 30.48, 1),
  }[unitType]);
}

export function generateY(num, unitType, rinkType) {
  if (rinkType === 'NA') {
    return normalizeZero({
      cm: Math.round(-(num - Y_OFFSET[rinkType]) * 2.54, 1),
      in: Math.round(-(num - Y_OFFSET[rinkType]), 1),
      ft: Math.round(-(num - Y_OFFSET[rinkType]) / 12, 1),
    }[unitType]);
  }

  return normalizeZero({
    cm: Math.round(-(num - Y_OFFSET[rinkType]), 1),
    in: Math.round(-(num - Y_OFFSET[rinkType]) / 2.54, 1),
    ft: Math.round(-(num - Y_OFFSET[rinkType]) / 30.48, 1),
  }[unitType]);
}

export function convertCoordinates(coordinates, unitType, rinkType) {
  return {
    x: generateX(coordinates.x, unitType, rinkType),
    y: generateY(coordinates.y, unitType, rinkType),
    id: coordinates.id,
  };
}

export function convertTableData(tableData, unitType, rinkType) {
  return tableData.map((row) => convertCoordinates(row, unitType, rinkType));
}
