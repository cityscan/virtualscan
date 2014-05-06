      function main() {

        // create leaflet map
        var map = L.map('map', { 
          zoomControl: false,
          center: [39,-75],
          zoom: 12
        })

        // add a base layer
        L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: 'Stamen'
        }).addTo(map);
        var myLayer = cartodb.createLayer(map, {
          user_name: 'cityscan',
          type: 'cartodb',
          sublayers: [  
            {
              sql: "SELECT * FROM wp_import",
              cartocss: "#wp_import [type=\"Bulletin\"]{marker-fill: #006E98;}[type=\"Digital\"] {marker-fill: #3B007F;}[type=\"Walls/Spectacular\"]{marker-fill: #009900;}[type=\"null\"]{marker-fill: #474747;}[type=\"Junior Poster\"]{marker-fill: #F11810;}",
              interactivity: "id,title,route_id,lat,lon,altimeter,timestamp,width,height,type,face_count,operator,mount_type,source,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl,cartodb_id"
            }]
        })
        .addTo(map)
        .done(function(layer) {
           cartodb.vis.Vis.addCursorInteraction(map, layer);
           var subLayer = layer.getSubLayer(0);
           subLayer.setInteraction(true);

           subLayer.on('featureOver', function(e, latlng, pos, data) {
                var content = $('#box');
              $('#box').show();
                  $.getJSON(encodeURI('http://cityscan.cartodb.com/api/v2/sql/?q=SELECT id,title,route_id,lat,lon,source,altimeter,imageurl_lowres,timestamp,width,height,type,face_count,operator,mount_type,display_permit,hansen_license_num,address,license_status,license_expiration_date,tag_string,image_filename,brt_id,num_other_within_500ft,within_300ft_res,face_rule,imageurl FROM wp_import WHERE cartodb_id = ' + data.cartodb_id), function(data) {
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
        });


      }

      // you could use $(window).load(main);
      window.onload = main; 