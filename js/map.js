var map;
function init() {
    // defaulting to NY
    map = new L.map('cartodb-map', {
        center: [40.7385, -73.8854],
        zoom: 15
    })
    L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.ggh7cflj/{z}/{x}/{y}.png', {
            attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>'
            }).addTo(map);
    var layerUrl = 'http://cityscan.cartodb.com/api/v2/viz/fcc9d7a8-60fa-11e3-87c0-fb98c60814b9/viz.json';
    /*
    var subLayerOptions = {
        sql: "SELECT * FROM nyc_carto WHERE asviolation = 'No Permit'"
    }
    */

    var sublayers = [];

    cartodb.createLayer(map, layerUrl)
        .addTo(map)
        .on('done', function(layer) {
            layer.getSubLayer(0).set(subLayerOptions);
        }).on('error', function() {
            // log the error
        });
}

