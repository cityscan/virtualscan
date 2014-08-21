$('document').ready( function() {
              var display = {
                  'height_above_ground_level_meters': 'Height Above Ground Level (m)',
                  'collected_date': 'Collected Date',
                  'address': 'Address (approx.)',
                  'lat': 'Latitude',
                  'lon': 'Longitude',
                  'notes': 'Notes',
                  'sign_height_meters': 'Sign Height (m)',
                  'sign_width_meters': 'Sign Width (m)',
                  'sign_wording': 'Sign Wording',
                  'apn': 'APN',
                  'owner_name': 'Owner Name',
                  'owner_na_1': 'Owner Name Line 2',
                  'owner_na_2': 'Owner Name Line 3',
                  'address_ma': 'Owner Mailing Address',
                  'city_maili': 'Owner Mailing City',
                  'state_mail': 'Owner Mailing State',
                  'zip_code_m': 'Owner Mailing ZIP Code',
                  'legal_text': 'Legal Text',
                  'bk': 'Block',
                  'section': 'Section',
                  'tax_area_c': 'Tax Area Code',
                  'range': 'Range',
                  'township': 'Township',
                  'date_of_sa': 'Date of Sale',
                  'sale_amoun': 'Sale Amount',
                  'fee_number': 'Fee Number',
                  'pg': 'PG',
                  'par': 'PAR',
                  'inc_stat': 'Inc. Stat',
                  'imageurl': 'Link to Higher-res image',
                  'thumbnail_url': 'Link to image thumbnail',
                  'type': 'Type',
                  'sign_type': 'Sign Type',
                  'care_of': 'Care of',
                  'situs_comb': 'Situs Comb.',
                  'situs_st_n': 'Situs Street Number',
                      'situs_dir': 'Situs Street Direction',
                      'situs_st_1': 'Situs Street Name',
                        'situs_suff': 'Situs Street Suffix',
                          'situs_city': 'Situs City',
                            'situs_stat': 'Situs State',
                              'situs_zip': 'Situs ZIP Code'
                 
                  };
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

    var query = "SELECT * FROM superior";
            
    //Create query based on data from the layer
            if(title !== 'All' && queryType == 'query asset') {
              query = "SELECT * FROM superior WHERE type = '" + title + "'";
              }
            else if (title != 'All' && queryType == 'query permit') {
               switch (title) {
                    case "type":
                        query = "SELECT * FROM superior WHERE " + title + " > 0";
                        break;
                    case "within_300ft_res":
                        query = "SELECT * FROM superior WHERE " + title;
                        break;
                    case "face_rule":
                        query = "SELECT * FROM superior WHERE " + title;
                        break;
               }
             }
            else if (title != 'All' && queryType == 'query record') {
               switch (title) {
                    case "lidar":
                        query = "SELECT * FROM superior WHERE source ='" + title + "'";
                        break;
                    case "city_records":
                        query = "SELECT * FROM superior WHERE source ='" + title + "'";
                        break;
                    case "market_records":
                        query = "SELECT * FROM superior WHERE source ='" + title + "'";
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
    var parcels = cartodb.createLayer(map, {
        user_name: 'cityscan',
        type: 'cartodb',
        sublayers: [
        {
            sql: "SELECT * FROM parcels_clipped",
            cartocss: "#parcels_clipped{polygon-fill:gray; polygon-opacity:0.5; line-color:black;}",
            interactivity: "cartodb_id,apn,owner_name,owner_na_1,owner_na_2,care_of,address_ma,city_maili,state_mail,zip_code_m,legal_text,situs_comb,situs_st_n,situs_dir, situs_st_1,situs_suff,situs_city,situs_stat,situs_zip,bk,pg,par,section,tax_area_c,inc_stat,range,township,date_of_sa,sale_amoun,fee_number"
        }]
    }).addTo(map)
        .done(function(layer) {
            LAY = layer;
            var subLayer = layer.getSubLayer(0);
            layer.setZIndex(50);
            /*
            subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                // SLOW AS BALLS
                // TODO: make not slow as balls
                var hovered = layer.createSubLayer(
                        {
                            sql: "SELECT * FROM parcels_clipped WHERE cartodb_id = " + data.cartodb_id,
                            cartocss: "#parcels_clipped{polygon-fill: gray; polygon-opacity:0.5; line-color:rgb(0,255,255); line-width:1.5;}"
                        });
            });
            subLayer.on('featureOut', function(e, latlng, pos, data, idx) {
                layer.getSubLayer(1).remove();
            });
            */
            subLayer.on('featureClick', function(e, latlng, pos, data, idx) {
              $('#sidebar').html('');
              $('#sidebar').append('<img src="image/photo_unavailable.png" height="250" width="300" id="image_sidepanel"></a>');
              $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTES -</p>');
              var print_data = {};
              for (var k in data) {
                  if (data[k] !== 'N/A' && k !== 'imageurl' && k !== 'thumbnail_url' && k !== 'id' && k !== 'type_id' && k !== 'cartodb_id') {
                      $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + display[k] + ':&nbsp;&nbsp;</strong> ' + data[k] + ' </p>');
                    //Assign global variables for the Report
                      print_data[display[k]] = data[k];
                      print_data['Image URL'] = data.imageurl;
                      window.print_data = print_data;
                  }
              }
            });
            

            subLayer.setInteraction(true);
        });

    var myLayer = cartodb.createLayer(map, {
      user_name: 'cityscan',
      type: 'cartodb',
      sublayers: [  
        {
          sql: "SELECT * FROM superior",
          cartocss: "#superior[type=\"Vacant Lot\"]{marker-fill: #F79D00;}[type=\"On-Premise Signage\"]{marker-fill: #4B25EE;}[type=\"Billboards\"]{marker-fill: #16D7CB;}",
          interactivity: "height_above_ground_level_meters,collected_date,address,id,imageurl,lat,lon,notes,sign_height_meters,sign_type,sign_width_meters,sign_wording,thumbnail_url,type,type_id,cartodb_id,apn,owner_name,owner_na_1,owner_na_2,address_ma,city_maili,state_mail,zip_code_m,legal_text,bk,pg,par,section,tax_area_c,inc_stat,range,township,date_of_sa,sale_amoun,fee_number"
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
                    var VacantLots = $('#control_VacantLots')[0].checked;console.log("Vacant Lots: "+VacantLots);
                    var Signage = $('#control_On-PremiseSignage')[0].checked;console.log("On-Premise Signage: "+Signage);
                    var Billboards = $('#control_Billboards')[0].checked;console.log("Billboards: "+Billboards);

                    types = {};
                    types['Vacant Lot'] = VacantLots;
                    types['On-Premise Signage'] = Signage;
                    types['Billboards'] = Billboards;

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
                        sql = "SELECT * FROM superior WHERE type in(" + instring + ")";
                        console.log(sql)
                        return sql;    
                    } else {
                        
                        return false;
                        //sql = "SELECT * FROM superior"
                    }
                };

                $('#control_VacantLots').click(function(){
                    sql = updateMapByClient();
                    if (sql) {
                        layer.getSubLayer(0).show();
                        layer.getSubLayer(0).setSQL(sql);
                    } else {
                        layer.getSubLayer(0).hide();
                    }
                   //layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#control_On-PremiseSignage').click(function(){
                    sql = updateMapByClient()
                    if (sql) {
                        layer.getSubLayer(0).show();
                        layer.getSubLayer(0).setSQL(sql);
                    } else {
                        layer.getSubLayer(0).hide();
                    }
                   //layer.getSubLayer(0).setSQL(updateMapByClient());
                });
                $('#control_Billboards').click(function(){
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
                      
                      $('#sidebar').append('<a href="https://s3.amazonaws.com/cityscan-demo-img/superior_onpremise/61.JPG " target="_blank"><img src="https://s3.amazonaws.com/cityscan-demo-img/superior_onpremise/61.JPG" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTES -</p>');

              // human-friendly labels for db fields
              // TODO: figure out WTF pg, par, and inc_stat mean

              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT height_above_ground_level_meters,collected_date,address,id,imageurl,lat,lon,notes,sign_height_meters,sign_type,sign_width_meters,sign_wording,thumbnail_url,type,type_id,cartodb_id,apn,owner_name,owner_na_1,owner_na_2,address_ma,city_maili,state_mail,zip_code_m,legal_text,bk,pg,par,section,tax_area_c,inc_stat,range,township,date_of_sa,sale_amoun,fee_number FROM superior WHERE cartodb_id = ' + data.cartodb_id), function(data) {
                  //Prepare DYNAMIC content for Sidebar on Document Load   
                      $('#sidebar').html('');
                      $('#sidebar').append('<a href="' + data.rows[0].imageurl + '" target="_blank"><img src="' + data.rows[0].thumbnail_url + '" height="250" width="300" id="image_sidepanel"></a>');
                      $('#sidebar').append('<br /><p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTES -</p>');
                      var print_data = {};
                      for (var k in data.rows[0]) {
                          if (data.rows[0][k] !== 'N/A' && k !== 'imageurl' && k !== 'thumbnail_url' && k !== 'id' && k !== 'type_id' && k !== 'cartodb_id') {
                              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + display[k] + ':&nbsp;&nbsp;</strong> ' + data.rows[0][k] + ' </p>');
                            //Assign global variables for the Report
                              print_data[display[k]] = data.rows[0][k];
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

              $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT height_above_ground_level_meters,collected_date,address,id,imageurl,lat,lon,notes,sign_height_meters,sign_type,sign_width_meters,sign_wording,thumbnail_url,type,type_id,cartodb_id,apn,owner_name,owner_na_1,owner_na_2,address_ma,city_maili,state_mail,zip_code_m,legal_text,bk,pg,par,section,tax_area_c,inc_stat,range,township,date_of_sa,sale_amoun,fee_number FROM superior WHERE cartodb_id = ' + data.cartodb_id), function(data) {
              
              $('#hoverbox').html('');

              $('#hoverbox').append('<br/><p align="center"><img height="150" width="200" src='+ data.rows[0].thumbnail_url +'><p/>');
              $('#hoverbox').append('<span id="hoverboxTitle">' + 'Type:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].type +'</span><br/>');
         
              $('#hoverbox').append('<span id="hoverboxTitle">' + 'Date Collected:&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].collected_date +'</span><br />');     

              $('#hoverbox').append('<span id="hoverboxTitle">' + 'Address (approx.):&nbsp;</span><span id="hoverboxContent">' +'</strong>'+ data.rows[0].address +'</span>');
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
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20superior%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=kml";
        $(this).attr("href", new_sql);
      });

  //Download Shapefile format           
  $('#downshp').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20superior%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=shp";
        $(this).attr("href", new_sql);
      });
      
  //Download GeoJSON format           
  $('#downgeojson').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20superior%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=geojson";
        $(this).attr("href", new_sql);
      });
      
  //Download CSV format           
  $('#downcsv').click(function () {
    var nwlat = map.getBounds().getNorthWest().lat,
        nwlon = map.getBounds().getNorthWest().lng,
        selat = map.getBounds().getSouthEast().lat,
        selon = map.getBounds().getSouthEast().lng;
    var new_sql = "http://cityscan.cartodb.com/api/v2/sql?q=SELECT%20*%20FROM%20superior%20WHERE%20the_geom%20%26%26%20ST_SetSRID(ST_MakeBox2D(ST_Point(" + nwlon + "%2C%20" + nwlat + ")%2C%20ST_Point(" + selon + "%2C%20" + selat + "))%2C4326)%20ORDER%20BY%20lat%20DESC%20LIMIT%202000&format=csv";
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
