Three.js
==============

Just playing around with Three.js.

[Swedish house price visualisation](/housePrices.html)

Development
--------------

- `npm i`
- `npm run start`
- visit `http://localhost:3000/housePrices.html`

Resources
--------------

- https://threejs.org/
- https://aerotwist.com/tutorials/getting-started-with-three-js/
- http://blog.mastermaps.com/2013/10/terrain-building-with-threejs.html
- https://github.com/mrdoob/stats.js/

To do
--------------

1decimal branch:
- added data with 1decimal, but it's not yet in order so the visualisation is broken. check 0 decimals for how it should look
- the code is completely messy now: it needs refactoring. e.g.:
  - you need to change on 3 different places how many decimals the lng, lat grid has.
  - code is included with script tags
