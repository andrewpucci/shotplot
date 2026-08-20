import {
  convertTableData,
  DEFAULT_UNITS,
  RINK_URLS,
} from './shot-logic.js';
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

  function cursorPoint(event) {
    const pt = event.currentTarget.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(event.currentTarget.getScreenCTM().inverse());
  }

  function drawCircle(elem, id, shotLocation, rinkType) {
    appendShotCircle(elem, id, shotLocation, rinkType, {
      onMouseOver() {
        try {
          emphasizeRow(document.getElementById(`row-${id}`));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Row cannot be highlighted because shot is not listed in current table view.');
        }
      },
      onMouseOut() {
        try {
          deemphasizeRow(document.getElementById(`row-${id}`));
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Row cannot be highlighted because shot is not listed in current table view.');
        }
      },
    });
  }

  function buildTable(rinkType) {
    const unitType = unitSelector.options[unitSelector.selectedIndex].value;
    const convertedData = convertTableData(tableData, unitType, rinkType);

    const table = $('#coord-table');
    table.removeClass('d-none');
    document.getElementById('unit-selector').classList.add('mb-3');
    table.DataTable({
      dom: "rt<'mb-3' i><'row'<'col-6' B><'col-6' p>>",
      destroy: true,
      data: convertedData,
      ordering: true,
      order: [0, 'desc'],
      columns: [
        { title: 'Shot', data: 'id' },
        { title: 'X', data: 'x' },
        { title: 'Y', data: 'y' },
      ],
      rowId: (row) => `row-${row.id}`,
      createdRow(row, data) {
        row.addEventListener('mouseover', () => {
          emphasizeShot(document.getElementById(`shot-${data.id}`), rinkType);
          emphasizeRow(row);
        });
        row.addEventListener('mouseout', () => {
          deemphasizeShot(document.getElementById(`shot-${data.id}`), rinkType);
          deemphasizeRow(row);
        });
      },
      buttons: [
        {
          extend: 'csvHtml5',
          text: 'Export to CSV',
        },
      ],
      pagingType: 'simple',
    });
  }

  const cleanTable = (rinkType) => {
    tableData = [];
    shotCounter = 0;
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
