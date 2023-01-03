// TODO: When changing only color, do not redraw whole chart, only update existing dots and background

class Dot {
  constructor(instance) {
    // Gets access to all properties of the Dots class
    this.instance = instance;

    // Calculates random coordinates
    this.x = this.random(this.min.x, this.max.x);
    this.y = this.random(this.min.y, this.max.y);

    // Define properties of highlighted dot
    if (this.isHighlight) {
      this.radius = this.instance.highlightRadius;
      this.foreground = this.instance.highlightForeground;
      this.foregroundOpacity = this.instance.highlightForegroundOpacity;
    }

    // Define properties of regular dot
    else {
      this.radius = this.instance.radius;
      this.foreground = this.instance.foreground;
      this.foregroundOpacity = this.instance.foregroundOpacity;
    }
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

  // Create a single SVG circle
  get markup() {
    return `<circle
      cx="${this.x}"
      cy="${this.y}"
      r="${this.radius}"
      fill="${this.foreground}"
      fill-opacity="${this.foregroundOpacity}"
    ></circle>`;
  }

  // Checks whether this dot should be highlighted
  get isHighlight() {
    const current = this.instance.count + 1;
    const limit = this.instance.amount - this.instance.highlightAmount;

    return current > limit;
  }

  // Draw dot on <canvas> element
  draw(context) {
    // Change opacity
    context.globalAlpha = this.foregroundOpacity;

    // Create a circle on canvas
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fillStyle = this.foreground;
    context.fill();
  }

  // Function to generate random float between two numbers
  random(min, max) {
    return Math.random() * (max - min) + min;
  }
}

class Dots {
  constructor(element, options) {
    this.element = element;

    this.setOptions(options);
    this.setRenderer(element);

    this.draw();
  }

  get count() {
    return this.list.length;
  }

  setOptions(options) {
    // Renderer
    this.renderer = options.renderer || "svg";

    // Canvas
    this.width = options.width || 640;
    this.height = options.height || 360;
    this.padding = options.padding || 24;
    this.background = options.background || "#F8F8FF";
    this.backgroundOpacity = options.backgroundOpacity || 1;
    this.shape = options.shape || "rectangle";

    // Dots
    this.amount = options.amount || 1000;
    this.radius = options.radius || 4;
    this.margin = options.margin || 2;
    this.foreground = options.foreground || "#E6E6FA";
    this.foregroundOpacity = options.foregroundOpacity || 1;
    this.preventOverlap = options.preventOverlap || true;

    // Highlights
    this.highlightAmount = options.highlightAmount || 0;
    this.highlightRadius = options.highlightRadius || 4;
    this.highlightForeground = options.highlightForeground || "#FF1493";
    this.highlightForegroundOpacity = options.highlightForegroundOpacity || 1;

    // Empty list of dots
    this.list = [];

    // Maximum tries
    this.triesLimit = 10000;

    // Context to draw shapes inside <canvas>
    this.context = undefined;
  }

  setRenderer(element = this.element) {
    // Clear element
    element.replaceChildren();

    // Define basic dimensions
    let width = this.width;
    let height = this.height;

    // If frame is a circle
    if (this.shape === "circle") {
      // Make both sides the same
      width = height;
    }

    // <svg>
    if (this.renderer === "svg") {
      const markup = `<svg
        width="${width}"
        height="${height}"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>`;

      element.innerHTML = markup;

      this.svg = element.querySelector("svg");
    }
    // <canvas>
    else if (this.renderer === "canvas") {
      const markup = `<canvas
        width="${width}"
        height="${height}"
      ></canvas>`;

      element.innerHTML = markup;

      this.canvas = element.querySelector("canvas");
      this.context = this.canvas.getContext("2d");
    }
  }

  append(markup) {
    this.svg.insertAdjacentHTML("beforeend", markup);
  }

