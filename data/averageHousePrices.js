'use strict';

// amount of decimals used in lat, lng grid.
const decimals = 1;

const data = getData();
console.log('***** data.length', data.length);
const summary = getDataSummary(data);
console.log('***** summary', summary)

const minLng = summary.lng.min;
const maxLng = summary.lng.max;

const minLat = summary.lat.min;
const maxLat = summary.lat.max;

const lngs = createNumberSequence(minLng, maxLng);
const lats = createNumberSequence(minLat, maxLat);
console.log('***** lngs', lngs.length)
console.log('***** lats', lats.length)

const result = [];

let d = getDataRow();

for (let lng of lngs) {
  for (let lat of lats) {
    if (!d) {
      console.log('no more data rows');
    } else {
      // console.log(`${lng}=${d.lng}? ${lat}=${d.lat}? ${d.lng === lng && d.lat === lat}`);
      if (d.lng === lng && d.lat === lat) {
        // console.log(`${lng}-${lat} √`);
        result.push(get3DPoint(d));
        d = getDataRow();
      } else {
        // console.log(`${lng}-${lat}`);
        result.push(get3DPoint({
          lng: lng,
          lat: lat,
        }));
      }
    }
  }
}

console.log('***** result.length', result.length);

const min = {
  x: result[0].x,
  y: result[0].y,
  z: result[0].z,
};
const max = {
  x: result[0].x,
  y: result[0].y,
  z: result[0].z,
};

for (let d of result) {
  min.x = d.x < min.x ? d.x : min.x;
  min.y = d.y < min.y ? d.y : min.y;
  min.z = d.z < min.z ? d.z : min.z;
  max.x = d.x > max.x ? d.x : max.x;
  max.y = d.y > max.y ? d.y : max.y;
  max.z = d.z > max.z ? d.z : max.z;
}
// console.log('***** min', min);
// console.log('***** max', max);

result.map(function(d) {
  // console.log('***** old', d);
  d.x -= min.x;
  d.y -= min.y;
  // console.log('***** new', d);
  return d;
});

// throw Error()
window.housePriceData = result;
console.log('***** result', result)
function getDataRow() {
  const d = data.shift();
  if (!d) return;
  return {
    lng: d.geo[0],
    lat: d.geo[1],
    averagePrice: Math.floor(d.averagePrice / 100 / 1000 * 3),
  };
}

function get3DPoint(dataPoint) {
  const point = getMercatorPoint([dataPoint.lng, dataPoint.lat]);
  return {
    lng: dataPoint.lng,
    lat: dataPoint.lat,
    x: point.x,
    y: point.y,
    z: dataPoint.averagePrice || 0,
  };
}



function getMercatorPoint(geolocation) {
  var dot_size = 3;
  var longitude_shift = 55;   // number of pixels your map's prime meridian is off-center.
  var map_width = 10000;
  var map_height = 20000;
  var x_pos = 0;
  var y_pos = 0;
  var half_dot = Math.floor(dot_size / 2);
  let lng = geolocation[0];
  let lat = geolocation[1];
  let x, y;
  // Mercator projection

  // longitude: just scale and shift
  x = (map_width * (180 + lng) / 360) % map_width + longitude_shift;

  // latitude: using the Mercator projection
  lat = lat * Math.PI / 180;  // convert from degrees to radians
  y = Math.log(Math.tan((lat/2) + (Math.PI/4)));  // do the Mercator projection (w/ equator of 2pi units)
  y = (map_height / 2) - (map_width * y / (2 * Math.PI)) + y_pos;   // fit it to our map

  x -= x_pos;
  y -= y_pos;

  return {
    x: Math.floor(x),
    y: Math.floor(y),
  };
}

function getDataSummary(data) {
  let dataPoint = data[0];
  let lng = dataPoint.geo[0];
  let lat = dataPoint.geo[1];

  const summary = { // pre-fill with data from fist datapoint
    lng: {
      min: lng,
      max: lng,
    },
    lat: {
      min: lat,
      max: lat,
    },
  };

  for (let i=0;i<data.length;i++) {
    dataPoint = data[i];

    lng = dataPoint.geo[0];
    lat = dataPoint.geo[1];

    if (lng > summary.lng.max) summary.lng.max = lng;
    if (lng < summary.lng.min) summary.lng.min = lng;
    if (lat > summary.lat.max) summary.lat.max = lat;
    if (lat < summary.lat.min) summary.lat.min = lat;
  }

  return summary;
}

function createNumberSequence(min, max) {
  const sequence = [];
  const multiplier = decimals == 0 ? 1 : (decimals * 10);
  const rounder = Math.pow(10, decimals + 1)
  for (let i = 0;i <= (max - min) * multiplier;i++) {
    let num = min + i/multiplier;
    sequence.push(Math.round(num * rounder) / rounder);
  }
  return sequence;
}
