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
            
    //Deselect all and select the clicked one
    $options.removeClass('selected');
    $a.addClass('selected');        

    var query = "SELECT * FROM wp_import";
            
// create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM wp_import WHERE type = '" + title + "'";
              }
            else if (title != 'All' && queryType == 'query permit') {
               switch (title) {
                    case "num_other_within_500ft":
                        query = "SELECT * FROM wp_import WHERE " + title + " > 0";
                        break;
                    case "within_300ft_res":
                        query = "SELECT * FROM wp_import WHERE " + title;
                        break;
                    case "face_rule":
                        query = "SELECT * FROM wp_import WHERE " + title;
                        break;
               }
                        
            }
              console.log(query);
              layer.setSQL(query);
    });
    }

    //Initialize Map
    var road = L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.hmglb6fc/{z}/{x}/{y}.png');
    var sat = L.tileLayer('http://a.tiles.mapbox.com/v3/osaez.gkblk7bk/{z}/{x}/{y}.png');   
    var map = L.map('map', {       
       center: new L.latLng(39.965139, -75.181934),
       zoom: 12,
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
          sql: "SELECT * FROM wp_import",
          cartocss: "#wp_import [type=\"Bulletin\"]{marker-fill: #F11810;}[type=\"Digital\"] {marker-fill: #3B007F;}[type=\"Walls/Spectacular\"]{marker-fill: #B2DF8A;}[type=\"null\"]{marker-fill: #33A02C;}[type=\"Junior Poster\"]{marker-fill: #FB9A99;}",
          interactivity: "id,title,route_id,lat,lon,altimeter,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl,cartodb_id"
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
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-philly-billboards/-J4oXMv4H3H-7Hg7NYzXTF.jpg" target="_blank"><img src="https://s3.amazonaws.com/cityscan-philly-billboards/-J4oXMv4H3H-7Hg7NYzXTF.jpg" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Title:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Operator:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Mount Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (in):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Height (in):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Face Count:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Display Permit:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Hansen License No.:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Status:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'No. within 500ft:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Within 300ft:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Face Rule:&nbsp;&nbsp;' +'</strong></p>');
             
              // TODO: add hover tooltips for fields in infowindow sidebar
              subLayer.on('featureClick', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,title,route_id,lat,lon,altimeter,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl,imageurl_lowres FROM wp_import WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].imageurl_lowres + '" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Title:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].title  +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Operator:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].operator +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].address +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Mount Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].mount_type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (in):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].width +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Height (in):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Face Count:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].face_count +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Display Permit:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].display_permit +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Hansen License No.:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].hansen_license_num +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Status:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].license_status +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].license_expiration_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'No. within 500ft:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].num_other_within_500ft +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Within 300ft:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].within_300ft_res +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Face Rule:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].face_rule +'</p>');
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
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20wp_import%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20wp_import%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20wp_import%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20wp_import%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
        $(this).attr("href", new_sql);
      });

  });
$("#sidebar_toggle").click(function(){
  $("#sidebar").toggle("slide");
  $("#sidebar_imgbox").toggle("slide");
});

