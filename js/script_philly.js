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
            else if (title != 'All' && queryType == 'query record') {
               switch (title) {
                    case "lidar":
                        query = "SELECT * FROM wp_import WHERE source ='" + title + "'";
                        break;
                    case "city_records":
                        query = "SELECT * FROM wp_import WHERE source ='" + title + "'";
                        break;
                    case "market_records":
                        query = "SELECT * FROM wp_import WHERE source ='" + title + "'";
                        break;
               }
                        
            }
              console.log(query);
              layer.setSQL(query);
    });
    }


    //Initialize Map
    var road = L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.i1op8pcc/{z}/{x}/{y}.png');
    var sat = L.tileLayer('http://a.tiles.mapbox.com/v3/osaez.gkblk7bk/{z}/{x}/{y}.png');   
    var map = L.map('map', {       
       center: new L.latLng(39.965139, -75.181934),
       zoom: 12,
       minZoom: 12,
       maxZoom: 17
      });
 
    var baseMaps = {
      'Satellite': sat,
      'Road': road
       };

    L.control.layers(baseMaps).setPosition('topright').addTo(map);
    var myLayer = cartodb.createLayer(map, {
      user_name: 'cityscan',
      type: 'cartodb',
      sublayers: [  
        {
          sql: "SELECT * FROM wp_import",
          cartocss: "#wp_import {marker-fill: #F79D00;}[type=\"Digital\"] {marker-fill: #D7162D;}[type=\"Walls/Spectacular\"]{marker-fill: #88F71A;}[type=\"null\"]{marker-fill: #474747;}[type=\"Junior Poster\"]{marker-fill: #4B25EE;}",
          interactivity: "id,route_id,lat,lon,altimeter,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl,cartodb_id,thumbnail,num_violations"
        }]
        }).addTo(map)

            .done(function(layer) {
                LAY = layer;
                layer.setZIndex(99);

                //Needed to get cursor to turn to pointer when hovering over clickable map objects
                cartodb.vis.Vis.addCursorInteraction(map, layer);

                var subLayer = layer.getSubLayer(0);
                var infoSubLayer = layer.getSubLayer(0);

                
              //Change colors of legend
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

              createSelector(subLayer);
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-philly-billboards/-J4oXMv4H3H-7Hg7NYzXTF.jpg" target="_blank"><img src="https://s3.amazonaws.com/cityscan-philly-billboards/-J4oXMv4H3H-7Hg7NYzXTF.jpg" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Title:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Operator:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Mount Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (in):&nbsp;&nbsp;' +'</strong><span style="color:white;margin-left:37px;font-family:arial"><strong>' + 'Height (in):&nbsp;&nbsp;' +'</strong></span></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Face Count:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Display Permit:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- CONDITION -</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Hansen License No.:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Status:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'No. within 500ft:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Within 300ft:&nbsp;&nbsp;' +'</strong><span style="color:white;margin-left:37px;font-family:arial"><strong>' + 'Face Rule:&nbsp;&nbsp;' +'</strong></span></p>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px;margin-left:7px;font-family:arial;font-weight:bolder"><em>' + 'This information comes from &nbsp;' +'</em></p>');

              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,route_id,lat,lon,altimeter,imageurl_lowres,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl FROM wp_import WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].imageurl_lowres + '" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Title:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].title  +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Operator:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].operator +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].address +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Mount Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].mount_type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (in):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].width +'<span style="color:white;margin-left:37px;font-family:arial"><strong>' + 'Height (in):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height +'</span></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Face Count:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].face_count +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Display Permit:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].display_permit +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px;margin-left:7px;font-family:arial;font-weight:bolder">' + '- CONDITION -</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Hansen License No.:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].hansen_license_num +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Status:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].license_status +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].license_expiration_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'No. within 500ft:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].num_other_within_500ft +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Within 300ft:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].within_300ft_res +'<span style="color:white;margin-left:37px;font-family:arial"><strong>' + 'Face Rule:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].face_rule +'</span></p>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px;margin-left:7px;font-family:arial;font-weight:bolder"><em>' + 'This information comes from &nbsp;' + data.rows[0].source +'.</em></p>');
                      //global variables for report generation
                      window.image= data.rows[0].imageurl;
                      window.types= data.rows[0].type;
                      window.titles= data.rows[0].title;
                      window.operator= data.rows[0].operator;
                      window.address= data.rows[0].address;
                      window.mountType= data.rows[0].mount_type;
                      window.widths= data.rows[0].width;
                      window.heights= data.rows[0].height;
                      window.faceCount= data.rows[0].face_count;
                      window.displayPermit= data.rows[0].display_permit;
                      window.licenseNum= data.rows[0].hansen_license_num;
                      window.licenseStatus= data.rows[0].license_status;
                      window.expirationDate= data.rows[0].license_expiration_date;
                      window.within500ft= data.rows[0].num_other_within_500ft;
                      window.within300ft= data.rows[0].within_300ft_res;
                      window.faceRule= data.rows[0].face_rule;
                      window.sources= data.rows[0].source;
                  });

                  // latlng parameter is where the mouse was clicked, not where the marker is
              });

           subLayer.on('featureOver', function(e, latlng, pos, data) {
                var content = $('#box');
              $('#box').show();
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,title,route_id,lat,lon,source,altimeter,thumbnail,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl,num_violations FROM wp_import WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      $('#box').html('');
                      $('#box').append('<span id="boxTitle">' + 'Type:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].type +'</span><br/>');
                      $('#box').append('<span id="boxTitle">' + 'Title:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].title +'</span><br/>');  
                      $('#box').append('<span id="boxTitle">' + 'Operator:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].operator +'</span>');     
                  });
                  window.xcoord = pos.x;
                  window.ycoord = pos.y;
                    var containerObj =  content.position();
                    $('#box').offset({ left: xcoord + 10 , top: ycoord + 70 })
             console.log("featureOver");
           });
           subLayer.on('featureOut', function(e, latlng, pos, data) {
              $('#box').hide()
             console.log("featureOut");
           });

              subLayer.setInteraction(true);
			       })
              .error(function(err) {
                console.log(err);
               });

              map.addLayer(road, {insertAtTheBottom:true});

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
  
  //Sidebar Animation   
  $("#sidebar_toggle").click(function(){
    $("#sidebar").animate({"left":"-300px"}, "slow");
    $("#assetLabel").animate({"left":"10px"}, "slow");
    $("#violationStatusLabel").animate({"left":"10px"}, "slow");
    $("#asset_status").animate({"left":"65px"}, "slow");
    $("#violation_status").animate({"left":"145px"}, "slow");
    $("#sourceLabel").animate({"left":"445px"}, "slow");
    $("#source_status").animate({"left":"500px"}, "slow");
    $("#showall_status").animate({"left":"700px"}, "slow");
    $("#sidebar_toggle").animate({"left":"-18px"}, "slow");
    $("#sidebarProfile").animate({"left":"-18px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"-300px"}, "slow");
  });

  $("#sidebar_toggle2").click(function(){
    $("#sidebar").animate({"left":"0px"}, "slow");
    $("#assetLabel").animate({"left":"308px"}, "slow");
    $("#violationStatusLabel").animate({"left":"308px"}, "slow");
    $("#asset_status").animate({"left":"360px"}, "slow");
    $("#violation_status").animate({"left":"434px"}, "slow");
    $("#sourceLabel").animate({"left":"740px"}, "slow");
    $("#source_status").animate({"left":"800px"}, "slow");
    $("#showall_status").animate({"left":"1000px"}, "slow");
    $("#sidebar_toggle").animate({"left":"281px"}, "slow");
    $("#sidebarProfile").animate({"left":"281px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"0"}, "slow");
  });

  $("#sidebar_toggle3").click(function(){
    $("#sidebar").animate({"left":"0px"}, "slow");
    $("#assetLabel").animate({"left":"308px"}, "slow");
    $("#violationStatusLabel").animate({"left":"308px"}, "slow");
    $("#asset_status").animate({"left":"360px"}, "slow");
    $("#violation_status").animate({"left":"434px"}, "slow");
    $("#sourceLabel").animate({"left":"740px"}, "slow");
    $("#source_status").animate({"left":"800px"}, "slow");
    $("#showall_status").animate({"left":"1000px"}, "slow");
    $("#sidebar_toggle").animate({"left":"281px"}, "slow");
    $("#sidebarProfile").animate({"left":"281px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"0"}, "slow");
  });

  $(document).ready(function(){
      var hidden = $('.leaflet-left .leaflet-control');
      var hidden2 = $('.leaflet-control-geosearch, .leaflet-control-geosearch ul');
      $('#sidebar_toggle').click(function(){
      if (hidden.hasClass('visible')){
          hidden.animate({"margin-left":"300px"}, "slow").removeClass('visible');
      } else {
          hidden.animate({"margin-left":"-301px"}, "slow").addClass('visible');
      }
      if (hidden2.hasClass('visible')){
          hidden2.animate({"left":"280px"}, "slow").removeClass('visible');
      } else {
          hidden2.animate({"left":"-300px"}, "slow").addClass('visible');
      }    
      });
      $('#sidebar_toggle2').click(function(){
      if (hidden.hasClass('visible')){
          hidden.animate({"margin-left":"0"}, "slow").removeClass('visible');
      } else {
          hidden.animate({"margin-left":"-300px"}, "slow").addClass('visible');
      }
      if (hidden2.hasClass('visible')){
          hidden2.animate({"left":"0"}, "slow").removeClass('visible');
      } else {
          hidden2.animate({"left":"-300px"}, "slow").addClass('visible');
      }    
      });
      $('#sidebar_toggle3').click(function(){
      if (hidden.hasClass('visible')){
          hidden.animate({"margin-left":"0"}, "slow").removeClass('visible');
      } else {
          hidden.animate({"margin-left":"-300px"}, "slow").addClass('visible');
      }
      if (hidden2.hasClass('visible')){
          hidden2.animate({"left":"0"}, "slow").removeClass('visible');
      } else {
          hidden2.animate({"left":"-300px"}, "slow").addClass('visible');
      }    
      });
  });

  //Legend Animation
  $("#legendBigClose").click(function(){
    $("#legendBig").animate({"bottom":"-165px"}, "slow");
    $("#legendBigClose").animate({"bottom":"-36px"}, "slow");
  });

  $("#legend").click(function(){
    $("#legendBig").animate({"bottom":"0px"}, "slow");
    $("#legendBigClose").animate({"bottom":"143px"}, "slow");
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
