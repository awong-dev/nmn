# nmn
now matters now hacking

# Basic instructions
1. install [nvm](https://github.com/creationix/nvm)
2. Use at least node version 6, but I suggest grabbing version 8 (the current LTS)
3. Run `npm install` To install all the stuff in packages.json
4. Run `npm run watch`. This will run a "webpack dev server" that will effectively compile/run your code as you edit files.
5. Navigate to `localhost:8080/webpack-dev-server/`. Note the trailing slash is important.

With this, you should have a working development environment.

The source code uses a bunch of intersecting technologies, the largest of which are
  * Webpack -- Effectively your compiler frontent (and also the web server in this case)
  * React -- A new style of writing "single page apps" using Javascript where the (psuedo) HTML is embedded in your code like a widget.
  * Babel -- The compiler backend.  Javascript is going through multiple major revisions. Babel ensures you can use the latest features by compiling ("transpiling") them down into the commonly implemented subset.
  * Sass -- A meta-language for CSS. Much easier to manipulate
  * [Material Components for the web](https://material.io/components/web/) -- Google's CSS library. You need soething like this to avoid rewriting all the nav bars, etc.  Bootstrap and Foundation are alternatives that might have actually been better suited... I picked material cause I wanted to play with it. Not sure what to think of it at this point...
  * [D3.js](https://d3js.org/) -- The actual charting library. Been learning this thing...slowly. It's got a steep learning curve, but seems quite powerful.
  * Firebase - A collection of tools for developing apps backed by the "cloud" from Google. Using this for authentication and serving up of the data file. Also serves up the static html, but that's just a convenience.

This is a _lot_ of technologies but the setup for almost all of them are just boilerplate (interesting boilerplate, but still just boilerplate that doesn't need to change much).

If you want to modify graphs, start at

  https://github.com/awong-dev/nmn/blob/master/client/components/DeltaGraph.jsx
    and
  https://github.com/awong-dev/nmn/blob/master/client/components/App.jsx#L28

Which should narrow the scope down to messing with D3, and learning some basic React.
