// Select <form> from HTML
const form = document.querySelector("form");

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

const svg = document.querySelector(".Dots-svg");
const options = getOptions(form);

const dots = new Dots(svg, options);

form.addEventListener("change", () => {
  // TODO: update dots
});
