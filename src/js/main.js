import 'bootstrap';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator_bootstrap5.min.css';

import { convertTableData, DEFAULT_UNITS, RINK_URLS } from './shot-logic.js';
import {
  appendShotCircle,
  deemphasizeRow,
  deemphasizeShot,
  emphasizeRow,
  emphasizeShot,
} from './shot-dom.js';

document.addEventListener('DOMContentLoaded', () => {
  const unitSelector = document.getElementById('unit-selector');
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

  function emphasizeRowById(id) {
    if (!coordTable) {
      return;
    }

    const row = coordTable.getRow(id);
    if (!row) {
      return;
    }

    const element = row.getElement();
    if (element) {
      emphasizeRow(element);
    }
  }

  function deemphasizeRowById(id) {
    if (!coordTable) {
      return;
    }

    const row = coordTable.getRow(id);
    if (!row) {
      return;
    }

    const element = row.getElement();
    if (element) {
      deemphasizeRow(element);
    }
  }

  function drawCircle(elem, id, shotLocation, rinkType) {
    appendShotCircle(elem, id, shotLocation, rinkType, {
      onMouseOver() {
        emphasizeRowById(id);
      },
      onMouseOut() {
        deemphasizeRowById(id);
      },
    });
  }

  function buildTable(rinkType) {
    currentRinkType = rinkType;
    const unitType = unitSelector.options[unitSelector.selectedIndex].value;
    const convertedData = convertTableData(tableData, unitType, rinkType);

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
        rowFormatter(row) {
          row.getElement().id = `row-${row.getData().id}`;
        },
        columns: [
          { title: 'Shot', field: 'id', sorter: 'number', headerSort: true },
          { title: 'X', field: 'x', sorter: 'number', headerSort: true },
          { title: 'Y', field: 'y', sorter: 'number', headerSort: true },
        ],
      });

      coordTable.on('rowMouseOver', (_event, row) => {
        const data = row.getData();
        const shot = document.getElementById(`shot-${data.id}`);
        if (shot) {
          emphasizeShot(shot, currentRinkType);
        }
        emphasizeRow(row.getElement());
      });

      coordTable.on('rowMouseOut', (_event, row) => {
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

    if (coordTable) {
      coordTable.destroy();
      coordTable = null;
    }

    buildTable(rinkType);
  };

  const setupRink = (rinkSelector) => {
    const rinkType = rinkSelector.options[rinkSelector.selectedIndex].value;

    document.getElementById('unit-selector').value = DEFAULT_UNITS[rinkType];

    const absRinkURL = new URL(RINK_URLS[rinkType], window.location.href);

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
