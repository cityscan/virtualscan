$('document').ready( function() {
    //hide zoning label once document loads
    $("#legendZoningLabel").hide();
    $('input:checkbox').attr( 'checked', true );

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

    var query = "SELECT * FROM exelon";
            
// create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM exelon WHERE type = '" + title + "'";
              }
            else if (title != 'All' && queryType == 'query permit') {
               switch (title) {
                    case "asset_type":
                        query = "SELECT * FROM exelon WHERE " + title + " > 0";
                        break;
                    case "within_300ft_res":
                        query = "SELECT * FROM exelon WHERE " + title;
                        break;
                    case "face_rule":
                        query = "SELECT * FROM exelon WHERE " + title;
                        break;
               }
             }
            else if (title != 'All' && queryType == 'query record') {
               switch (title) {
                    case "lidar":
                        query = "SELECT * FROM exelon WHERE source ='" + title + "'";
                        break;
                    case "city_records":
                        query = "SELECT * FROM exelon WHERE source ='" + title + "'";
                        break;
                    case "market_records":
                        query = "SELECT * FROM exelon WHERE source ='" + title + "'";
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
    map = L.map('map', {
       center: new L.latLng(42.02481360781777, -88.981018066406250),
       zoom: 9,
       minZoom: 9,
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
          sql: "SELECT * FROM exelon",
          cartocss: "#exelon[asset_type=\"Electricity/Utility Poles\"]{marker-fill: #F79D00;}[asset_type=\"Manholes and Vaults\"]{marker-fill: #4B25EE;}[asset_type=\"Streetlights\"]{marker-fill: #16D7CB;}[asset_type=\"Wire Sag\"]{marker-fill: #88F71A;}[asset_type=\"Pole Devices\"]{marker-fill: #D7162D;}",
          interactivity: "altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type,cartodb_id"
        }]
        }).addTo(map)

            .done(function(layer) {
                LAY = layer;
                layer.setZIndex(99);

                //Needed to get cursor to turn to pointer when hovering over clickable map objects
                cartodb.vis.Vis.addCursorInteraction(map, layer);

                var subLayer = layer.getSubLayer(0);
                var infoSubLayer = layer.getSubLayer(0);

              //Control (aka legend of filter) Animation
              $("#control").toggle(function(){
                $("#control").animate({"bottom":"208px"}, "slow");
                $("#controlBig").animate({"bottom":"0px"}, "slow");
                layer.getSubLayer(0).setSQL("SELECT * FROM exelon WHERE altitude>1000");
                $("#legendAssetLabel").hide();
                $("#legendZoningLabel").hide();
                $("#legendSourceLabel").hide();
                $("#violationOR").show();
                $("#violationAnd").hide();
                $("#legendOperatorLabel").hide();

              },function(){
                $("#control").animate({"bottom":"0px"}, "slow");
                $("#controlBig").animate({"bottom":"-210px"}, "slow");
              });

              //Change Colors Based on Asset Type
             $('#legendAsset').click(function () {
                //layer.getSubLayer(0).setSQL('SELECT * FROM exelon');
                //layer.getSubLayer(0).setCartoCSS('#exelon [type=\"Bulletin\"]{marker-fill: #F79D00;}[type=\"Digital\"] {marker-fill: #D7162D;}[type=\"Walls/Spectacular\"]{marker-fill: #88F71A;}[type=\"null\"]{marker-fill: #474747;}[type=\"Junior Poster\"]{marker-fill: #4B25EE;}');
                $("#legendAssetLabel").show();
                $("#legendZoningLabel").show();
                $("#violationOR").hide();
                $("#legendOperatorLabel").hide();
              });
              //Change Colors Based on Zoning/Violation
             $('#legendZoning').click(function () {
                //layer.getSubLayer(0).setSQL('SELECT * FROM exelon WHERE num_violations=0');
                //layer.getSubLayer(0).setCartoCSS('#exelon [num_violations>0]{marker-fill: #D7162D;}[num_violations=0]{marker-fill: #F79D00;}');
                console.log("legend zoning working");
                $("#legendAssetLabel").hide();
                $("#legendZoningLabel").show();
                $("#legendSourceLabel").hide();
                $("#violationOR").show();
                $("#legendOperatorLabel").hide();
              });
                 //Include Toggling for AND/OR option for Zoning/Violation
                $('#violationAndButton').click(function () {
                    $("#violationAnd").show();
                    $("#violationOR").hide();
                  });

                $('#violoationOrButton').click(function () {
                    $("#violationAnd").hide();
                    $("#violationOR").show();
                  });
              //Change Colors Based on Source
            $('#legendSource').click(function () {
                //layer.getSubLayer(0).setSQL('SELECT * FROM exelon');
                //layer.getSubLayer(0).setCartoCSS('#exelon [hansen_license_num="None"]{marker-fill: #D7162D;}[hansen_license_num!="None"]{marker-fill: #16D7CB;}');
                $("#legendAssetLabel").hide();
                $("#legendZoningLabel").hide();
                $("#legendSourceLabel").show();
                $("#violationOR").hide();
                $("#legendOperatorLabel").hide();
              });
              //Change Colors Based on Operator
            $('#legendOperator').click(function () {
                //layer.getSubLayer(0).setSQL('SELECT * FROM exelon');
                //layer.getSubLayer(0).setCartoCSS('#exelon [operator_self_reported=true]{marker-fill: #16D7CB;}[operator_self_reported=false]{marker-fill: #D7162D;}');
                $("#legendAssetLabel").hide();
                $("#legendZoningLabel").hide();
                $("#legendSourceLabel").hide();
                $("#violationOR").hide();
                $("#legendOperatorLabel").show();
              });

              //Prepare filter for AND Option for Zoning/Violation
                function updateMapByClient(){
                    var Poles = $('#electricityUtilityPoles')[0].checked;console.log("Poles: "+Poles);
                    var PoleDevices = $('#poleDevices')[0].checked;console.log("PoleDevices: "+PoleDevices);
                    var Streetlights = $('#streetlights')[0].checked;console.log("Streetlights: "+Streetlights);
                    var ManholesVaults = $('#manholesVaults')[0].checked;console.log("ManholesVaults: "+ManholesVaults);
                    var WireSag = $('#wireSag')[0].checked;console.log("WireSag: "+WireSag);

                    asset_types = {};
                    asset_types['Electricity/Utility Poles'] = Poles;
                    asset_types['Pole Devices'] = PoleDevices;
                    asset_types['Streetlights'] = Streetlights;
                    asset_types['Manholes and Vaults'] = ManholesVaults;
                    asset_types['Wire Sag'] = WireSag;
                    console.log(asset_types);
                    instring = ''
                    for (var key in asset_types) {
                        if (asset_types[key]) {
                                instring += "'" + key + "', "
                            } 
                    }
                    // get rid of last trailing comma
                    instring = instring.slice(0, -2); 
                    console.log(instring);
                    if (instring) {
                        sql = "SELECT * FROM exelon WHERE asset_type in(" + instring + ")";
                    } else {
                        sql = "SELECT * FROM exelon WHERE altitude>1000"
                    }
                    console.log(sql)
                    return sql;    

                };

                $('#electricityUtilityPoles').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#poleDevices').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#manholesVaults').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#streetlights').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#wireSag').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });



              //Prepare DEFAULT content for Sidebar on Document Load   
              //createSelector(subLayer);
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Irving_Park_Road_1_Bart_1_38.jpg" target="_blank"><img src="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Irving_Park_Road_1_Bart_1_38.jpg" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Collected Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Material:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Frame:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Streetlights (m):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Altitude (m):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Encroaching Vegetation:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Number of Devices:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Pole ID:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Pole Tilt:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Comments:&nbsp;&nbsp;' +'</strong></p>');


              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,imageurl_lowres,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type FROM exelon WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              //Prepare DYNAMIC content for Sidebar on Document Load   
                      $('#sidebar').html('');
                      if (data.rows[0].frame == '201') {
                          $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Wrigley_Field_1_Bart_175.jpg" target="_blank"><img src="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Wrigley_Field_1_Bart_175.jpg" height="250" width="300" id="image_sidepanel"></a>');
                      } else {

                      $('#sidebar').append('<a href="' + data.rows[0].image + '" target="_blank"><img src="' + data.rows[0].imageurl_lowres + '" height="250" width="300" id="image_sidepanel"></a>');
                      }
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].asset_type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Collected Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].collected_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Material:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Frame:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].frame +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Streetlights (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Altitude (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].altitude +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Encroaching Vegetation:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].encroaching_vegetation  +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Number of Devices:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].number_of_devices +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Pole ID:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].pole_id  +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Pole Tilt:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].pole_tilt +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial;line-height:200%"><strong>' + 'Comments:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].rater_comments  +'</p>');
                      
                //Assign global variables for the Report
                      window.image= data.rows[0].image;
                      window.types= data.rows[0].asset_type;
                      window.dateCollected= data.rows[0].collected_date;
                      window.material= data.rows[0].type;
                      window.materialFrame= data.rows[0].frame;
                      window.heights= data.rows[0].height;
                      window.altitude= data.rows[0].altitude;
                      window.encroachingVegetation= data.rows[0].encroaching_vegetation;
                      window.numberDevices= data.rows[0].number_of_devices
                      window.poleId= data.rows[0].pole_id;
                      window.poleTilt= data.rows[0].pole_tilt;
                      window.raterComments= data.rows[0].rater_comments;
                  });
              });

           //Prepare content for hover window
           subLayer.on('featureOver', function(e, latlng, pos, data) {
                var content = $('#box');
              content.show();
              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,imageurl_lowres,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type FROM exelon WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              
              $('#box').html('');

              if (data.rows[0].frame == '201') {
                  $('#box').append('<p align="center"><img height="150" width="200" src="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Wrigley_Field_1_Bart_175.jpg"></p>');
              } else {
                  $('#box').append('<br/><p align="center"><img height="150" width="200" src='+ data.rows[0].imageurl_lowres +'><p/>');
              }
                      $('#box').append('<span id="boxTitle">' + 'Asset Type:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].asset_type +'</span><br/>');
         
                      $('#box').append('<span id="boxTitle">' + 'Date Collected:&nbsp;</span><span id="boxContent">' +'</strong>'+ data.rows[0].collected_date +'</span>');     
                  });
                  window.xcoord = pos.x;
                  window.ycoord = pos.y;
                    var containerObj =  content.position();
                    $('#box').offset({ left: xcoord + 10 , top: ycoord + 70 })
           });
           subLayer.on('featureOut', function(e, latlng, pos, data) {
              $('#box').hide()
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
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20exelon%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
        $(this).attr("href", new_sql);
      });

  });
  
  //Enable sidebar animation   
  $("#sidebar_toggle").click(function(){
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
    $("#sidebar_toggle2").show();
    $('.leaflet-left .leaflet-control').animate({"margin-left":"-290px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"-300px"}, "slow");
  });
  $("#sidebar_toggle2").click(function(){
    $("#sidebar").animate({"left":"0px"}, "slow");
    $("#assetLabel").animate({"left":"308px"}, "slow");
    $("#violationStatusLabel").animate({"left":"308px"}, "slow");
    $("#asset_status").animate({"left":"360px"}, "slow");
    $("#violation_status").animate({"left":"434px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"0px"}, "slow");
    $("#sourceLabel").animate({"left":"740px"}, "slow");
    $("#source_status").animate({"left":"800px"}, "slow");
    $("#sidebar_toggle2").hide();
    $("#sidebar_toggle2").animate({"left":"0px"}, "slow");
    $("#sidebar_toggle").animate({"left":"300px"}, "slow");
    $("#sidebar_toggle").show();
    $("#sidebarProfile").animate({"left":"230px"}, "slow");
    $('.leaflet-left .leaflet-control').animate({"margin-left":"10px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"0px"}, "slow");
  });

  //Button toggle for legend and other radio buttons
  $('.btn-group').button();

  //Toggling classes for UI ButtonS (if relevant)
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
