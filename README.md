# Random Dots Generator

Create an image with hundreds of tiny circles (with no overlaps!). Put them inside a rectangle or a circle. Save it as an `SVG` or `PNG` file.

This tool prevents circles from overlapping using a simple trial-and-error approach. This means that it will try to place a circle on the canvas at random places, as long as that place does not intersect with an existing circle.

The tool has a limit of a 1000 tries. If it is not able to place a new dot, it will throw a warning on the UI and on the console. It will also stop executing.

This algorithm is very naive. If you have suggestions on improving it, feel free to collaborate with this repository! For example, a better approach might be to find the most “open” spot and try to place a dot there. If it’s not possible, it could nudge existing dots a little bit to make room for the new one.

If you want to use it for more custom projects, use `Dots.js` file. It constains a class that you can initialize with a few options (like the size and amount of dots you want). By creating many instances of the `Dots` class, you can create more complex graphics – or beautiful artworks :).

Play with the tool here:

[https://vsueiro.com/random-dots-generator/]()
