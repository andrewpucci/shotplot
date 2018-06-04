(function() {
  const rink = document.getElementById("svg2457");
  const pt = rink.createSVGPoint();
  const xOffset = { NA: 1202 };
  const yOffset = { NA: 512 };
  const rinkType = "NA";
  const shotColor = "#F06";
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
    circle.setAttributeNS(null, "id", id);
    circle.setAttributeNS(null, "cx", shotLocation.x);
    circle.setAttributeNS(null, "cy", shotLocation.y);
    circle.setAttributeNS(null, "r", 25);
    circle.setAttributeNS(null, "fill", shotColor);
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

  rink.addEventListener(
    "mousedown",
    function(evt) {
      const shotID = `shot-${++shotCounter}`;
      const shotLocation = cursorPoint(evt);
      const unitSelector = document.getElementById("unit-selector");
      const unitType = unitSelector.options[unitSelector.selectedIndex].value;
      const coordinates = {
        x: generateX(shotLocation.x, unitType),
        y: generateY(shotLocation.y, unitType),
        id: shotID
      };

      // add coordinates to table
      tableData.unshift(coordinates);
      $("#coord-table").DataTable({
        dom: "B<'clear'>rt<'clear'>i<'clear'>p",
        destroy: true,
        data: tableData,
        ordering: false,
        columns: [
          { title: "X", data: "x" },
          { title: "Y", data: "y" },
          { title: "ID", data: "id", visible: false }
        ],
        buttons: [
          {
            extend: "csvHtml5",
            text: "Export to CSV"
          }
        ]
      });

      // draw a circle on the rink at shot location
      drawCircle(rink, shotID, shotLocation);
    },
    false
  );
})();
