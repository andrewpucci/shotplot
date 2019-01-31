(() => {
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
    });
    circle.addEventListener("mouseout", (event) => {
      deemphasizeShot(event.currentTarget);
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
      buttons: [
        {
          extend: "csvHtml5",
          text: "Export to CSV",
        },
      ],
      pagingType: "simple"
    });

    const rows = table[0].querySelectorAll("tbody tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].addEventListener("mouseover", (event) => {
        emphasizeShot(document.getElementById(`shot-${rows[i].children[0].innerHTML}`));
      });
      rows[i].addEventListener("mouseout", (event) => {
        deemphasizeShot(document.getElementById(`shot-${rows[i].children[0].innerHTML}`));
      })
    }
  }

  unitSelector.addEventListener("change", () => {
    buildTable();
  });

  rink.addEventListener("mouseover", function(event) {
    this.setAttribute("data-title", this.getElementsByTagName("title")[0].innerHTML);
    this.getElementsByTagName("title")[0].innerHTML = "";
  });

  rink.addEventListener("mouseout", function(event) {
    this.getElementsByTagName("title")[0].innerHTML = this.getAttribute("data-title");
    this.removeAttribute("data-title");
  });

  rink.addEventListener(
    "mousedown",
    event => {
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
    },
    false
  );
})();
