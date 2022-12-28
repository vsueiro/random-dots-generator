// Select <form> from HTML
let form = document.querySelector("form");

// Get JS object from HTML form
function getOptions(form) {
  // Extract form data
  let formData = new FormData(form);

  // Turn form data into object
  let options = Object.fromEntries(formData);

  // Parse specific properties as numbers or booleans
  const Numbers = ["amount", "radius", "width", "height", "margin", "padding"];
  const Booleans = ["preventOverlap"];

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

// Update drawing when form changes
form.addEventListener("input", function () {
  // Allow wrapper dimensions to update when form values change
  element.style = "";

  // Update dots
  const options = getOptions(form);
  dots.redraw(options);
});

// Update form inputs when wrapper is resized
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    // Get new dimensions
    let width = entry.contentRect.width;
    let height = entry.contentRect.height;

    console.log(width, height);

    // Update form fields with new dimensios
    form.querySelector('[name="width"]').value = width;
    form.querySelector('[name="height"]').value = height;

    // Get current form values
    const options = getOptions(form);

    // Recreate dots with new dimensions
    dots.redraw(options);
  }
});

// Listen for user resize of wrapper
resizeObserver.observe(element);
