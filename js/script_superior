$('document').ready( function() {
    $("#control_AssetLabel").hide();
    $('input:checkbox').attr( 'checked', true );

 function createSelector(layer) {
  var sql = new cartodb.SQL({ user: 'cityscan' });
          
  var $options = $('.query');
  $options.click(function(e) {
    var $a = $(e.target);
    var title = $a.attr('title');
    var queryType = $a.attr('class');
            
    //Deselect all and select the clicked one
    $options.removeClass('selected');
    $a.addClass('selected');        

    var query = "SELECT * FROM exelon";
            
    //Create query based on data from the layer
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
       center: new L.latLng(33.2860185, -111.1132315),
       zoom: 14,
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
          cartocss: "#exelon[asset_type=\"Vacant Lots\"]{marker-fill: #F79D00;}[asset_type=\"On-Premise Signage\"]{marker-fill: #4B25EE;}[asset_type=\"Billboards\"]{marker-fill: #16D7CB;}",
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
                  $("#controlExtend").animate({"bottom":"0px"}, "slow");
                  $("#control_AssetLabel").hide();
                  $("#control_AssetCheckbox").show();
                  $("#legendOperatorLabel").hide();
                  $("#control_AssetLegend").animate({"bottom":"28px"}, "slow");

                },function(){
                  $("#control").animate({"bottom":"0px"}, "slow");
                  $("#controlExtend").animate({"bottom":"-210px"}, "slow");
                  $("#control_AssetLegend").animate({"bottom":"25px"}, "slow");
                });

                //Prepare filter for AND Option for Assets
                function updateMapByClient(){
                    var VacantLots = $('#control_VacantLots')[0].checked;console.log("Vacant Lots: "+VacantLots);
                    var Signage = $('#control_On-PremiseSignage')[0].checked;console.log("On-Premise Signage: "+Signage);
                    var Billboards = $('#control_Billboards')[0].checked;console.log("Billboards: "+Billboards);

                    asset_types = {};
                    asset_types['Vacant Lots'] = VacantLots;
                    asset_types['On-Premise Signage'] = Signage;
                    asset_types['Billboards'] = Billboards;

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

                $('#control_VacantLots').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#control_On-PremiseSignage').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#control_Billboards').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClient());
                });


              //Prepare DEFAULT content for Sidebar on Document Load   
              createSelector(subLayer);
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Irving_Park_Road_1_Bart_1_38.jpg" target="_blank"><img src="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Irving_Park_Road_1_Bart_1_38.jpg" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Collected Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Material:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Frame:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Streetlights (m):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Latitude:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Longitude:&nbsp;&nbsp;' +'</strong></p>');
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
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Streetlights:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Latitude:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].latitude +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Longitude:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].longitude +'</p>');
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
                var content = $('#hoverbox');
              content.show();
              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT altitude,asset_type,collected_date,direction,encroaching_vegetation,frame,height,image,imageurl_lowres,latitude,longitude,mile_point,number_of_devices,pole_id,pole_tilt,rater_comments,route_id,type FROM exelon WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              
              $('#hoverbox').html('');

              if (data.rows[0].frame == '201') {
                  $('#hoverbox').append('<p align="center"><img height="150" width="200" src="https://s3.amazonaws.com/cityscan-exelon-pilot/CCS_Wrigley_Field_1_Bart_175.jpg"></p>');
              } else {
                  $('#hoverbox').append('<br/><p align="center"><img height="150" width="200" src='+ data.rows[0].imageurl_lowres +'><p/>');
              }
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Asset Type:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].asset_type +'</span><br/>');
         
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Date Collected:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].collected_date +'</span>');     
                  });
                  window.xcoord = pos.x;
                  window.ycoord = pos.y;
                    var containerObj =  content.position();
                    $('#hoverbox').offset({ left: xcoord + 10 , top: ycoord + 70 })
           });
           subLayer.on('featureOut', function(e, latlng, pos, data) {
              $('#hoverbox').hide()
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
  $("#sidebarToggle").click(function(){
    $("#sidebar").animate({"left":"-300px"}, "slow");
    $("#sidebarProfile").animate({"left":"-70px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"-300px"}, "slow");
    $("#sidebarToggle").animate({"left":"0px"}, "slow");
    $("#sidebarToggle2").show();
    $('.leaflet-left .leaflet-control').animate({"margin-left":"-290px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"-300px"}, "slow");
  });
  $("#sidebarToggle2").click(function(){
    $("#sidebar").animate({"left":"0px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"0px"}, "slow");
    $("#sidebarToggle2").hide();
    $("#sidebarToggle2").animate({"left":"0px"}, "slow");
    $("#sidebarToggle").animate({"left":"300px"}, "slow");
    $("#sidebarToggle").show();
    $("#sidebarProfile").animate({"left":"230px"}, "slow");
    $('.leaflet-left .leaflet-control').animate({"margin-left":"10px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"0px"}, "slow");
  });

  //Button toggle for legend and other radio buttons
  $('.btn-group').button();
