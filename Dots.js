class Dots {
  constructor(element, options) {
    // Renderer
    this.renderer = options.renderer;
    this.svg = this.renderer === "svg" ? element : undefined;
    this.canvas = this.renderer === "canvas" ? element : undefined;

    // Dots
    this.amount = options.amount;
    this.radius = options.radius;
    this.margin = options.margin;
    this.foreground = options.foreground;
    this.preventOverlap = options.preventOverlap;

    // Canvas
    this.width = options.width;
    this.height = options.height;
    this.padding = options.padding;
    this.background = options.background;
    this.shape = options.shape;

    console.log(this);
  }

  /*

  // Function to calculate distance between two points
  distance(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }

  // Function to check if a dot overlaps with other dots
  overlaps(x, y) {
    // If number of tries exceeds an arbiratry big number
    if (tries[current] > 1000) return false;

    for (let point of points) {
      // Calculates distance between current point and all other points
      let hypot = distance(x, y, point.x, point.y);

      // Checks if they overlap
      if (hypot < radius * 2) {
        // Increments number of tries for this specific dot
        tries[current] = tries[current] + 1;
        // console.log( 'Dot #' + current + ' overlaps. Try #' + tries[ current ] );

        return true;
      }
    }
  }

  coordinates() {
    // Calculates random coordinates
    let x = random(0 + padding, width - padding);
    let y = random(0 + padding, height - padding);

    // Checks if there is an overlap with other dots, then randomize again
    if (this.overlaps(x, y)) return this.coordinates();

    // If there is no overlap, puts them into an object
    let point = {
      x: x,
      y: y,
    };

    // Stores it in the array of coordinates
    points.push(point);

    // Returns it
    return point;
  }

  create() {
    let params = new URLSearchParams(window.location.search);

    let width = params.get("w") ? Number(params.get("w")) : 640;
    let height = params.get("h") ? Number(params.get("h")) : 360;

    let amount = params.get("amount") ? Number(params.get("amount")) : 1000;
    let radius = params.get("radius") ? Number(params.get("radius")) : 2;

    let padding = params.get("padding") ? Number(params.get("padding")) : 2;

    let current = 0;
    let points = [];
    let tries = [];

    // Stretch svg to fit viewport dimensions
    svg.setAttribute("height", height);
    svg.setAttribute("width", width);

    wrapper.style.width = width + "px";
    wrapper.style.height = height + "px";

    // TEMP
    const background = "#ffffff";

    // Draw background <rect>
    let rect = document.createElementNS(namespace, "rect");
    rect.setAttributeNS(null, "x", 0);
    rect.setAttributeNS(null, "y", 0);
    rect.setAttributeNS(null, "width", width);
    rect.setAttributeNS(null, "height", height);
    rect.setAttributeNS(null, "fill", background);
    svg.append(rect);

    for (let i = 0; i < amount; i++) {
      current = i;
      // console.log( 'Creating dot #' + current );

      // Create new circle
      let circle = document.createElementNS(namespace, "circle");

      // Defines initial number of tries for random positions (without overlap)
      tries[current] = 0;

      // Get random coordinates that do not overlap with other dots
      let position = coordinates();

      // Define its positions
      circle.setAttributeNS(null, "cx", position.x);
      circle.setAttributeNS(null, "cy", position.y);

      // Assings radius
      circle.setAttributeNS(null, "r", radius);

      // TEMP
      let foreground = "#000000";

      // Styles circle
      circle.setAttributeNS(
        null,
        "style",
        "fill: " + foreground + "; stroke: none; stroke-width: 0;"
      );

      // Add circle to the svg
      svg.appendChild(circle);
    }
  }

  update() {
    // Deletes all elements
    this.clear(svg);

    // Creates everything again
    this.create();
  }

  // Deletes all children from an element
  clear(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // Function to generate random float between two numbers
  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Download svg content
  download() {
    const svg = wrapper.innerHTML;
    const blob = new Blob([svg.toString()]);
    const a = document.createElement("a");

    a.download = "dots.svg";
    a.href = window.URL.createObjectURL(blob);
    a.click();
    a.remove();
  }
  */
}
