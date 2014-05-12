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

    L.control.layers(baseMaps).setPosition('topright').addTo(map);

    cartodb.createLayer(map, {
      user_name: 'cityscan',
      type: 'cartodb',
      sublayers: [  
        {
          sql: "SELECT * FROM exelon",
          cartocss: "#exelon[asset_type=\"Electricity/Utility Poles\"]{marker-fill: #F11810;}[asset_type=\"Manholes and Vaults\"]{marker-fill: #B2DF8A;}[asset_type=\"Streetlights\"]{marker-fill: #33A02C;}[asset_type=\"Wire Sag\"]{marker-fill: #FB9A99;}[asset_type=\"Pole Devices\"]{marker-fill: #3B007F;}",
          interactivity: "altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type,cartodb_id"
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
              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type FROM exelon WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].image + '" target="_blank"><img src="' + data.rows[0].image + '" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].asset_type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Collected Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].collected_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Material:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Frame:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].frame +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Height (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Altitude (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].altitude +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Encroaching Vegetation:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].encroaching_vegetation  +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Number of Devices:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].number_of_devices +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Pole ID:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].pole_id  +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Pole Tilt:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].pole_tilt +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Comments:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].rater_comments  +'</p>');
                    });
                  // latlng parameter is where the mouse was clicked, not where the marker is
              });
              subLayer.setInteraction(true);
              subLayer.infowindow.set('template', $('#infowindow_template').html());
              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  var content = $('#box');
                  content.show();
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql?q=SELECT asset_type,collected_date FROM exelon WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      content.html('');
                      content.append('<span id="boxTitle">' + 'Type:&nbsp;</span><span id="boxContent">' + '</strong>' + data.rows[0].asset_type + '</span><br />');
                      content.append('<span id="boxTitle">' + 'Collected On:&nbsp;</span><span id="boxContent">' + '</strong>' + data.rows[0].collected_date + '</span><br />');
                      });
                  window.xcoord = pos.x;
                  window.ycoord = pos.y;
                  var containerObj = content.position();
                  $('#box').offset({ left:xcoord + 10, top: ycoord + 70 })
              });
              subLayer.on('featureOut', function(e, latlng, pos, data) {
                  $('#box').hide()
              });

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

              $('#legendAsset').click(function () {
                layer.getSubLayer(0).setCartoCSS('#wp_import [type=\"Bulletin\"]{marker-fill: #F79D00;}[type=\"Digital\"] {marker-fill: #D7162D;}[type=\"Walls/Spectacular\"]{marker-fill: #88F71A;}[type=\"null\"]{marker-fill: #474747;}[type=\"Junior Poster\"]{marker-fill: #4B25EE;}');
                $( "#legendAssetLabel" ).show();
                $( "#legendZoningLabel" ).hide();
                $( "#legendSourceLabel" ).hide();
                $( "#legendPermitLabel" ).hide();
              });
              $('#legendZoning').click(function () {
                layer.getSubLayer(0).setCartoCSS('#wp_import [num_other_within_500ft>1]{marker-fill: #000000;}');
                $( "#legendAssetLabel" ).hide();
                $( "#legendZoningLabel" ).show();
                $( "#legendSourceLabel" ).hide();
                $( "#legendPermitabel" ).hide();
              });
              $('#legendSource').click(function () {
                layer.getSubLayer(0).setCartoCSS('#wp_import [source=\"city_records\"]{marker-fill: #D7162D;}[source=\"lidar\"] {marker-fill: #F79D00;}[source=\"market_records\"]{marker-fill: #4B25EE;}');
                $( "#legendAssetLabel" ).hide();
                $( "#legendZoningLabel" ).hide();
                $( "#legendSourceLabel" ).show();
                $( "#legendPermitLabel" ).hide();
              });
                  $('#spacingViolation').click(function () {
                    layer.getSubLayer(0).setCartoCSS('#wp_import [num_other_within_500ft>1]{marker-fill: #F11810;}[num_other_within_500ft=null]{marker-fill: #006E98;}');
                  });
                  $('#residentialViolation').click(function () {
                    layer.getSubLayer(0).setCartoCSS('#wp_import [within_300ft_res=true]{marker-fill: #F11810;}[within_300ft_res=false]{marker-fill: #006E98;}');
                  });
                  $('#heightViolation').click(function () {
                    layer.getSubLayer(0).setCartoCSS('#wp_import [num_other_within_500ft>1]{marker-fill: #F11810;}[num_other_within_500ft=null]{marker-fill: #006E98;}');
                  });
              $('#legendPermit').click(function () {
                    layer.getSubLayer(0).setCartoCSS('#wp_import [height_rule=true]{marker-fill: #16D7CB;}[height_rule=false]{marker-fill: #D7162D;}');
                $( "#legendAssetLabel" ).hide();
                $( "#legendZoningLabel" ).hide();
                $( "#legendSourceLabel" ).hide();
                $( "#legendPermitLabel" ).show();
              });
    // Sidebar Animation
  $("#sidebar_toggle").toggle(function(){
    $("#sidebar").animate({"left":"-300px"}, "slow");
    $("#assetLabel").animate({"left":"10px"}, "slow");
    $("#violationStatusLabel").animate({"left":"10px"}, "slow");
    $("#asset_status").animate({"left":"65px"}, "slow");
    $("#violation_status").animate({"left":"145px"}, "slow");
    $("#sourceLabel").animate({"left":"445px"}, "slow");
    $("#source_status").animate({"left":"500px"}, "slow");
    $("#sidebarProfile").animate({"left":"-70px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"-300px"}, "slow");
    $("#sidebar_toggle").animate({"left":"0px"}, "slow");
    $('.leaflet-left .leaflet-control').animate({"margin-left":"-290px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"-300px"}, "slow");
  },function(){
    $("#sidebar").animate({"left":"0px"}, "slow");
    $("#assetLabel").animate({"left":"308px"}, "slow");
    $("#violationStatusLabel").animate({"left":"308px"}, "slow");
    $("#asset_status").animate({"left":"360px"}, "slow");
    $("#violation_status").animate({"left":"434px"}, "slow");
    $("#sourceLabel").animate({"left":"740px"}, "slow");
    $("#source_status").animate({"left":"800px"}, "slow");
    $("#sidebar_toggle").animate({"left":"300px"}, "slow");
    $("#sidebarProfile").animate({"left":"230px"}, "slow");
    $('.leaflet-left .leaflet-control').animate({"margin-left":"10px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"0px"}, "slow");
  });

  //Legend Animation
  $("#control").toggle(function(){
    $("#control").animate({"bottom":"160px"}, "slow");
    $("#controlBig").animate({"bottom":"0px"}, "slow");
  },function(){
    $("#control").animate({"bottom":"0px"}, "slow");
    $("#controlBig").animate({"bottom":"-160px"}, "slow");
  });
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
  //Legend Animation
  $("#control").toggle(function(){
    $("#control").animate({"bottom":"160px"}, "slow");
    $("#controlBig").animate({"bottom":"0px"}, "slow");
  },function(){
    $("#control").animate({"bottom":"0px"}, "slow");
    $("#controlBig").animate({"bottom":"-160px"}, "slow");
  });

  //Button toggle for legend and other radio buttons
  $('.btn-group').button();

  //toggling classes for ui buttons 
  $("#showall_status").click(function() {
    var bulletin_button = $("#bulletin_button");
    bulletin_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var digital_button = $("#digital_button");
    digital_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var junior_button = $("#junior_button");
    junior_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var other_button = $("#other_button");
    other_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var walls_button = $("#walls_button");
    walls_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var cityscan_button = $("#cityscan_button");
    cityscan_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var city_button = $("#city_button");
    city_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var market_button = $("#market_button");
    market_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var spacing_button = $("#spacing_button");
    spacing_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var residential_button = $("#residential_button");
    residential_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var height_button = $("#height_button");
    height_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var nopermit_button = $("#nopermit_button");
    nopermit_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    var expired_button = $("#expired_button");
    expired_button.removeClass("btn btn-primary active").addClass("btn btn-primary");
    });

  });
