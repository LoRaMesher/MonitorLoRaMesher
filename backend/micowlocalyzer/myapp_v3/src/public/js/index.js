function initMap(){

  var markerStore = {};

  var Interval = 20000;
  // Map option

  var options = {
    center: {lat: 41.3851 , lng:2.1734 },
    zoom: 10,
    gestureHandling: 'greedy'
  }
//New Map
map = new google.maps.Map(document.getElementById("map"),options);
  getCoordinates();

  async function getCoordinates(){
    // const res = await fetch('/get_gps');
    // const data = await res.json();
    
    // const gpss = data.data.map(gps => {
    //   console.log(gps.id);
    // });
  $.get('/get_gps', {} , function(res , resp){
    //console.log(res);
    for (var i = 0 , len= res.length ; i < len; i++){

      if (markerStore.hasOwnProperty(res[i].id)){
        markerStore[res[i].id].setPosition(new google.maps.LatLng(res[i].lat , res[i].lon));
      }
      else{
      var marker = new google.maps.Marker({
        position:new google.maps.LatLng(res[i].lat , res[i].lon),
        map:map,

        });
        markerStore[res[i].id] = marker;
    } 
    marker.addListener('click',() =>{
      window.location.href = "../index_heatmap.html";
    })
  }
  window.setTimeout(getCoordinates, Interval);
  }, "json"); 
  }
  
  //Add Markers to Array

  // let MarkerArray = [ {location:{lat: 41.1189, lng: 1.2445},
  //     content: `<h2>Tarragona</h2>`},

  //     {location:{lat: 41.9794, lng: 2.8214}, content: `<h2>Girona</h2>`},

  //     {location:{lat: 41.3851, lng: 2.1734},content: `<h2>Barcelona</h2>` }]

  // // loop through marker
  // for (let i = 0; i < MarkerArray.length; i++){
  //     addMarker(MarkerArray[i]);

  // }

  // Add Marker
/*
  function addMarker(property){

      const marker = new google.maps.Marker({
          position:property.location,
          map:map,

          });

          // Check for custom Icon


          if(property.content){
            const detailWindow = new google.maps.InfoWindow({
            content: property.content
          });

            marker.addListener("mouseover", () =>{
                detailWindow.open(map, marker);
            })
            marker.addListener('mouseout',() =>{
              detailWindow.close();
            })
          }

  }*/

}
