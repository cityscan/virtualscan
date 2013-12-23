var map;
function init() {
    // defaulting to NY
    map = new L.map('map', {
        center: [40.7385, -73.8854],
        zoom: 15
    })
    L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.ggh7cflj/{z}/{x}/{y}.png', {
            attribution: 'Mapbox <a href="http://mapbox.com/about/maps" target="_blank">Terms & Feedback</a>'
            }).addTo(map);
    var layerUrl = 'http://cityscan.cartodb.com/api/v2/viz/5bf5c460-69a4-11e3-8a42-35e8427dfec0/viz.json';

    // with noun project icons
    //var layerUrl = 'http://cityscan.cartodb.com/api/v2/viz/fcc9d7a8-60fa-11e3-87c0-fb98c60814b9/viz.json';
    /*
    var subLayerOptions = {
        sql: "SELECT * FROM nyc WHERE asviolation = 'No Permit'"
    }
                cartocss: '#nyc{marker-width: 24; marker-opacity: 0.9; marker-allow-overlap: true; marker-placement: point; marker-type: ellipse; marker-line-width: 2; marker-line-color: #FFF; marker-line-opacity: 1;} {#nyc[type="Billboard"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/billboard_red.png);} {#nyc[type="Fence"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/fence_red.png);} {#nyc[type="Awning"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/signpost_red.png);} {#nyc[type="Scaffolding"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/construction_red.png);}'
    */

    var sublayers = [];

    cartodb.createLayer(map, layerUrl)
        .addTo(map)
        .on('done', function(layer) {
            var subLayerOptions = {
                sql: "SELECT * FROM nyc;"
                //cartocss: '#nyc{marker-width: 24;  marker-allow-overlap: true; marker-placement: point; } {#nyc[type="Billboard"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/billboard.png);} {#nyc[type="Fence"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/fence.png);} {#nyc[type="Awning"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/signpost.png);} {#nyc[type="Scaffolding"] { marker-file: url(https://s3.amazonaws.com/cityscan-nyc-demo/construction.png);}'
                //cartocss: "#nyc { marker-fill: #d6301d; marker-width: 16; marker-opacity: 0.9; marker-allow-overlap: true; marker-placement: point; marker-type: ellipse; marker-line-width: 2; marker-line-color: #fff; marker-line-opacity: 1;}"
            
            }

            var sublayer = layer.getSubLayer(0);

            sublayer.set(subLayerOptions);

            sublayers.push(sublayer);
        }).on('error', function() {
            // log the error
        });
    var LayerActions = {
        all: function() {
            sublayers[0].setSQL("SELECT * FROM nyc").setCartoCSS("#nyc {marker-fill: blue;}");
            return true;
        },
        nopermit: function() {
            sublayers[0].setSQL("SELECT * FROM nyc WHERE asviolation = 'No Permit'")
                .setCartoCSS("#nyc {marker-fill: red;}");
            return true;
        },
        expiredpermit: function() {
            sublayers[0].setSQL("SELECT * FROM nyc WHERE asviolation = 'Expired Permit'").
                setCartoCSS("#nyc {marker-fill: yellow;}");
            return true;
        }
    }
    $('.button').click(function() {
        $('.button').removeClass('selected');
        $(this).addClass('selected');
        LayerActions[$(this).attr('id')]();
    });
}

