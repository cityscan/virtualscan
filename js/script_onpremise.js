$('document').ready( function() {

// capture mouse coordinates
if (window.Event) {
	document.captureEvents(Event.MOUSEMOVE);
	}
	document.onmousemove = getCursorXY;

function getCursorXY(e) {
	posX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	posY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
	return [posX, posY];

}

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
    map.addLayer(road, {insertAtTheBottom:true});

  function urlencode(data) {
      var ret = [];
      for (var d in data)
          ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
      return ret.join("&");
  }
  // Load default sidebar
              $('#sidebar').html('');
              
              $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
              $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Collection Date:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Sign Type:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Business Type:&nbsp;&nbsp;' +'</strong></p>');
             
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Lat/Lon:&nbsp;&nbsp;' +'</strong></p>');
              
              
              $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- CONDITION -</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Building Permit ID:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License ID:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Sign Violation:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License Violation:&nbsp;&nbsp;' +'</strong></p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong></p>');
            

  function highlightFeature(e) {
      var layer = e.target;
      layer.bindPopup('<ul><li>'+layer.feature.properties.address+'</li><li>Business Type: ' + layer.feature.properties.biz_type + '</li><li>Sign Type: ' + layer.feature.properties.sign_type + '</li></ul>').openPopup();
  }

  function fillInfo(e) {
      var layer = e.target;
      var lat = layer.feature.properties.lat;
      var lon = layer.feature.properties.lon;
      //layer.bindPopup('<p align="center"><a target="_blank" href='+layer.feature.properties.imageurl+'><img width="100" height="50" src='+layer.feature.properties.thumbnail+'></a></p><p align="center">'+layer.feature.properties.address+'</p>').openPopup();
	$('#box').html('');
                      $('#box').append('<span id="boxTitle">' + 'Business Type:&nbsp;</span><span id="boxContent">' +'</strong>'+ layer.feature.properties.biz_type +'</span><br/>');   
                      $('#box').append('<span id="boxTitle">' + 'Address:&nbsp;</span><span id="boxContent">' +'</strong>'+ layer.feature.properties.address +'</span><br/>');
                      $('#box').append('<span id="boxTitle">' + 'Sign Type:&nbsp;</span><span id="boxContent">' +'</strong>'+ layer.feature.properties.sign_type +'</span><br/>');    
                      $('#box').append('<span id="boxTitle">' + 'Date Collected:&nbsp;</span><span id="boxContent">' +'</strong>'+ layer.feature.properties.timestamp +'</span>');                 

//window.xcoord = getCursorXY(e);
                  //window.ycoord = getCursorXY(e);
                    //var containerObj =  $("#box").position();
                    //$('#box').offset({ left: layer.clientX + 10 , top: layer.clientY + 70 }) 
		//$('#box').offset({ left: window.event.pageX + 10 , top: window.event.pageY + 70 })        

var popup = layer.bindPopup('<p><span id="boxTitle">Address: ' + '</span><span id="boxContent"> ' +layer.feature.properties.address+'</span></p><p><span id="boxTitle">Business Type: </span><span id="boxContent">' + layer.feature.properties.biz_type + '</span></p><p><span id="boxTitle">Sign Type: </span><span id=boxContent>' +  layer.feature.properties.sign_type + '</span></p>', {className: "popupBlack"});

popup.openPopup();
$(".leaflet-popup-close-button").remove();
      $('#sidebar').html('');
      $('#sidebar').append('<a href="' + layer.feature.properties.imageurl + '" target="_blank"><img src="' + layer.feature.properties.thumbnail + '" height="250" width="300" id="image_sidepanel"></a>');
     
              
              $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- ATTRIBUTE -</p>');
              $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Collection Date:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.timestamp + '</p>');
              $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Sign Type:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.sign_type + '</p>');
              $('#sidebar').append('<p style="color:white;margin-top:10px;margin-left:7px;font-family:arial"><strong>' + 'Business Type:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.biz_type + '</p>');
             
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Address:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.address + '</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Lat/Lon:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.lat + ', ' + layer.feature.properties.lon + '</p>');
              
              
              $('#sidebar').append('<p style="color:white;margin-top: 20px; margin-left:7px;font-family:arial;font-weight:bolder">' + '- CONDITION -</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Building Permit ID:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.bp_id + '</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License ID:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.biz_id + '</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Sign Violation:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.sign_viol + '</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'Business License Violation:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.biz_viol + '</p>');
              $('#sidebar').append('<p style="color:white;margin-left:7px;font-family:arial"><strong>' + 'License Expiration Date:&nbsp;&nbsp;' +'</strong>' + layer.feature.properties.license_expiration_date +'</p>');
   
    /*
    $('#sidebar').append('<div id="streetview" style="height:300px"></div>')
        var sview = new google.maps.LatLng(lat, lon);
        var panoOptions = {
            position: sview,
            zoom: 1
        };
        var pano = new google.maps.StreetViewPanorama(document.getElementById('streetview'), panoOptions);
        pano.setVisible(true);
        */
  }

  function resetFeature(e) {
      var layer = e.target;
      layer.closePopup();
	$('#box').hide()
  }


  function onEachFeature(feature, layer) {
      layer.on({
          mouseover: fillInfo,
          //click: fillInfo
          mouseout: resetFeature
          // can't move the mouse up to the popup to click on anything
      });
  }


  function querystring(q) {
    var data = {
      'q': q,
      'format': 'GeoJSON'
      };
     var url = 'http://cityscan.cartodb.com/api/v2/sql?'
     return url + urlencode(data);
  }
  

  function getStringColor(c, val) {
      if (c == val) {
          return 'red'
      } else {
          return 'green'
      }
  }


  
  function signStyle(feature) {
 
      return {
          color: '#000',
          radius: 6,
          fillColor: getStringColor(feature.properties.sign_viol),
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
      };
  }

  function licenseStyle(feature) {
      return {
          color: '#000',
          radius: 6,
          fillColor: getStringColor(feature.properties.biz_viol),
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
      };
  }

  function expiredStyle(feature) {
      return {
          color: '#000',
          radius: 6,
          fillColor: getBoolColor(feature.properties.biz_viol),
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
      };
  }

  function permitStyle(feature) {
      return {
          color: '#000',
          radius: 6,
          fillColor: getStringColor(feature.properties.hansen_license_num, 'None'),
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
      };
  }

  var violStyleRed = {
    color: '#000',
          radius: 5,
          fillColor: 'red',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      };
  
  var defaultStyle = {
          color: '#000',
          radius: 5,
          fillColor: '#16D7CB',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      };
  

    function markerStyle(feature, latlng) {
      return L.circleMarker(latlng, defaultStyle)
      }
      
    function violStyle(feature, latlng) {
      return L.circleMarker(latlng, violStyleRed)
      }

    function changeMarkerStyle(feature, latlng) {
      if (feature.properties.viol) {
        return L.circleMarker(latlng, violStyleRed);
        } else {
        return L.circleMarker(latlng, defaultStyle);
        }
    }
    
    function bizViolStyle(feature, latlng) {
      if (feature.properties.biz_viol_bool) {
        return L.circleMarker(latlng, violStyleRed);
        } else {
        return L.circleMarker(latlng, defaultStyle);
        }
    }
        
group = L.layerGroup();

var geojson_sign ;
var geojson_license = false;
var geojson_vacant ;
var geojson_all ;

  function loadMarkers() {
    
    $.getJSON(querystring("SELECT * FROM onpremise"), function(data) {
    geojson_all =  L.geoJson(data, {
          pointToLayer: markerStyle,
          onEachFeature: onEachFeature
          }).addTo(map);
          group.addLayer(geojson_all);
  });
  
  }
  
  function loadChangeMarkers() {
  $.getJSON(querystring("SELECT * FROM onpremise"), function(data) {
     geojson_sign =  L.geoJson(data, {
          pointToLayer: changeMarkerStyle,
          onEachFeature: onEachFeature
          }).addTo(map);
          group.addLayer(geojson_all);
  });
  }
  function loadLicenseMarkers() {
    geojson_license = $.getJSON(querystring("SELECT * FROM onpremise"), function(data) {
      geojson_license = L.geoJson(data, {
          pointToLayer: bizViolStyle,
          onEachFeature: onEachFeature
          }).addTo(map);
  });
  
  }
  
  function loadBizMarkers() {
  geojson_vacant = $.getJSON(querystring("SELECT * FROM onpremise"), function(data) {
      geojson_vacant = L.geoJson(data, {
          pointToLayer: markerStyle,
          style: function(feature) {
            switch (feature.properties.biz_type) {
              case 'Food Stores': return {color: '#000',radius: 5,fillColor: '#D7162D',    weight: 1, opacity: 1,fillOpacity: 0.8};
              case 'Pharmacy': return {color: '#000',radius: 5,fillColor: '#16D7CB',    weight: 1, opacity: 1,fillOpacity: 0.8};
              case 'Religious': return {color: '#000',radius: 5,fillColor: '#F79D00',    weight: 1, opacity: 1,fillOpacity: 0.8};
              case 'Restaurants': return {color: '#000',radius: 5,fillColor: '#88F71A',    weight: 1, opacity: 1,fillOpacity: 0.8};
              case 'Retail': return {color: '#000',radius: 5,fillColor: '#FF7316',    weight: 1, opacity: 1,fillOpacity: 0.8};
              case 'Vacant Storefront':  return {color: '#000',radius: 5,fillColor: '#4B25EE',    weight: 1, opacity: 1,fillOpacity: 0.8};
              }
             },
          onEachFeature: onEachFeature
          }).addTo(map);
  });
  }

  $("#legendBigClose").click(function(){
    $("#legendBig").animate({"bottom":"-165px"}, "slow");
    $("#legendBigClose").animate({"bottom":"-36px"}, "slow");
  });

  $("#legend").click(function(){
    $("#legendBig").animate({"bottom":"0px"}, "slow");
    $("#legendBigClose").animate({"bottom":"143px"}, "slow");
  });

  //Legend Animation
  //Button toggle for legend and other radio buttons
  $('.btn-group').button();
                
              //Change colors of legend
             
              $('#legendZoning').click(function () {
                //layer.getSubLayer(0).setCartoCSS('#wp_import [num_other_within_500ft>1]{marker-fill: #000000;}');
                $( "#legendAssetLabel" ).hide();
                $( "#legendZoningLabel" ).show();
                $( "#legendSourceLabel" ).hide();
                $( "#legendPermitabel" ).hide();
              });
              $('#legendSource').click(function () {
                //layer.getSubLayer(0).setCartoCSS('#wp_import [source=\"city_records\"]{marker-fill: #006E98;}[source=\"lidar\"] {marker-fill: #474747;}[source=\"market_records\"]{marker-fill: #009900;}');
                $( "#legendAssetLabel" ).hide();
                $( "#legendZoningLabel" ).hide();
                $( "#legendSourceLabel" ).show();
                $( "#legendPermitLabel" ).hide();
              });
                  $('#spacingViolation').click(function () {
                    //layer.getSubLayer(0).setCartoCSS('#wp_import [num_other_within_500ft>1]{marker-fill: #F11810;}[num_other_within_500ft=null]{marker-fill: #006E98;}');
                  });
                  $('#residentialViolation').click(function () {
                    //layer.getSubLayer(0).setCartoCSS('#wp_import [within_300ft_res=true]{marker-fill: #F11810;}[within_300ft_res=false]{marker-fill: #006E98;}');
                  });
                  $('#heightViolation').click(function () {
                    //layer.getSubLayer(0).setCartoCSS('#wp_import [num_other_within_500ft>1]{marker-fill: #F11810;}[num_other_within_500ft=null]{marker-fill: #006E98;}');
                  });
              $('#legendPermit').click(function () {
                    //layer.getSubLayer(0).setCartoCSS('#wp_import [height_rule=true]{marker-fill: #F11810;}[height_rule=false]{marker-fill: #006E98;}');
                $( "#legendAssetLabel" ).hide();
                $( "#legendZoningLabel" ).hide();
                $( "#legendSourceLabel" ).hide();
                $( "#legendPermitLabel" ).show();
              });


              /*
              subLayer.on('featureOver', function(e, latlng, pos, data, idx) {
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,title,route_id,lat,lon,source,altimeter,imageurl_lowres,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl FROM wp_import WHERE cartodb_id = ' + data.cartodb_id), function(data) {
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
*/


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
      
        $("#control").toggle(function(){
                $("#control").animate({"bottom":"150px"}, "slow");
                $("#controlBig").animate({"bottom":"0px"}, "slow");
                $("#legendAssetLabel").show();
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
                $("#legendZoningLabel").hide();
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
                $("#legendSource").hide();
                $("#violationOR").show();
                $("#legendOperatorLabel").hide();
                if (typeof(geojson_all) != 'undefined' && map.hasLayer(geojson_all)) {
    map.removeLayer(geojson_all);
    }
  if (typeof(geojson_license) != 'undefined' && map.hasLayer(geojson_license)) {
    map.removeLayer(geojson_license);
    }
  if (typeof(geojson_vacant) != 'undefined' && map.hasLayer(geojson_vacant)) {
    map.removeLayer(geojson_vacant);
    }
  //$("#license").attr('checked', false);
  //$("#vacant").attr('checked', false);
  loadChangeMarkers();
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
                $("#legendAsset").hide();
                $("#legendZoningLabel").hide();
                $("#legendSourceLabel").show();
                $("#violationOR").hide();
                $("#legendOperatorLabel").hide();
                if (typeof(geojson_all) != 'undefined' && map.hasLayer(geojson_all)) {
    map.removeLayer(geojson_all);
    }
  if (typeof(geojson_license) != 'undefined' && map.hasLayer(geojson_license)) {
    map.removeLayer(geojson_license);
    }
  if (typeof(geojson_vacant) != 'undefined' && map.hasLayer(geojson_vacant)) {
    map.removeLayer(geojson_vacant);
    }
    loadLicenseMarkers();
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
                
                if (typeof(geojson_all) != 'undefined' && map.hasLayer(geojson_all)) {
    map.removeLayer(geojson_all);
    }
  if (typeof(geojson_license) != 'undefined' && map.hasLayer(geojson_license)) {
    map.removeLayer(geojson_license);
    }
  if (typeof(geojson_sign) != 'undefined' && map.hasLayer(geojson_sign)) {
    map.removeLayer(geojson_sign);
    }
      loadBizMarkers();
              });

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
      
      
loadMarkers();
//$("#sign").click(function() {
  
  //$("#license").attr('checked', false);
  //$("#vacant").attr('checked', false);
  //loadChangeMarkers();
  //});

 $("#license").click(function() {
  $("#sign").attr('checked', false);
  $("#vacant").attr('checked', false);
 if (typeof(geojson_all) != 'undefined' && map.hasLayer(geojson_all)) {
    map.removeLayer(geojson_all);
    }
  if (typeof(geojson_sign) != 'undefined' && map.hasLayer(geojson_sign)) {
    map.removeLayer(geojson_sign);
    }
  if (typeof(geojson_vacant) != 'undefined' && map.hasLayer(geojson_vacant)) {
    map.removeLayer(geojson_vacant);
    }
  loadLicenseMarkers();
  });
  
  $("#vacant").click(function() {
  $("#sign").attr('checked', false);
  $("#license").attr('checked', false);
  if (typeof(geojson_all) != 'undefined' && map.hasLayer(geojson_all)) {
    map.removeLayer(geojson_all);
    }
  if (typeof(geojson_license) != 'undefined' && map.hasLayer(geojson_license)) {
    map.removeLayer(geojson_license);
    }
  if (typeof(geojson_sign) != 'undefined' && map.hasLayer(geojson_sign)) {
    map.removeLayer(geojson_sign);
    }
  loadVacantMarkers();
  });
 $("#display_all").click(function() {
     $("#license").prop('checked', false);
     $("#sign").prop('checked', false);
     $("#vacant").prop('checked', false);

  if (typeof(geojson_all) != 'undefined' && map.hasLayer(geojson_license)) {
    map.removeLayer(geojson_license);
    }
  if (typeof(geojson_sign) != 'undefined' && map.hasLayer(geojson_sign)) {
    map.removeLayer(geojson_sign);
    }
  if (typeof(geojson_vacant) != 'undefined' && map.hasLayer(geojson_vacant)) {
    map.removeLayer(geojson_vacant);
    }
  loadMarkers()
  });
  
/*
  var data = { 'q' : 'SELECT  * FROM onpremise', 'format': 'GeoJSON'};
  var url = 'http://cityscan.cartodb.com/api/v2/sql?'
      var querystring = url + urlencode(data);
      */
});
