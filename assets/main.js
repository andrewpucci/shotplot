(function() {
  var svg = document.querySelector("svg");
  var pt = svg.createSVGPoint();
  function cursorPoint(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  let tableData = [];

  svg.addEventListener(
    "mousedown",
    function(evt) {
      const loc = cursorPoint(evt);
      let coordinates = {};
      const element = document.getElementById("unit-selector");
      const unitType = element.options[element.selectedIndex].value;
      if (unitType === "cm") {
        coordinates = {
          x: Math.round((loc.x - 1202) * 2.54, 1),
          y: Math.round(-(loc.y - 512) * 2.54, 1)
        };
      } else if (unitType === "in") {
        coordinates = {
          x: Math.round(loc.x - 1202, 1),
          y: Math.round(-(loc.y - 512), 1)
        };
      } else if (unitType === "ft") {
        coordinates = {
          x: Math.round((loc.x - 1202) / 12, 1),
          y: Math.round(-(loc.y - 512) / 12, 1)
        };
      }

      const newP = document.createElement("p");
      const coords = document.createTextNode(
        `${coordinates["x"]}, ${coordinates["y"]}`
      );

      tableData.unshift(coordinates);
      $("#coord-table").DataTable({
        dom: "B<'clear'>rtip",
        destroy: true,
        data: tableData,
        ordering: false,
        columns: [{ title: "X", data: "x" }, { title: "Y", data: "y" }],
        buttons: ["csvHtml5"]
      });
    },
    false
  );
})();
