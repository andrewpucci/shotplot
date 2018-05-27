(function() {
  var svg = document.querySelector("svg");
  var pt = svg.createSVGPoint();
  function cursorPoint(evt) {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  svg.addEventListener(
    "mousedown",
    function(evt) {
      const loc = cursorPoint(evt);
      const coordinates = new Map();
      coordinates.set("x", Math.round((loc.x - 1202) * 2.54, 1));
      coordinates.set("y", Math.round(-(loc.y - 512) * 2.54, 1));

      const newP = document.createElement("p");
      const coords = document.createTextNode(
        `${coordinates.get("x")}, ${coordinates.get("y")}`
      );

      newP.appendChild(coords);

      const list = document.getElementById("c-home");
      list.insertBefore(newP, list.childNodes[0]);
      console.log(coordinates.get("x"), coordinates.get("y"));
    },
    false
  );
})();
