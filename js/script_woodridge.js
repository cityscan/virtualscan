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

    var query = "SELECT * FROM woodridge";
            
    //Create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM woodridge WHERE type = '" + title + "'";
              }
            else if (title != 'All' && queryType == 'query permit') {
               switch (title) {
                    case "type":
                        query = "SELECT * FROM woodridge WHERE " + title + " > 0";
                        break;
                    case "within_300ft_res":
                        query = "SELECT * FROM woodridge WHERE " + title;
                        break;
                    case "face_rule":
                        query = "SELECT * FROM woodridge WHERE " + title;
                        break;
               }
             }
            else if (title != 'All' && queryType == 'query record') {
               switch (title) {
                    case "lidar":
                        query = "SELECT * FROM woodridge WHERE source ='" + title + "'";
                        break;
                    case "city_records":
                        query = "SELECT * FROM woodridge WHERE source ='" + title + "'";
                        break;
                    case "market_records":
                        query = "SELECT * FROM woodridge WHERE source ='" + title + "'";
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
       center: new L.latLng(41.729064, -88.044501),
       zoom: 12,
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
          sql: "SELECT * FROM woodridge",
          cartocss: "#woodridge[type=\"pole\"]{marker-fill: #F79D00;}[type=\"streetlight\"]{marker-fill: #4B25EE;}",
          interactivity: "id,type,height,lat,lon,imageurl,thumbnail_url,comments,cartodb_id"
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
                  $("#control").animate({"bottom":"158px"}, "slow");
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
                    var Utility = $('#control_Utility')[0].checked;console.log("Utilitys: "+Utility);
                    var Streetlights = $('#control_Streetlights')[0].checked;console.log("Streetlights: "+Streetlights);

                    types = {};
                    types['pole'] = Utility;
                    types['streetlight'] = Streetlights;

                    console.log(types);
                    instring = ''
                    for (var key in types) {
                        if (types[key]) {
                                instring += "'" + key + "', "
                            } 
                    }
                    // get rid of last trailing comma
                    instring = instring.slice(0, -2); 
                    console.log(instring);
                    if (instring) {
                        sql = "SELECT * FROM woodridge WHERE type in(" + instring + ")";
                        console.log(sql)
                        return sql;    
                    } else {
                        
                        return false;
                        //sql = "SELECT * FROM woodridge"
                    }
                };

                $('#control_Utility').click(function(){
                    sql = updateMapByClient();
                    if (sql) {
                        layer.getSubLayer(0).show();
                        layer.getSubLayer(0).setSQL(sql);
                    } else {
                        layer.getSubLayer(0).hide();
                    }
                   //layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#control_Streetlights').click(function(){
                    sql = updateMapByClient()
                    if (sql) {
                        layer.getSubLayer(0).show();
                        layer.getSubLayer(0).setSQL(sql);
                    } else {
                        layer.getSubLayer(0).hide();
                    }
                   //layer.getSubLayer(0).setSQL(updateMapByClient());
                });


              //Prepare DEFAULT content for Sidebar on Document Load   
              createSelector(subLayer);
                      $('#sidebar').html('');
                      
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-demo-img/woodridge_img/cityscan_3024.jpg " target="_blank"><img src="https://s3.amazonaws.com/cityscan-demo-img/woodridge_img/streetlight_1084.jpg" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTES -</p>');

              // human-friendly labels for db fields
              // TODO: figure out WTF pg, par, and inc_stat mean

              subLayer.on('featureClick', function(e, latlng, pos, data, idx) {
                  E = e;
                  console.log(E.currentTarget.style);
                  console.log(data.cartodb_id);
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT * FROM woodridge WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                  //Prepare DYNAMIC content for Sidebar on Document Load   
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].thumbnail_url + '" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTES -</p>');
                      var print_data = {};
                      for (var k in data.rows[0]) {
                          if (data.rows[0][k] !== 'N/A' && k !== 'imageurl' && k !== 'thumbnail_url' && k !== 'id'  && k !== 'cartodb_id' && k !== 'the_geom' && k !== 'the_geom_webmercator' && k !== 'created_at' && k !== 'updated_at') {
                              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + k + ':&nbsp;&nbsp;</strong> ' + data.rows[0][k] + ' </p>');
                            //Assign global variables for the Report
                              print_data[k] = data.rows[0][k];
                              print_data['Image URL'] = data.rows[0].imageurl;
                              window.print_data = print_data;
                          }
                      }
                  });
              });

           //Prepare content for hover window
           subLayer.on('featureOver', function(e, latlng, pos, data) {
                var content = $('#hoverbox');
              content.show();

              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT * FROM woodridge WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              
              $('#hoverbox').html('');

              $('#hoverbox').append('<br/><p align="center"><img height="150" width="200" src='+ data.rows[0].thumbnail_url +'><p/>');
              $('#hoverbox').append('<span id="hoverboxTitle">' + 'Type:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].type +'</span><br/>');
         
              $('#hoverbox').append('<span id="hoverboxTitle">' + 'Height:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].height +'</span><br />');     

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
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20woodridge%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20woodridge%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20woodridge%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20woodridge%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
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
