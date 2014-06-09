$('document').ready( function() {
    $("#control_PermitLabel").hide();
    $("#control_LicenseLabel").hide();
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

    var query = "SELECT * FROM onpremise";
            
    //Create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM onpremise WHERE type = '" + title + "'";
              }
              console.log(query);
              layer.setSQL(query);
    });
    };

    //Initialize Map
    var road = L.tileLayer('https://a.tiles.mapbox.com/v3/osaez.i1op8pcc/{z}/{x}/{y}.png');
    var sat = L.tileLayer('http://a.tiles.mapbox.com/v3/osaez.gkblk7bk/{z}/{x}/{y}.png');   
     map = L.map('map', {       
       center: new L.latLng(41.8512611195705, -87.6319756083832),
       zoom: 17,
       minZoom: 12
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
          sql: "SELECT * FROM onpremise",
          cartocss: "#onpremise[biz_type=\"Food Stores\"]{marker-fill: #F79D00;}[biz_type=\"Pharmacy\"]{marker-fill: #D7162D;}[biz_type=\"Religious\"]{marker-fill: #4B25EE;}[biz_type=\"Restaurants\"]{marker-fill: #16D7CB;}[biz_type=\"Retail\"]{marker-fill: #88F71A;}[biz_type=\"Vacant Storefront\"]{marker-fill: #FF7316;}",
          interactivity: "id,filename,lat,lon,the_geom,bp_id,imageurl,thumbnail,sign_type,biz_id,biz_viol,biz_type,address,sign_viol,cartodb_id,created_at,updated_at,timestamp,license_expiration_date,viol,biz_viol_bool,sign_viol_bool"
        }]
        }).addTo(map)

            .done(function(layer) {
              LAY = layer;
              layer.setZIndex(99);

              //To get cursor to turn to pointer when hovering over clickable map objects
              cartodb.vis.Vis.addCursorInteraction(map, layer);

              var subLayer = layer.getSubLayer(0);
              var infoSubLayer = layer.getSubLayer(0);

              //Control Panel Animation
              $("#control").toggle(function(){
                $("#control").animate({"bottom":"240px"}, "slow");
                $("#controlExtend").animate({"bottom":"0px"}, "slow");
              },function(){
                $("#control").animate({"bottom":"0px"}, "slow");
                $("#controlExtend").animate({"bottom":"-248px"}, "slow");
              });

              //Change Colors Based on Asset Type
             $('#control_Asset').click(function () {
                layer.getSubLayer(0).setCartoCSS('#onpremise[biz_type=\"Food Stores\"]{marker-fill: #F79D00;}[biz_type=\"Pharmacy\"]{marker-fill: #D7162D;}[biz_type=\"Religious\"]{marker-fill: #4B25EE;}[biz_type=\"Restaurants\"]{marker-fill: #16D7CB;}[biz_type=\"Retail\"]{marker-fill: #88F71A;}[biz_type=\"Vacant Storefront\"]{marker-fill: #FF7316;}');
                console.log("legend asset working");
                $('input:checkbox').removeAttr('checked');
                layer.getSubLayer(0).setSQL('SELECT * FROM onpremise WHERE cartodb_id>10000');
                $("#control_PermitLabel").hide();
                $("#control_LicenseLabel").hide();
                $("#control_AssetLegend").show();
                $("#control_AssetLabel").show();
                $("#control_AssetCheckbox").show();
                $("#legendOperatorLabel").hide();
              });

              //Change Colors Based on Permit
             $('#control_Permit').click(function () {
                layer.getSubLayer(0).setCartoCSS('#onpremise [sign_viol_bool=true]{marker-fill: #D7162D;}[sign_viol_bool=false]{marker-fill: #16D7CB;}');
                console.log("legend permit working");
                layer.getSubLayer(0).setSQL('SELECT * FROM onpremise');
                $("#control_AssetLabel").hide();
                $("#control_PermitLabel").show();
                $("#control_LicenseLabel").hide();
                $("#control_AssetLegend").hide();
                $("#control_AssetCheckbox").hide();
                $("#legendOperatorLabel").hide();
              });

              //Change Colors Based on License
             $('#control_License').click(function () {
                layer.getSubLayer(0).setCartoCSS('#onpremise [biz_viol_bool=true]{marker-fill: #D7162D;}[biz_viol_bool=false]{marker-fill: #16D7CB;}');
                console.log("legend permit working");
                layer.getSubLayer(0).setSQL('SELECT * FROM onpremise');
                $("#control_AssetLabel").hide();
                $("#control_PermitLabel").hide();
                $("#control_LicenseLabel").show();
                $("#control_AssetLegend").hide();
                $("#control_AssetCheckbox").hide();
                $("#legendOperatorLabel").hide();
              });

                //Prepare filter
                function updateMapByClientAsset(){
                    var FoodStores2 = $('#control_AssetFoodStores')[0].checked;console.log("Food Stores: "+ FoodStores2);
                    var Pharmacy2 = $('#control_AssetPharmacy')[0].checked;console.log("Pharmacy: "+ Pharmacy2);
                    var Religious2 = $('#control_AssetReligious')[0].checked;console.log("Relgious: "+ Religious2);
                    var Restaurants2 = $('#control_AssetRestaurants')[0].checked;console.log("Restaurant: "+ Restaurants2);
                    var Retail2 = $('#control_AssetRetail')[0].checked;console.log("Retail: "+ Retail2);
                    var VacantStorefront2 = $('#control_AssetVacantStorefront')[0].checked;console.log("Vacant Storefront: "+ VacantStorefront2);

                    asset_types = {};
                    asset_types['Food Stores'] = FoodStores2;
                    asset_types['Pharmacy'] = Pharmacy2;
                    asset_types['Religious'] = Religious2;
                    asset_types['Restaurants'] = Restaurants2;
                    asset_types['Retail'] = Retail2;
                    asset_types['Vacant Storefront'] = VacantStorefront2;
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
                        sql = "SELECT * FROM onpremise WHERE biz_type in(" + instring + ")";
                    } else {
                        sql = "SELECT * FROM onpremise WHERE cartodb_id>1000"
                    }
                    console.log(sql)
                    return sql;    

                };
                $('#control_AssetFoodStores').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetPharmacy').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetReligious').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetRestaurants').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetRetail').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });
                $('#control_AssetVacantStorefront').click(function(){
                   layer.getSubLayer(0).setSQL(updateMapByClientAsset());
                });

                function updateMapByClientPermit(){
                    var Yes = $('#control_PermitYes')[0].checked;console.log("Yes: "+ Yes);
                    var No = $('#control_PermitNo')[0].checked;console.log("No: "+ No);

                    if(Yes==true && No==false){
                          layer.getSubLayer(0).setSQL("SELECT * FROM onpremise WHERE sign_viol_bool IN (true)");
                    }
                    else if(Yes==false && No==true){
                          layer.getSubLayer(0).setSQL("SELECT * FROM onpremise WHERE sign_viol_bool IN (false)");
                    }
                    else if(Yes==true && No==true){
                          layer.getSubLayer(0).setSQL("SELECT * FROM onpremise");
                    }
                    else if(Yes==false && No==false){
                          layer.getSubLayer(0).setSQL('SELECT * FROM onpremise WHERE cartodb_id>10000');
                    }

                };
                $('#control_PermitYes').click(function(){
                   updateMapByClientPermit();
                });
                $('#control_PermitNo').click(function(){
                   updateMapByClientPermit();
                });

                function updateMapByClientLicense(){
                    var None = $('#control_LicenseNone')[0].checked;console.log("Lincense None: "+ None);
                    var Valid = $('#control_LicenseValid')[0].checked;console.log("Lincense Valid: "+ Valid);

                    if(None==true && Valid==false){
                          layer.getSubLayer(0).setSQL("SELECT * FROM onpremise WHERE biz_viol_bool IN (true)");
                    }
                    else if(None==false && Valid==true){
                          layer.getSubLayer(0).setSQL("SELECT * FROM onpremise WHERE biz_viol_bool IN (false)");
                    }
                    else if(None==true && Valid==true){
                          layer.getSubLayer(0).setSQL("SELECT * FROM onpremise");
                    }
                    else if(None==false && Valid==false){
                          layer.getSubLayer(0).setSQL('SELECT * FROM onpremise WHERE cartodb_id>10000');
                    }

                };
                $('#control_LicenseNone').click(function(){
                   updateMapByClientLicense();
                });
                $('#control_LicenseValid').click(function(){
                   updateMapByClientLicense();
                });

              //Prepare DEFAULT content for Sidebar on Document Load   
              createSelector(subLayer);
                      $('#sidebar').html(''); 
                      $('#sidebar').append('<img src="https://s3.amazonaws.com/cityscan-exelon-pilot/lowres_IMAG0908.jpg" height="250" width="300" id="image_sidepanel">');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Collection Date:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Sign Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Business Type:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Lat/Lon:&nbsp;&nbsp;' +'</strong></p>');             
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- CONDITION -</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Building Permit ID:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License ID:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Sign Permit Status:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License Status:&nbsp;&nbsp;' +'</strong></p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong></p>');

              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,filename,lat,lon,the_geom,bp_id,imageurl,thumbnail,sign_type,biz_id,biz_viol,biz_type,address,sign_viol,cartodb_id,created_at,updated_at,timestamp,license_expiration_date,viol,biz_viol_bool,sign_viol_bool FROM onpremise WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                      
              //Prepare DYNAMIC content for Sidebar on Document Load.

                      //Format signViolation correctly.
                      var signViolation = data.rows[0].sign_viol_bool;
                      var signViolationFormat = "NA";
                      if (signViolation){
                        var signViolationFormat = "None";
                        }
                        else{
                        var signViolationFormat = "Valid";
                        }
                      //Format businessViolation correctly.
                      var businessViolation = data.rows[0].biz_viol_bool;
                      var businessViolationFormat = "NA";
                      if (businessViolation){
                        var businessViolationFormat = "None";
                        }
                        else{
                        var businessViolationFormat = "Valid";
                        }
                      //Format DYANMIC content.
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].thumbnail + '" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Collection Date:&nbsp;&nbsp;' +'</strong>' + data.rows[0].timestamp + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Sign Type:&nbsp;&nbsp;' +'</strong>' + data.rows[0].sign_type + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Business Type:&nbsp;&nbsp;' +'</strong>' + data.rows[0].biz_type + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong>' + data.rows[0].address + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Lat/Lon:&nbsp;&nbsp;' +'</strong>' + data.rows[0].lat + ', ' + data.rows[0].lon + '</p>'); 
                      $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- CONDITION -</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Building Permit ID:&nbsp;&nbsp;' +'</strong>' + data.rows[0].bp_id + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License ID:&nbsp;&nbsp;' +'</strong>' + data.rows[0].biz_id + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Sign Permit Status:&nbsp;&nbsp;' +'</strong>' + signViolationFormat + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License Status:&nbsp;&nbsp;' +'</strong>' + businessViolationFormat + '</p>');
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong>' + data.rows[0].license_expiration_date +'</p>');

                //Assign global variables for the Report
                      window.image= data.rows[0].imageurl;
                      window.collectionDate= data.rows[0].timestamp;
                      window.signType= data.rows[0].sign_type;
                      window.businessType= data.rows[0].biz_type;
                      window.address= data.rows[0].address;
                      window.lat= data.rows[0].lat;
                      window.lon= data.rows[0].lon;
                      window.buildingPermitID= data.rows[0].bp_id;
                      window.businessLicenseID= data.rows[0].biz_id;
                      window.signViolation= data.rows[0].sign_viol;
                      window.businessLicenseViolation= data.rows[0].biz_viol;
                      window.licenseExpirationDate= data.rows[0].license_expiration_date;
                  });
              });

           //Prepare content for hover window
           subLayer.on('featureOver', function(e, latlng, pos, data) {
                var content = $('#hoverbox');
              $('#hoverbox').show();
              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,filename,lat,lon,the_geom,bp_id,imageurl,thumbnail,sign_type,biz_id,biz_viol,biz_type,address,sign_viol,cartodb_id,created_at,updated_at,timestamp,license_expiration_date,viol,biz_viol_bool,sign_viol_bool FROM onpremise WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              $('#hoverbox').html('');
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Address:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].address +'</span><br/>');
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Business Type:&nbsp;</span><span id="hoverboxContent">' +'</strong>' + data.rows[0].biz_type +'</span><br/>');    
                      $('#hoverbox').append('<span id="hoverboxTitle">' + 'Sign Type:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].sign_type +'</span>');     
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
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20onpremise%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20onpremise%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20onpremise%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20onpremise%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
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