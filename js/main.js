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
      var loc = cursorPoint(evt);
      console.log(
        Math.round((loc.x - 1202) * 2.54, 1),
        Math.round(-(loc.y - 512) * 2.54, 1)
      );
    },
    false
  );
})();
