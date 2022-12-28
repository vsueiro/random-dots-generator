class Dot {
  constructor(instance) {
    // Gets access to all properties of the Dots class
    this.instance = instance;

    // Calculates random coordinates
    this.x = this.random(this.min.x, this.max.x);
    this.y = this.random(this.min.y, this.max.y);

    this.radius = this.instance.radius;
    this.foreground = this.instance.foreground;
  }

  // Function to generate random float between two numbers
  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Calculate lower bounds
  get min() {
    return {
      x: 0 + this.instance.padding,
      y: 0 + this.instance.padding,
    };
  }

  // Calculate upper bounds
  get max() {
    return {
      x: this.instance.width - this.instance.padding,
      y: this.instance.height - this.instance.padding,
    };
  }

  // Create a single circle
  get markup() {
    return `<circle
      cx="${this.x}"
      cy="${this.y}"
      r="${this.radius}"
      fill="${this.foreground}"
    ></circle>`;
  }
}

class Dots {
  constructor(element, options) {
    this.element = element;

    this.setOptions(options);
    this.setRenderer(element);

    this.draw();
  }

  setOptions(options) {
    // Renderer
    this.renderer = options.renderer;

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

    // Empty list of dots
    this.list = [];

    // Maximum tries
    this.triesLimit = 10000;
  }

  setRenderer(element = this.element) {
    // Clear element
    element.replaceChildren();

    this.svg = undefined;
    this.canvas = undefined;

    if (this.renderer === "svg") {
      const markup = `<svg
        width="${this.width}"
        height="${this.height}"
      ></svg>`;

      element.innerHTML = markup;

      this.svg = element.querySelector("svg");
    }

    if (this.renderer === "canvas") {
      this.canvas = document.createElement("canvas");
      element.innerHTML = this.svg;
      this.canvas = element.querySelector("canvas");
    }
  }

  append(markup) {
    this.svg.insertAdjacentHTML("beforeend", markup);
  }

  drawBackground() {
    if (this.renderer === "svg") {
      // Create a rectangle as the background
      let markup = `
        <rect
          x="0"
          y="0"
          width="${this.width}"
          height="${this.height}"
          fill="${this.background}"
        ></rect>
      `;

      // Add rectangle to SVG
      this.append(markup);
    }
  }

  // Function to calculate distance between two points
  distance(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }

  overlaps(dot) {
    // Loop through all existing dots
    for (let existing of this.list) {
      // Calculate distance (hypotenuse) between dot centers
      let distance = this.distance(existing.x, existing.y, dot.x, dot.y);

      // Calculate minimum distance between the two circles
      let minDistance = existing.radius + dot.radius + this.margin;

      // If new dot overlaps with existing dot
      if (distance < minDistance) {
        // Stop checking and return true
        return true;
      }
    }

    // Return false if there were no collisions
    return false;
  }

  drawForeground() {
    if (this.renderer === "svg") {
      // Define stop flag to prevent browser from chashing
      let stop = false;

      // Create dots until they reach the defined amount
      for (let i = 0; i < this.amount; i++) {
        // Create new random dot
        let dot = new Dot(this);

        // If overlaps are not allowed
        if (this.preventOverlap) {
          // Count number of tries
          let tries = 0;

          // Keep generating random dots until one of them doesn’t overlap
          while (this.overlaps(dot)) {
            dot = new Dot(this);
            tries++;

            if (tries < 0) {
              console.log(tries);
            }

            if (tries > this.triesLimit) {
              this.warning("Too many dots to prevent overlap :/");
              stop = true;
              // this.reset();
              break;
            }
          }
        }

        // Add new dot to list of existing dots
        this.list.push(dot);

        // Add the dot to the SVG
        this.append(dot.markup);

        if (stop) {
          break;
        }
      }
    }
  }

  draw() {
    this.drawBackground();
    this.drawForeground();

    console.log(`Created ${this.count} dots.`);
  }

  get count() {
    if (this.renderer === "svg") {
      return this.svg.querySelectorAll("circle").length;
    }
  }

  redraw(options = this.options) {
    this.setOptions(options);
    this.setRenderer();
    this.draw();
  }

  download() {
    if (this.renderer === "svg") {
      const svg = this.element.innerHTML;
      const blob = new Blob([svg.toString()]);
      const a = document.createElement("a");

      a.download = "dots.svg";
      a.href = window.URL.createObjectURL(blob);
      a.click();
      a.remove();
    }
  }

  warning(message) {
    // TEMP: Show native alert
    console.warn(message);
  }

  reset() {
    // TEMP: Refresh whole page
    location.reload();
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
  */
}
