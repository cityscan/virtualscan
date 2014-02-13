$('document').ready( function() {

        // initialize status to "All"
        // set up event handler to watch for clicking buttons
        // if asset class is clicked, toggle it on and capture type
        // if permit status is clicked, toggle it on and capture type
        // if asset is toggled off, set asset_class to all but leave permit_status on; create SQL query
        // if permit status is toggled off, set permit_status to all but leave asset_class on; create SQL query
        //
        // create object of column names to query class, i.e. {'asviolation': 'permit'}
        // var title2column = {
        // 'permit': 'asviolation',
        // 'asset': 'type'
        // };
        //
        // $options[0].attributes['class'].value === "query asset" or "query permit"
        // if asset: sql = "SELECT * FROM nyc WHERE type = '" + title + "'";
        // if permit: sql = "SELECT * FROM nyc WHERE asviolation = '" + permit + "'";
        // if both: sql = "SELECT * FROM nyc WHERE type = '" + title + "' AND asviolation = '" + permit + "'";
        // if both, then toggle off one...      

function createSelector(layer) {
          var sql = new cartodb.SQL({ user: 'cityscan' });
          
          var $options = $('.query');
          $options.click(function(e) {
            // get the asset type
            // TODO: split this off as a function and return its value (asset_class) in this case
            // and pass it to another function that checks if anything else is toggled
            // before constructing SQL query
            var $a = $(e.target);
            var title = $a.attr('title');
            var queryType = $a.attr('class');
            
            //deselect all and select the clicked one
            $options.removeClass('selected');
            $a.addClass('selected');
            

            var query = "SELECT * FROM exelon";
            
            // create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM exelon WHERE asset_type = '" + title + "'";
              }
              console.log(query);
              layer.setSQL(query);
            });
          }

    //Initialize Map
    var road = L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.h833jk6p/{z}/{x}/{y}.png');
    var sat = L.tileLayer('http://a.tiles.mapbox.com/v3/osaez.gkblk7bk/{z}/{x}/{y}.png'); 
    var map = L.map('map', {
       center: new L.latLng(41.919108, -88.754425),
       zoom: 9,
      });
 
    var baseMaps = {
      'Satellite': sat,
      'Road': road
       };

    L.control.layers(baseMaps).setPosition('topleft').addTo(map);

    cartodb.createLayer(map, {
      user_name: 'cityscan',
      type: 'cartodb',
      sublayers: [  
        {
          sql: "SELECT * FROM exelon",
          cartocss: "#exelon[asset_type=\"Electricity/Utility Poles\"]{marker-fill: #F11810;}[asset_type=\"Manholes and Vaults\"]{marker-fill: #B2DF8A;}[asset_type=\"Streetlights\"]{marker-fill: #33A02C;}[asset_type=\"Wire Sag\"]{marker-fill: #FB9A99;}[asset_type=\"Pole Devices\"]{marker-fill: #3B007F;}",
          interactivity: "altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type"
        }]
        }).addTo(map)
            .done(function(layer) {
                LAY = layer;
                layer.setZIndex(99);
                
                //Needed to get cursor to turn to pointer when hovering over clickable map objects
                cartodb.vis.Vis.addCursorInteraction(map, layer);

                var subLayer = layer.getSubLayer(0);
                SUB = subLayer;
              createSelector(subLayer);

              // TODO: add hover tooltips for fields in infowindow sidebar
              subLayer.on('featureClick', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type FROM exelon WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].imageurl + '" height="250" width="300"></a>');
                      $.each(data.rows[0], function(key, val) {
                      $('#sidebar').append('<p>' + key + ': ' + val + '</p>');
                      });
                    });
                  // latlng parameter is where the mouse was clicked, not where the marker is
              });
              subLayer.setInteraction(true);
              subLayer.infowindow.set('template', $('#infowindow_template').html());
             })
              .error(function(err) {
                console.log(err);
               });

              map.addLayer(road, {insertAtTheBottom:true});
              map.addLayer(sat, {insertAtTheBottom:true});

    //Geocoder Parameters
    function getURLParameter(name) {
      return decodeURI(
      (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, ])[1]);
      };

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.Google()
    }).addTo(map);

  //Download KML format           
  $('#downkml').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    //Enconded SQL string for data download
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20latitude%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20latitude%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20latitude%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20latitude%20DESC%20LIMIT%202000&format=csv";
        $(this).attr("href", new_sql);
      });

  });