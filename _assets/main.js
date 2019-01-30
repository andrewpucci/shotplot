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

  function cursorPoint(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(rink.getScreenCTM().inverse());
  }

  function drawCircle(elem, id, shotLocation) {
    const ns = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("id", id);
    circle.classList.add("shot");
    circle.setAttribute("cx", shotLocation.x);
    circle.setAttribute("cy", shotLocation.y);
    circle.setAttribute("r", 45);
    circle.setAttribute("fill", shotColor);
    circle.addEventListener("mouseover", function(evt) {
      this.setAttribute("r", 45);
      this.parentElement.querySelectorAll(".shot").forEach((item) => {
        item.classList.add("faded");
      });
      this.classList.remove("faded");
    });
    circle.addEventListener("mouseout", function(evt) {
      this.setAttributeNS(null, "r", 25);
      this.parentElement.querySelectorAll(".shot").forEach((item) => {
        item.classList.remove("faded");
      });
    });
    elem.appendChild(circle);
  }

  function generateX(num, unitType) {
    if (unitType === "cm") {
      return Math.round((num - xOffset.NA) * 2.54, 1);
    } else if (unitType === "in") {
      return Math.round(num - xOffset.NA, 1);
    } else if (unitType === "ft") {
      return Math.round((num - xOffset.NA) / 12, 1);
    }
  }

  function generateY(num, unitType) {
    if (unitType === "cm") {
      return Math.round(-(num - yOffset.NA) * 2.54, 1);
    } else if (unitType === "in") {
      return Math.round(-(num - yOffset.NA), 1);
    } else if (unitType === "ft") {
      return Math.round(-(num - yOffset.NA) / 12, 1);
    }
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
  }

  unitSelector.addEventListener("change", () => {
    buildTable();
  });

  rink.addEventListener("mouseover", function(evt) {
    this.setAttribute("data-title", this.getElementsByTagName("title")[0].innerHTML);
    this.getElementsByTagName("title")[0].innerHTML = "";
  });

  rink.addEventListener("mouseout", function(evt) {
    this.getElementsByTagName("title")[0].innerHTML = this.getAttribute("data-title");
    this.removeAttribute("data-title");
  });

  rink.addEventListener(
    "mousedown",
    evt => {
      const shotID = ++shotCounter;
      const shotLocation = cursorPoint(evt);
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
