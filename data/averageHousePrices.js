'use strict';

const data = getData();
console.log('***** data.length', data.length);
const minLng = 11;
const maxLng = 24;

const minLat = 55;
const maxLat = 68;

const lngs = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]; // 14 cells
const lats = [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]; // 14 cells

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
console.log('***** min', min);
console.log('***** max', max);

result.map(function(d) {
  console.log('***** old', d);
  d.x -= min.x;
  d.y -= min.y;
  console.log('***** new', d);
  return d;
});

// throw Error()
window.housePriceData = result;

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

function getData () {
  return [
    { geo: [ 11, 58 ], averagePrice: 3062150 },
    { geo: [ 11, 59 ], averagePrice: 2689813 },
    { geo: [ 12, 56 ], averagePrice: 1975000 },
    { geo: [ 12, 57 ], averagePrice: 3121608 },
    { geo: [ 12, 58 ], averagePrice: 2998915 },
    { geo: [ 12, 59 ], averagePrice: 1082763 },
    { geo: [ 12, 60 ], averagePrice: 1102841 },
    { geo: [ 12, 61 ], averagePrice: 422500 },
    { geo: [ 12, 62 ], averagePrice: 655000 },
    { geo: [ 12, 63 ], averagePrice: 1563625 },
    { geo: [ 13, 55 ], averagePrice: 3919600 },
    { geo: [ 13, 56 ], averagePrice: 2577897 },
    { geo: [ 13, 57 ], averagePrice: 2358935 },
    { geo: [ 13, 58 ], averagePrice: 1706614 },
    { geo: [ 13, 59 ], averagePrice: 1500145 },
    { geo: [ 13, 60 ], averagePrice: 987035 },
    { geo: [ 13, 61 ], averagePrice: 2428379 },
    { geo: [ 13, 62 ], averagePrice: 1104789 },
    { geo: [ 13, 63 ], averagePrice: 2417576 },
    { geo: [ 13, 64 ], averagePrice: 395000 },
    { geo: [ 14, 55 ], averagePrice: 2593230 },
    { geo: [ 14, 56 ], averagePrice: 1922068 },
    { geo: [ 14, 57 ], averagePrice: 1373105 },
    { geo: [ 14, 58 ], averagePrice: 1744742 },
    { geo: [ 14, 59 ], averagePrice: 1361500 },
    { geo: [ 14, 60 ], averagePrice: 847894 },
    { geo: [ 14, 61 ], averagePrice: 625423 },
    { geo: [ 14, 62 ], averagePrice: 1714603 },
    { geo: [ 14, 63 ], averagePrice: 1082373 },
    { geo: [ 14, 64 ], averagePrice: 1077500 },
    { geo: [ 15, 56 ], averagePrice: 1237340 },
    { geo: [ 15, 57 ], averagePrice: 1793766 },
    { geo: [ 15, 58 ], averagePrice: 1642700 },
    { geo: [ 15, 59 ], averagePrice: 1889056 },
    { geo: [ 15, 60 ], averagePrice: 967585 },
    { geo: [ 15, 61 ], averagePrice: 1085785 },
    { geo: [ 15, 62 ], averagePrice: 651000 },
    { geo: [ 15, 63 ], averagePrice: 1922271 },
    { geo: [ 15, 64 ], averagePrice: 1405833 },
    { geo: [ 15, 65 ], averagePrice: 548636 },
    { geo: [ 15, 66 ], averagePrice: 1475714 },
    { geo: [ 16, 56 ], averagePrice: 1615418 },
    { geo: [ 16, 57 ], averagePrice: 1172460 },
    { geo: [ 16, 58 ], averagePrice: 2461008 },
    { geo: [ 16, 59 ], averagePrice: 1740960 },
    { geo: [ 16, 60 ], averagePrice: 1228444 },
    { geo: [ 16, 61 ], averagePrice: 1391594 },
    { geo: [ 16, 62 ], averagePrice: 956561 },
    { geo: [ 16, 63 ], averagePrice: 573600 },
    { geo: [ 16, 64 ], averagePrice: 1512222 },
    { geo: [ 16, 65 ], averagePrice: 820000 },
    { geo: [ 16, 66 ], averagePrice: 775000 },
    { geo: [ 17, 56 ], averagePrice: 2445000 },
    { geo: [ 17, 57 ], averagePrice: 1216948 },
    { geo: [ 17, 58 ], averagePrice: 2461824 },
    { geo: [ 17, 59 ], averagePrice: 2168428 },
    { geo: [ 17, 60 ], averagePrice: 2267629 },
    { geo: [ 17, 61 ], averagePrice: 1424839 },
    { geo: [ 17, 62 ], averagePrice: 1629251 },
    { geo: [ 17, 63 ], averagePrice: 1291406 },
    { geo: [ 17, 64 ], averagePrice: 806071 },
    { geo: [ 17, 65 ], averagePrice: 948929 },
    { geo: [ 17, 66 ], averagePrice: 1525000 },
    { geo: [ 18, 57 ], averagePrice: 1398970 },
    { geo: [ 18, 58 ], averagePrice: 2553281 },
    { geo: [ 18, 59 ], averagePrice: 4545045 },
    { geo: [ 18, 60 ], averagePrice: 3042127 },
    { geo: [ 18, 61 ], averagePrice: 950833 },
    { geo: [ 18, 62 ], averagePrice: 857890 },
    { geo: [ 18, 63 ], averagePrice: 881435 },
    { geo: [ 18, 64 ], averagePrice: 633333 },
    { geo: [ 18, 65 ], averagePrice: 986250 },
    { geo: [ 18, 66 ], averagePrice: 785000 },
    { geo: [ 18, 67 ], averagePrice: 1495000 },
    { geo: [ 18, 68 ], averagePrice: 1995000 },
    { geo: [ 19, 57 ], averagePrice: 1013972 },
    { geo: [ 19, 58 ], averagePrice: 2044000 },
    { geo: [ 19, 59 ], averagePrice: 5420674 },
    { geo: [ 19, 60 ], averagePrice: 2278483 },
    { geo: [ 19, 63 ], averagePrice: 1178082 },
    { geo: [ 19, 64 ], averagePrice: 1372941 },
    { geo: [ 19, 65 ], averagePrice: 760267 },
    { geo: [ 19, 66 ], averagePrice: 608750 },
    { geo: [ 19, 67 ], averagePrice: 422500 },
    { geo: [ 20, 63 ], averagePrice: 296000 },
    { geo: [ 20, 64 ], averagePrice: 2124081 },
    { geo: [ 20, 65 ], averagePrice: 1045714 },
    { geo: [ 20, 66 ], averagePrice: 881100 },
    { geo: [ 20, 67 ], averagePrice: 208000 },
    { geo: [ 20, 68 ], averagePrice: 959750 },
    { geo: [ 21, 64 ], averagePrice: 783056 },
    { geo: [ 21, 65 ], averagePrice: 1263473 },
    { geo: [ 21, 66 ], averagePrice: 522391 },
    { geo: [ 21, 67 ], averagePrice: 1584045 },
    { geo: [ 21, 68 ], averagePrice: 525000 },
    { geo: [ 22, 65 ], averagePrice: 1156250 },
    { geo: [ 22, 66 ], averagePrice: 1977467 },
    { geo: [ 22, 67 ], averagePrice: 622500 },
    { geo: [ 22, 68 ], averagePrice: 460000 },
    { geo: [ 23, 66 ], averagePrice: 496844 },
    { geo: [ 23, 67 ], averagePrice: 463333 },
    { geo: [ 23, 68 ], averagePrice: 395000 },
    { geo: [ 24, 66 ], averagePrice: 694511 },
    { geo: [ 24, 67 ], averagePrice: 558333 },
  ]
};