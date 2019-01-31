document.addEventListener("DOMContentLoaded", (event) => {
  const rink = document.getElementById("rink");
  const unitSelector = document.getElementById("unit-selector");
  const pt = rink.createSVGPoint();
  const xOffset = { NA: 1202 };
  const yOffset = { NA: 512 };
  const rinkType = "NA";
  const shotColor = "#D59E0D";
  let tableData = [];
  let shotCounter = 0;

  function cursorPoint(event) {
    pt.x = event.clientX;
    pt.y = event.clientY;
    return pt.matrixTransform(rink.getScreenCTM().inverse());
  }

  function emphasizeShot(shot) {
    shot.setAttribute("r", 45);
    shot.parentElement.querySelectorAll(".shot").forEach((item) => {
      item.classList.add("faded");
    });
    shot.classList.remove("faded");
  }

  function deemphasizeShot(shot) {
    shot.setAttribute("r", 25);
    shot.parentElement.querySelectorAll(".shot").forEach((item) => {
      item.classList.remove("faded");
    });
  }

  function emphasizeRow(row) {
    row.classList.add("emphasized-row");
  }

  function deemphasizeRow(row) {
    row.classList.remove("emphasized-row");
  }

  function drawCircle(elem, id, shotLocation) {
    const ns = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("id", `shot-${id}`);
    circle.classList.add("shot");
    circle.setAttribute("cx", shotLocation.x);
    circle.setAttribute("cy", shotLocation.y);
    circle.setAttribute("r", 45);
    circle.setAttribute("fill", shotColor);
    circle.addEventListener("mouseover", (event) => {
      emphasizeShot(event.currentTarget);
      try {
        emphasizeRow(document.getElementById(`row-${id}`));
      }
      catch(error) {
        console.error("Row cannot be highlighted because shot is not listed in current table view.");
      }
    });
    circle.addEventListener("mouseout", (event) => {
      deemphasizeShot(event.currentTarget);
      try {
        deemphasizeRow(document.getElementById(`row-${id}`));
      }
      catch(error) {
        console.error("Row cannot be highlighted because shot is not listed in current table view.");
      }
    });
    elem.appendChild(circle);
  }

  function generateX(num, unitType) {
    const formulas = {
      "cm": Math.round((num - xOffset.NA) * 2.54, 1),
      "in": Math.round(num - xOffset.NA, 1),
      "ft": Math.round((num - xOffset.NA) / 12, 1)
    };
    return formulas[unitType];
  }

  function generateY(num, unitType) {
    const formulas = {
      "cm": Math.round(-(num - yOffset.NA) * 2.54, 1),
      "in": Math.round(-(num - yOffset.NA), 1),
      "ft": Math.round(-(num - yOffset.NA) / 12, 1)
    }
    return formulas[unitType];
  }

  function convertUnits(coordinates) {
    const unitType = unitSelector.options[unitSelector.selectedIndex].value;
    let converted = {};
    converted.x = generateX(coordinates.x, unitType);
    converted.y = generateY(coordinates.y, unitType);
    converted.id = coordinates.id;
    return converted;
  }

  function buildTable() {
    let convertedData = [];
    for (var key of Object.keys(tableData)) {
      convertedData.push(convertUnits(tableData[key]));
    }

    const table = $("#coord-table");
    table.removeClass("d-none");
    document.getElementById("unit-selector").classList.add("mb-3");
    table.DataTable({
      dom: "rt<'mb-3' i><'row'<'col-6' B><'col-6' p>>",
      destroy: true,
      data: convertedData,
      ordering: true,
      order: [0, 'desc'],
      columns: [
        { title: "Shot", data: "id" },
        { title: "X", data: "x" },
        { title: "Y", data: "y" },
      ],
      rowId: (convertedData) => { return `row-${convertedData.id}`},
      createdRow: function(row, data, dataIndex) {
        row.addEventListener("mouseover", (event) => {
          emphasizeShot(document.getElementById(`shot-${row.children[0].innerHTML}`));
          emphasizeRow(row);
        });
        row.addEventListener("mouseout", (event) => {
          deemphasizeShot(document.getElementById(`shot-${row.children[0].innerHTML}`));
          deemphasizeRow(row);
        });
      },
      buttons: [
        {
          extend: "csvHtml5",
          text: "Export to CSV",
        },
      ],
      pagingType: "simple"
    });
  }

  unitSelector.addEventListener("change", buildTable);

  // Hide svg title so browser tooltip is not shown on hover
  rink.addEventListener("mouseover", (event) => {
    const svg = event.currentTarget;
    svg.setAttribute("data-title", svg.getElementsByTagName("title")[0].innerHTML);
    svg.getElementsByTagName("title")[0].innerHTML = "";
  });

  // Replace svg title
  rink.addEventListener("mouseout", (event) => {
    const svg = event.currentTarget;
    svg.getElementsByTagName("title")[0].innerHTML = svg.getAttribute("data-title");
    svg.removeAttribute("data-title");
  });

  rink.addEventListener("mousedown", (event) => {
    const shotID = ++shotCounter;
    const shotLocation = cursorPoint(event);
    let coordinates = {
      x: shotLocation.x,
      y: shotLocation.y,
      id: shotID
    };

    // add coordinates to table
    tableData.unshift(coordinates);

    // build table
    buildTable();

    // draw a circle on the rink at shot location
    drawCircle(rink, shotID, shotLocation);
  }, false);
});
