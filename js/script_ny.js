$('document').ready( function() {
    $("#control_PermitLabel").hide();
    $("#control_PermitCheckbox").hide();
    $('input:checkbox').attr( 'checked', true );

 function createSelector(layer) {
  var sql = new cartodb.SQL({ user: 'cityscan' });
          
  var $options = $('.query');
  $options.click(function(e) {
    // get the asset type
    var $a = $(e.target);
    var title = $a.attr('title');
    var queryType = $a.attr('class');
            
    //Deselect all and select the clicked one
    $options.removeClass('selected');
    $a.addClass('selected');        

    var query = "SELECT * FROM nyc";
            
// create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM nyc WHERE type = '" + title + "'";
              }
            else if (title != 'All' && queryType == 'query permit') {
               switch (title) {
                    case "num_other_within_500ft":
                        query = "SELECT * FROM nyc WHERE " + title + " > 0";
                        break;
                    case "within_300ft_res":
                        query = "SELECT * FROM nyc WHERE " + title;
                        break;
                    case "face_rule":
                        query = "SELECT * FROM nyc WHERE " + title;
                        break;
               }
             }
            else if (title != 'All' && queryType == 'query record') {
               switch (title) {
                    case "lidar":
                        query = "SELECT * FROM nyc WHERE source ='" + title + "'";
                        break;
                    case "city_records":
                        query = "SELECT * FROM nyc WHERE source ='" + title + "'";
                        break;
                    case "market_records":
                        query = "SELECT * FROM nyc WHERE source ='" + title + "'";
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
       center: new L.latLng(40.7397, -73.8896),
       zoom: 14,
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
          sql: "SELECT * FROM nyc",
          cartocss: "#nyc[type=\"Billboard\"]{marker-fill: #D7162D;}[type=\"Fence\"]{marker-fill: #16D7CB;}[type=\"Awning\"]{marker-fill: #F79D00;}[type=\"Scaffolding\"]{marker-fill: #88F71A;}[type=\"Sidewalk Shed\"]{marker-fill: #FF7316;}[type=\"Dumpster\"]{marker-fill: #4B25EE;}",
          interactivity: "bin,lat,lon,address,asviolation,height_meters,imageurl,notes,permit_expiration_date,permit_issuance_date,type,width_meters,cartodb_id"
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
                $("#control").animate({"bottom":"240px"}, "slow");
                $("#controlExtend").animate({"bottom":"0px"}, "slow");
              },function(){
                $("#control").animate({"bottom":"0px"}, "slow");
                $("#controlExtend").animate({"bottom":"-248px"}, "slow");
              });

              //Change Colors Based on Asset Type
             $('#control_Asset').click(function () {
                console.log("legend asset working");
                $('input:checkbox').removeAttr('checked');
                layer.getSubLayer(0).setSQL('SELECT * FROM nyc WHERE asset_id>10000');
                $("#legendZoningLabel").hide();
                $("#legendSourceLabel").hide();
                $("#control_PermitLabel").hide();
                $("#control_AssetLegend").show();
                $("#control_AssetLabel").show();
                $("#control_AssetCheckbox").show();
                $("#violationOR").hide();
                $("#control_PermitCheckbox").hide();
                $("#legendOperatorLabel").hide();
              });
              //Change Colors Based on Zoning/Violation
             $('#control_Permit').click(function () {
                console.log("legend permit working");
                $('input:checkbox').removeAttr('checked');
                layer.getSubLayer(0).setSQL('SELECT * FROM nyc WHERE asset_id>10000');
                $("#control_AssetLabel").hide();
                $("#legendZoningLabel").show();
                $("#legendSourceLabel").hide();
                $("#control_PermitLabel").show();
                $("#control_PermitLabel").show();
                $("#control_AssetLegend").hide();
                $("#control_AssetCheckbox").hide();
                $("#control_PermitCheckbox").show();
                $("#legendOperatorLabel").hide();
              });

                //Prepare filter for expired permits
                function updateMapByClient(){
                    var None = $('#control_PermitNone')[0].checked;console.log("None: "+None);
                    var Expired = $('#control_PermitExpired')[0].checked;console.log("Expired: "+Expired);

                    if(None==true && Expired==false){
                          layer.getSubLayer(0).setSQL("SELECT * FROM nyc WHERE asviolation IN ('None')");
                          console.log("this works");
                    }
                    else if(None==false && Expired==true){
                          layer.getSubLayer(0).setSQL("SELECT * FROM nyc WHERE asviolation IN ('Expired Permit')");
                          console.log("this works2");
                    }
                    else if(None==true && Expired==true){
                          layer.getSubLayer(0).setSQL("SELECT * FROM nyc WHERE asviolation IN ('None') OR asviolation IN ('Expired Permit')");
                          console.log("this works3");
                    }
                    else if(None==false && Expired==false){
                          layer.getSubLayer(0).setSQL('SELECT * FROM nyc WHERE asset_id>10000');
                          console.log("this works4");
                    }

                };
                $('#control_PermitNone').click(function(){
                   updateMapByClient();
                });
                $('#control_PermitExpired').click(function(){
                   updateMapByClient();
                });


                function updateMapByClientAsset(){
                    var Awnings2 = $('#control_AssetAwning')[0].checked;console.log("Awning: "+Awnings2);
                    var Billboards2 = $('#control_AssetBillboard')[0].checked;console.log("Billboard: "+Billboards2);
                    var Dumpsters2 = $('#control_AssetDumpster')[0].checked;console.log("Dumpster: "+Dumpsters2);
                    var Fences2 = $('#control_AssetFence')[0].checked;console.log("Fence: "+Fences2);
                    var Scaffoldings2 = $('#control_AssetScaffold')[0].checked;console.log("Scaffolding: "+Scaffoldings2);
                    var Sidewalks2 = $('#control_AssetSidewalk')[0].checked;console.log("Sidewalk: "+Sidewalks2);

                    asset_types = {};
                    asset_types['Awning'] = Awnings2;
                    asset_types['Billboard'] = Billboards2;
                    asset_types['Dumpster'] = Dumpsters2;
                    asset_types['Fence'] = Fences2;
                    asset_types['Scaffolding'] = Scaffoldings2;
                    asset_types['Sidewalk Shed'] = Sidewalks2;
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
                        sql = "SELECT * FROM nyc WHERE type in(" + instring + ")";
                    } else {
                        sql = "SELECT * FROM nyc WHERE asset_id>1000"
                    }
                    console.log(sql)
                    return sql;    

                };
                $('#control_AssetAwning').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetBillboard').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetDumpster').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetFence').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetScaffold').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetSidewalk').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });

              //Prepare DEFAULT content for Sidebar on Document Load   
              createSelector(subLayer);
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-nyc-demo/11.png" target="_blank"><img src="https://s3.amazonaws.com/cityscan-nyc-demo/11.png" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Bin:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Latitude:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Longitude:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (m):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Height (m):&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Violation:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Permit Expiration Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Permit Issuance Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Notes:&nbsp;&nbsp;' +'</strong></p>');

              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT bin,lat,lon,date,address,asviolation,height_meters,imageurl,notes,permit_expiration_date,permit_issuance_date,type,width_meters FROM nyc WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      
              //Prepare DYNAMIC content for Sidebar on Document Load   
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].imageurl + '" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Bin:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].bin +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Type:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].type +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].address +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Latitude:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].lat +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Longitude:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].lon +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Width (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].width_meters +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Height (m):&nbsp;&nbsp;' +'</strong> '+ data.rows[0].height_meters +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Violation:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].asviolation +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Permit Expiration Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].permit_expiration_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Permit Issuance Date:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].permit_issuance_date +'</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial;line-height:200%"><strong>' + 'Notes:&nbsp;&nbsp;' +'</strong> '+ data.rows[0].notes +'</p>');

                //Assign global variables for the Report
                      window.image= data.rows[0].imageurl;
                      window.bin= data.rows[0].bin;
                      window.types= data.rows[0].type;
                      window.address= data.rows[0].address;
                      window.widthMeters= data.rows[0].width_meters;
                      window.heightMeters= data.rows[0].height_meters;
                      window.asViolation= data.rows[0].asviolation;
                      window.permitExpirationDate= data.rows[0].permit_expiration_date;
                      window.permitIssuanceDate= data.rows[0].permit_issuance_date;
                      window.notes= data.rows[0].notes;
                  });
              });

           //Prepare content for hover window
           subLayer.on('featureOver', function(e, latlng, pos, data) {
                var content = $('#hoverbox');
              $('#hoverbox').show();
              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT bin,lat,lon,address,date,asviolation,height_meters,imageurl,notes,permit_expiration_date,permit_issuance_date,type,width_meters FROM nyc WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              $('#hoverbox').html('');
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Type:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].type +'</span><br/>');   
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Address:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].address +'</span><br/>');
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'BIN:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].bin +'</span><br/>');    
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Date Collected:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].date +'</span>');     
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

  });
  
  //Enable sidebar animation   
  $("#sidebarToggle").click(function(){
    $("#sidebar").animate({"left":"-300px"}, "slow");
    $("#assetLabel").animate({"left":"10px"}, "slow");
    $("#violationStatusLabel").animate({"left":"10px"}, "slow");
    $("#asset_status").animate({"left":"65px"}, "slow");
    $("#violation_status").animate({"left":"145px"}, "slow");
    $("#sourceLabel").animate({"left":"445px"}, "slow");
    $("#source_status").animate({"left":"500px"}, "slow");
    $("#sidebarProfile").animate({"left":"-70px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"-300px"}, "slow");
    $("#sidebarToggle").animate({"left":"0px"}, "slow");
    $("#sidebarToggle2").show();
    $('.leaflet-left .leaflet-control').animate({"margin-left":"-290px"}, "slow");
    $('.leaflet-control-geosearch, .leaflet-control-geosearch ul').animate({"margin-left":"-300px"}, "slow");
  });
  $("#sidebarToggle2").click(function(){
    $("#sidebar").animate({"left":"0px"}, "slow");
    $("#assetLabel").animate({"left":"308px"}, "slow");
    $("#violationStatusLabel").animate({"left":"308px"}, "slow");
    $("#asset_status").animate({"left":"360px"}, "slow");
    $("#violation_status").animate({"left":"434px"}, "slow");
    $("#sidebar_imgbox").animate({"left":"0px"}, "slow");
    $("#sourceLabel").animate({"left":"740px"}, "slow");
    $("#source_status").animate({"left":"800px"}, "slow");
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
