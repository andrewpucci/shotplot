import 'bootstrap';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const rinkURL = { NA: 'assets/img/na-rink.svg', IIHF: 'assets/img/iihf-rink.svg' };
  const unitSelector = document.getElementById('unit-selector');
  const xOffset = { NA: 1202, IIHF: 3005 };
  const yOffset = { NA: 512, IIHF: 1504.5 };
  const shotSize = { NA: 45, IIHF: 114 };
  const deemphasizedShotSize = { NA: 25, IIHF: 64 };
  const defaultUnits = { NA: 'in', IIHF: 'cm' };
  const shotColor = '#D59E0D';
  let tableData = [];
  let shotCounter = 0;
  let coordTable = null;
  let currentRinkType = 'NA';

  function cursorPoint(event) {
    const pt = event.currentTarget.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(event.currentTarget.getScreenCTM().inverse());
  }

  function emphasizeShot(shot, rinkType) {
    shot.setAttribute('r', shotSize[rinkType]);
    shot.parentElement.querySelectorAll('.shot').forEach((item) => {
      item.classList.add('faded');
    });
    shot.classList.remove('faded');
  }

  function deemphasizeShot(shot, rinkType) {
    shot.setAttribute('r', deemphasizedShotSize[rinkType]);
    shot.parentElement.querySelectorAll('.shot').forEach((item) => {
      item.classList.remove('faded');
    });
  }

  function emphasizeRow(row) {
    row.classList.add('emphasized-row');
  }

  function deemphasizeRow(row) {
    row.classList.remove('emphasized-row');
  }

  function emphasizeRowById(id) {
    if (!coordTable) return;
    const row = coordTable.getRow(id);
    if (!row) return;
    emphasizeRow(row.getElement());
  }

  function deemphasizeRowById(id) {
    if (!coordTable) return;
    const row = coordTable.getRow(id);
    if (!row) return;
    deemphasizeRow(row.getElement());
  }

  function drawCircle(elem, id, shotLocation, rinkType) {
    const ns = 'http://www.w3.org/2000/svg';
    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('id', `shot-${id}`);
    circle.classList.add('shot');
    circle.setAttribute('cx', shotLocation.x);
    circle.setAttribute('cy', shotLocation.y);
    circle.setAttribute('r', shotSize[rinkType]);
    circle.setAttribute('fill', shotColor);
    circle.addEventListener('mouseover', (event) => {
      emphasizeShot(event.currentTarget, rinkType);
      emphasizeRowById(id);
    });
    circle.addEventListener('mouseout', (event) => {
      deemphasizeShot(event.currentTarget, rinkType);
      deemphasizeRowById(id);
    });
    elem.appendChild(circle);
  }

  function generateX(num, unitType, rinkType) {
    let formulas = {};
    if (rinkType === 'NA') {
      formulas = {
        cm: Math.round((num - xOffset[rinkType]) * 2.54, 1),
        in: Math.round(num - xOffset[rinkType], 1),
        ft: Math.round((num - xOffset[rinkType]) / 12, 1),
      };
    } else {
      formulas = {
        cm: Math.round(num - xOffset[rinkType], 1),
        in: Math.round((num - xOffset[rinkType]) / 2.54, 1),
        ft: Math.round((num - xOffset[rinkType]) / 30.48, 1),
      };
    }
    return formulas[unitType];
  }

  function generateY(num, unitType, rinkType) {
    let formulas = {};
    if (rinkType === 'NA') {
      formulas = {
        cm: Math.round(-(num - yOffset[rinkType]) * 2.54, 1),
        in: Math.round(-(num - yOffset[rinkType]), 1),
        ft: Math.round(-(num - yOffset[rinkType]) / 12, 1),
      };
    } else {
      formulas = {
        cm: Math.round(-(num - yOffset[rinkType]), 1),
        in: Math.round(-(num - yOffset[rinkType]) / 2.54, 1),
        ft: Math.round(-(num - yOffset[rinkType]) / 30.48, 1),
      };
    }
    return formulas[unitType];
  }

  function convertUnits(coordinates, rinkType) {
    const unitType = unitSelector.options[unitSelector.selectedIndex].value;
    const converted = {};
    converted.x = generateX(coordinates.x, unitType, rinkType);
    converted.y = generateY(coordinates.y, unitType, rinkType);
    converted.id = coordinates.id;
    return converted;
  }

  function buildTable(rinkType) {
    currentRinkType = rinkType;
    const convertedData = [];
    tableData.every((row) => convertedData.push(convertUnits(row, rinkType)));

    const tableContainer = document.getElementById('coord-table');
    tableContainer.classList.remove('d-none');
    document.getElementById('unit-selector').classList.add('mb-3');

    if (!coordTable) {
      tableContainer.replaceChildren();

      const buttonRow = document.createElement('div');
      buttonRow.classList.add('d-flex', 'justify-content-end', 'mb-2');

      const exportBtn = document.createElement('button');
      exportBtn.type = 'button';
      exportBtn.classList.add('btn', 'btn-sm', 'btn-outline-secondary');
      exportBtn.textContent = 'Export to CSV';
      buttonRow.appendChild(exportBtn);

      const tableEl = document.createElement('div');
      tableEl.id = 'coord-table-inner';
      tableContainer.appendChild(buttonRow);
      tableContainer.appendChild(tableEl);

      coordTable = new Tabulator(tableEl, {
        index: 'id',
        data: convertedData,
        layout: 'fitColumns',
        reactiveData: false,
        pagination: true,
        paginationMode: 'local',
        paginationSize: 10,
        paginationButtonCount: 3,
        initialSort: [{ column: 'id', dir: 'desc' }],
        columns: [
          { title: 'Shot', field: 'id', sorter: 'number', headerSort: true },
          { title: 'X', field: 'x', sorter: 'number', headerSort: true },
          { title: 'Y', field: 'y', sorter: 'number', headerSort: true },
        ],
      });

      coordTable.on('rowMouseOver', (e, row) => {
        const data = row.getData();
        const shot = document.getElementById(`shot-${data.id}`);
        if (shot) {
          emphasizeShot(shot, currentRinkType);
        }
        emphasizeRow(row.getElement());
      });

      coordTable.on('rowMouseOut', (e, row) => {
        const data = row.getData();
        const shot = document.getElementById(`shot-${data.id}`);
        if (shot) {
          deemphasizeShot(shot, currentRinkType);
        }
        deemphasizeRow(row.getElement());
      });

      exportBtn.addEventListener('click', () => {
        coordTable.download('csv', 'shotplot.csv');
      });
    } else {
      coordTable.setData(convertedData);
      coordTable.setSort('id', 'desc');
    }
  }

  const cleanTable = (rinkType) => {
    tableData = [];
    shotCounter = 0;
    buildTable(rinkType);
  };

  const setupRink = (rinkSelector) => {
    const rinkType = rinkSelector.options[rinkSelector.selectedIndex].value;

    document.getElementById('unit-selector').value = defaultUnits[rinkType];

    const absRinkURL = new URL(rinkURL[rinkType], window.location.href);

    const ajax = new XMLHttpRequest();
    ajax.open('GET', absRinkURL.href, true);
    ajax.send();
    ajax.onload = () => {
      if (ajax.status === 404) {
        const rinkContainer = document.getElementById('rink');
        const alert = document.createElement('div');
        alert.classList.add('alert', 'alert-danger');
        alert.appendChild(document.createTextNode('There was an error loading the rink. Please try again later.'));
        rinkContainer.appendChild(alert);
      } else {
        const rinkContainer = document.getElementById('rink');
        rinkContainer.innerHTML = ajax.responseText;
        const rink = rinkContainer.getElementsByTagName('svg')[0];

        cleanTable(rinkType);

        // Hide svg title so browser tooltip is not shown on hover
        rink.addEventListener('mouseover', (event) => {
          const svg = event.currentTarget;
          svg.setAttribute('data-title', svg.getElementsByTagName('title')[0].innerHTML);
          svg.getElementsByTagName('title')[0].innerHTML = '';
        });

        // Replace svg title
        rink.addEventListener('mouseout', (event) => {
          const svg = event.currentTarget;
          svg.getElementsByTagName('title')[0].innerHTML = svg.getAttribute('data-title');
          svg.removeAttribute('data-title');
        });

        rink.addEventListener('mousedown', (event) => {
          shotCounter += 1;
          const shotLocation = cursorPoint(event);
          const coordinates = {
            x: shotLocation.x,
            y: shotLocation.y,
            id: shotCounter,
          };

          // add coordinates to table
          tableData.unshift(coordinates);

          // build table
          buildTable(rinkType);

          // draw a circle on the rink at shot location
          drawCircle(rink, shotCounter, shotLocation, rinkType);
        }, false);
      }
    };
  };

  const rinkSelector = document.getElementById('rink-selector');
  rinkSelector.addEventListener('change', (e) => setupRink(e.currentTarget));
  unitSelector.addEventListener('change', () => buildTable(rinkSelector.options[rinkSelector.selectedIndex].value));

  setupRink(rinkSelector);
});
