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

    var query = "SELECT * FROM nyc";
            
    //Create query based on data from the layer
    if(title !== 'All' && queryType == 'query asset') {
      query = "SELECT * FROM nyc WHERE type = '" + title + "'";
    }
    else if (title != 'All' && queryType == 'query permit') {
      query = "SELECT * FROM nyc WHERE asviolation = '" + title + "'";
    }
      layer.setSQL(query);
      console.log(query);
    });
    }

    //Initialize Map
    var road = L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.h833jk6p/{z}/{x}/{y}.png');
    var sat = L.tileLayer('http://a.tiles.mapbox.com/v3/osaez.gkblk7bk/{z}/{x}/{y}.png');   
    var map = L.map('map', {
       center: new L.latLng(40.7397, -73.8896),
       zoom: 14,
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
          sql: "SELECT * FROM nyc",
          cartocss: "#nyc[type=\"Billboard\"]{marker-fill: #A6CEE3;}[type=\"Fence\"]{marker-fill: #1F78B4;}[type=\"Awning\"]{marker-fill: #B2DF8A;}[type=\"Scaffolding\"]{marker-fill: #33A02C;}[type=\"Sidewalk Shed\"]{marker-fill: #FB9A99;}[type=\"Dumpster\"]{marker-fill: #E31A1C;}",
          interactivity: "bin,lat,lon,address,asviolation,height_meters,imageurl,notes,permit_expiration_date,permit_issuance_date,type,width_meters,cartodb_id"
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

              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
              var content = $('#box');
              $('#box').show();
              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT bin,lat,lon,address,date,asviolation,height_meters,imageurl,notes,permit_expiration_date,permit_issuance_date,type,width_meters FROM nyc WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              $('#box').html('');
                      $('#box').append('<span id="boxTitle">' + 'Type:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].type +'</span><br/>');   
                      $('#box').append('<span id="boxTitle">' + 'Address:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].address +'</span><br/>');
                      $('#box').append('<span id="boxTitle">' + 'BIN:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].bin +'</span><br/>');    
                      $('#box').append('<span id="boxTitle">' + 'Date Collected:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].date +'</span>');     
                  });
                  window.xcoord = pos.x;
                  window.ycoord = pos.y;
                    var containerObj =  content.position();
                    $('#box').offset({ left: xcoord + 10 , top: ycoord + 70 })
             
           });
           
                  

              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT bin,lat,lon,date,address,asviolation,height_meters,imageurl,notes,permit_expiration_date,permit_issuance_date,type,width_meters FROM nyc WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].imageurl + '" id="image_sidepanel"></a>');
                      //$('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Height(m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].lat +'</p>'); Template
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Bin:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].bin +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].address +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].width_meters +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Height (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height_meters +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Violation:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].asviolation +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Permit Expiration Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].permit_expiration_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Permit Issuance Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].permit_issuance_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Notes:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].notes +'</p>');
                      //$.each(data.rows[0], function(key, val) {
                      //$('#sidebar').append('<p style="color:white; margin-left:7px;font-family:arial"><strong>' + key + ':&nbsp;</strong>' + val + '</p>');
                      //});
                    });
                  // latlng parameter is where the mouse was clicked, not where the marker is
              });
              subLayer.on('featureOut', function(e, latlng, pos, data) {
              $('#box').hide()

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
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20nyc%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20nyc%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20nyc%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20nyc%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
        $(this).attr("href", new_sql);
      });
      
      //Sidebar Animation   
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
	  $('#controlToggle').click(function() {
		  $('.featureMenu').toggle('slow', function() {});
});
  });
