export const SHOT_COLOR = '#D59E0D';

export const SHOT_SIZE = {
  NA: 45,
  IIHF: 114,
};

export const DEEMPHASIZED_SHOT_SIZE = {
  NA: 25,
  IIHF: 64,
};

export function emphasizeShot(shot, rinkType) {
  shot.setAttribute('r', SHOT_SIZE[rinkType]);
  shot.parentElement.querySelectorAll('.shot').forEach((item) => {
    item.classList.add('faded');
  });
  shot.classList.remove('faded');
}

export function deemphasizeShot(shot, rinkType) {
  shot.setAttribute('r', DEEMPHASIZED_SHOT_SIZE[rinkType]);
  shot.parentElement.querySelectorAll('.shot').forEach((item) => {
    item.classList.remove('faded');
  });
}

export function emphasizeRow(row) {
  row.classList.add('emphasized-row');
}

export function deemphasizeRow(row) {
  row.classList.remove('emphasized-row');
}

export function appendShotCircle(elem, id, shotLocation, rinkType, handlers = {}) {
  const { onMouseOver = () => {}, onMouseOut = () => {} } = handlers;
  const ns = 'http://www.w3.org/2000/svg';
  const circle = document.createElementNS(ns, 'circle');

  circle.setAttribute('id', `shot-${id}`);
  circle.classList.add('shot');
  circle.setAttribute('cx', shotLocation.x);
  circle.setAttribute('cy', shotLocation.y);
  circle.setAttribute('r', SHOT_SIZE[rinkType]);
  circle.setAttribute('fill', SHOT_COLOR);

  circle.addEventListener('mouseover', (event) => {
    emphasizeShot(event.currentTarget, rinkType);
    onMouseOver(event.currentTarget);
  });

  circle.addEventListener('mouseout', (event) => {
    deemphasizeShot(event.currentTarget, rinkType);
    onMouseOut(event.currentTarget);
  });

  elem.appendChild(circle);

  return circle;
}