  drawBackground() {
    // <svg>
    if (this.renderer === "svg") {
      let markup = ``;

      if (this.shape === "rectangle") {
        // Create a rectangle as background
        markup = `
          <rect
            x="0"
            y="0"
            width="${this.width}"
            height="${this.height}"
            fill="${this.background}"
            fill-opacity="${this.backgroundOpacity}"
          ></rect>
        `;
      } else if (this.shape === "circle") {
        // Create a circle as background
        markup = `
          <circle
            cx="${this.width / 2}"
            cy="${this.height / 2}"
            r="${this.height / 2}"
            fill="${this.background}"
            fill-opacity="${this.backgroundOpacity}"
          ></circle>
        `;
      }

      // Add shape to SVG
      this.append(markup);
    }
    // <canvas>
    else if (this.renderer === "canvas") {
      // Change opacity
      this.context.globalAlpha = this.backgroundOpacity;

      if (this.shape === "rectangle") {
        // Create a rectangle as background
        this.context.fillStyle = this.background;
        this.context.fillRect(0, 0, this.width, this.height);
      } else if (this.shape === "circle") {
        // Create a circle as background
        this.context.beginPath();
        this.context.arc(
          this.width / 2,
          this.height / 2,
          this.height / 2,
          0,
          2 * Math.PI
        );
        this.context.fillStyle = this.background;
        this.context.fill();
      }
    }
  }

  // Function to calculate distance between two points
  distance(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    return Math.sqrt(a * a + b * b);
  }

  // Calculates wheter dot is outside circle shape
  outside(dot) {
    // Calculate distance (hypotenuse) between dot center and canvas center
    let distance = this.distance(this.width / 2, this.height / 2, dot.x, dot.y);

    // Calculate minimum distance between center of canvas and center of dot
    let minDistance = this.height / 2 - dot.radius - this.padding;

    // If new dot is outside circle, return true
    return distance > minDistance;
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
    // Define stop flag to prevent browser from chashing
    let stop = false;

    // Create dots until they reach the defined amount
    for (let i = 0; i < this.amount; i++) {
      // Create new random dot
      let dot = new Dot(this);

      // If frame is a circle AND overlaps are not allowed
      if (this.shape === "circle" && this.preventOverlap) {
        // Count number of tries
        let tries = 0;

        // Keep generating random dots until one of them doesn’t overlap AND is inside the circle
        while (this.outside(dot) || this.overlaps(dot)) {
          dot = new Dot(this);
          tries++;

          if (tries > this.triesLimit) {
            this.warning("Too many dots to prevent overlap :/");
            stop = true;
            break;
          }
        }
      } else {
        // If frame is a circle
        if (this.shape === "circle") {
          // Keep generating random dots until one of them is inside the circle
          while (this.outside(dot)) {
            dot = new Dot(this);
          }
        }

        // If overlaps are not allowed
        if (this.preventOverlap) {
          // Count number of tries
          let tries = 0;

          // Keep generating random dots until one of them doesn’t overlap
          while (this.overlaps(dot)) {
            dot = new Dot(this);
            tries++;

            if (tries > this.triesLimit) {
              this.warning("Too many dots to prevent overlap :/");
              stop = true;
              break;
            }
          }
        }
      }

      // Prevent overlapping dot from being added
      if (stop) {
        break;
      }

      // Add new dot to list of existing dots
      this.list.push(dot);

      // <svg>
      if (this.renderer === "svg") {
        // Add the dot to the SVG
        this.append(dot.markup);
      }

      // <canvas>
      else if (this.renderer === "canvas") {
        // Draw dot on canvas
        dot.draw(this.context);
      }
    }
  }

  draw() {
    this.drawBackground();
    this.drawForeground();

    console.log(`Created ${this.count} dots.`);
  }

  redraw(options = this.options) {
    this.setOptions(options);
    this.setRenderer();
    this.draw();
  }

  download() {
    // Create temporary <a> element
    const a = document.createElement("a");

    // Define filename
    const filename = `${this.amount}-dots-${this.width}x${this.height}`;

    // <svg>
    if (this.renderer === "svg") {
      const svg = this.element.innerHTML;
      const blob = new Blob([svg.toString()]);

      // Convert SVG to URL
      a.href = window.URL.createObjectURL(blob);

      // Build download attribule
      a.download = `${filename}.svg`;
    }

    // <canvas>
    else if (this.renderer === "canvas") {
      // Convert canvas to data URL
      a.href = this.canvas.toDataURL();

      // Build download attribule
      a.download = `${filename}.png`;
    }

    // Simulate click on <a> element, to trigger download
    a.click();

    // Discard <a> element
    a.remove();
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
