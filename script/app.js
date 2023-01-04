// Select <form> from HTML
let form = document.querySelector("form");

// Get JS object from HTML form
function getOptions(form) {
  // Extract form data
  let formData = new FormData(form);

  // Turn form data into object
  let options = Object.fromEntries(formData);

  // Parse specific properties as numbers or booleans
  const Numbers = [
    "amount",
    "radius",
    "width",
    "height",
    "margin",
    "padding",
    "foregroundOpacity",
    "backgroundOpacity",
    "highlightAmount",
    "highlightRadius",
    "highlightForegroundOpacity",
  ];
  const Booleans = ["overlap"];

  // For each value in the form
  for (let key in options) {
    // If it’s supposed to be a number
    if (Numbers.includes(key)) {
      // Convert it to a number
      options[key] = Number(options[key]);
    }
    // If it’s supposed to be a boolean
    else if (Booleans.includes(key)) {
      // Convert it to a boolean
      if (options[key] === "on") {
        options[key] = true;
      }
    }
  }

  // Return converted object
  return options;
}

// Initialize Dots
const element = document.querySelector(".Dots");
const options = getOptions(form);
const dots = new Dots(element, options);

// Update count
function showCount() {
  // Hides error via JS because Firefox doesn’t like :has selector
  const error = document.querySelector(".error");
  const message = document.querySelector(".error-message");

  if (dots.count < dots.amount) {
    message.innerHTML = `
      Too many dots to prevent overlap.
      <span>
        Only ${dots.count} created.
      </span>
    `;
    error.style.visibility = "visible";
  } else {
    message.innerHTML = ``;
    error.style.visibility = "hidden";
  }
}

function redraw() {
  // Get current form values
  const options = getOptions(form);

  console.log(options.width);

  // Recreate dots with new dimensions
  dots.redraw(options);

  // Display number of created dots
  showCount();

  // Add all options as data-attributes to the <form> element
  for (let key in options) {
    element.dataset[key] = options[key];
  }
}

// Update drawing when form changes
form.addEventListener("input", () => {
  // Allow wrapper dimensions to update when form values change
  element.style = "";

  const options = getOptions(form);

  // Disable width input if shape is circle
  if (options.shape === "circle") {
    form.querySelector('[name="width"]').readOnly = true;
  } else {
    form.querySelector('[name="width"]').readOnly = false;
  }

  // Disable margin input if overlap is on
  if (options.overlap) {
    form.querySelector('[name="margin"]').readOnly = true;
  } else {
    form.querySelector('[name="margin"]').readOnly = false;
  }

  // Update dots
  redraw();
});

// Update form inputs when wrapper is resized
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    // Get new dimensions
    let width = entry.contentRect.width;
    let height = entry.contentRect.height;

    // Get current form values
    const options = getOptions(form);

    if (options.shape === "circle") {
      width = height;
    }

    // Update form fields with new dimensios
    form.querySelector('[name="width"]').value = width;
    form.querySelector('[name="height"]').value = height;

    redraw();
  }
});

// Listen for user resize of wrapper
resizeObserver.observe(element);

// Enable download button
const downloadButton = document.querySelector(".download");
downloadButton.addEventListener("click", () => {
  dots.download();
});

// Enable redraw button
const variantButton = document.querySelector(".variant");
variantButton.addEventListener("click", () => {
  redraw();
});

// Create sample
(function () {
  // Define cute palette
  const colors = [
    // "#F8F8FF", // GhostWhite
    "#E6E6FA",
    "#DDA0DD",
    "#663399",
    "#4B0082",
    "#FF69B4",
    "#FF1493",
    "#B0E0E6",
    "#40E0D0",
    "#FF7F50",
    "#FF6347",
  ];

  const element = document.querySelector(".Sample");
  const options = {
    width: 120,
    height: 120,
    padding: 12,
    amount: 100,
    radius: 2,
    margin: 1.5,
    highlightAmount: 10,
    highlightRadius: 3,
  };

  // Get random item from array AND exclude it from the array
  function randomIndex(list) {
    return Math.floor(Math.random() * list.length);
  }

  let sample;

  // Define function to randomize sample graphics
  function randomize() {
    // Create a temporary clone of the original colors
    let palette = [...colors];

    // Create a temporary variable to hold an index from the array
    let index;

    // Define fields that should get random colors
    let fields = ["foreground", "background", "highlightForeground"];

    for (let field of fields) {
      // Get random index
      index = randomIndex(palette);

      // Use color from that index
      options[field] = palette[index];

      // Delete color from palette (to prevent it from repeating)
      palette.splice(index, 1);
    }

    // Randomize shape
    options.shape = Math.random() > 0.5 ? "circle" : "rectangle";

    // Redraw graphics with new options

    // If an instance already exists
    if (sample) {
      // Update that instance
      sample.redraw(options);
    }
    // If this function is running for the first time
    else {
      // Create an instance
      sample = new Dots(element, options);
    }
  }

  // Create first randomized graphics
  randomize();

  // Call randomize function every .5 seconds
  setInterval(randomize, 500);
})();

// Show icons
feather.replace();

// Upate color picker value
(function () {
  let colorInputs = document.querySelectorAll('input[type="color"]');

  function updateColorPicker(event) {
    let colorInput = event.target;
    let colorPicker = colorInput.nextElementSibling;

    colorPicker.style.backgroundColor = colorInput.value;
  }

  for (let colorInput of colorInputs) {
    colorInput.addEventListener("input", updateColorPicker);
  }
})();
