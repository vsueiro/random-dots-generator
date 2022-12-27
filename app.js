// Select <form> from HTML
let form = document.querySelector("form");

function getOptions(form) {
  // Extract form data
  let formData = new FormData(form);

  // Turn form data into object
  let options = Object.fromEntries(formData);

  // Parse specific properties as numbers or booleans
  const Numbers = ["amount", "radius", "width", "height", "margin", "padding"];
  const Booleans = ["preventOverlap"];

  for (let key in options) {
    if (Numbers.includes(key)) {
      options[key] = Number(options[key]);
    } else if (Booleans.includes(key)) {
      if (options[key] === "on") {
        options[key] = true;
      } else {
        options[key] = false;
      }
    }
  }

  return options;
}

const element = document.querySelector(".Dots");
const options = getOptions(form);
const dots = new Dots(element, options);

form.addEventListener("input", function () {
  // Update dots
  const options = getOptions(form);
  dots.redraw(options);
});
