// paper.install(window);
// var canvas = document.getElementById('canvas');


// window.onload = function() {

//   // Create an empty project and a view for the canvas:
//   paper.setup(canvas);
//   var tool = new Tool();
//   var path;




//   tool.onMouseDown = function(event) {
//       path = new paper.Path();
//       // Give the stroke a color
//       path.strokeColor = 'black';
//       path.strokeWidth = 3;
//       path.strokeCap = 'round';
//       path.add(event.point);
//   }

//   tool.onMouseDrag = function(event) {
//       path.add(event.point);
//       // path.smooth();
//   }

//   tool.onMouseUp = function(event) {
//     path.add(event.point);
//     // path.smooth();
//   }

 

//   view.onResize = function(event) {
//     // Whenever the view is resized, move the path to its center:
//     path.position = view.center;
//   }

//   $('#undo').click(function () {
//     // removes previous path
//         path.remove();
//      }) 

     
//   $('#clear').click(function () {
//     // removes all layers/paths
//       project.activeLayer.remove();
//       })
  

//   // $('#doodle_predict').click(function () {
//   //   // select all layers
//   //   var raster = project.activeLayer.rasterize();
//   //   // turn to base64 data
//   //   img = raster.toDataURL();

//   //   console.log(img);
    
//   // })

//   $('#doodle_predict').click(function () {
//     // select all layers
//     var raster = project.activeLayer.rasterize();
//     // turn to base64 data
//     img = raster.toDataURL();
//     console.log(img)

//     var settings = {
//         "url": "http://127.0.0.1:5000/museum-retriever",
//         "method": "POST",
//         "timeout": 0,
//         "headers": {
//           "Content-Type": "application/json"
//         },
//         "data": JSON.stringify({
//           "query_img": img
//         }),
//       };

//       $.ajax(settings).done(function (response) {
    

//         console.log(response['match_data'])      
//         var cooper_images = response['match_data']['cooper']['top_url']
//         $("#ch_img_1").css('background-image', 'url("' + cooper_images[0] + '")');
//         $("#ch_img_2").css('background-image', 'url("' + cooper_images[1] + '")');
//         $("#ch_img_3").css('background-image', 'url("' + cooper_images[2] + '")');

//         var met_images = response['match_data']['met']['top_url']
//         $("#met_img_1").css('background-image', 'url("' + met_images[0] + '")');
//         $("#met_img_2").css('background-image', 'url("' + met_images[1] + '")');
//         $("#met_img_3").css('background-image', 'url("' + met_images[2] + '")');

//         var sm_images = response['match_data']['science']['top_url']
//         $("#sm_img_1").css('background-image', 'url("' + sm_images[0] + '")');
//         $("#sm_img_2").css('background-image', 'url("' + sm_images[1] + '")');
//         $("#sm_img_3").css('background-image', 'url("' + sm_images[2] + '")');

//       })
//     })

    
//     $('#image_predict').click(function () {
  
//       var settings = {
//           "url": "http://127.0.0.1:5000/museum-retriever",
//           "method": "POST",
//           "timeout": 0,
//           "headers": {
//             "Content-Type": "application/json"
//           },
//           "data": JSON.stringify({
//             "query_img": base64
//           }),
//         };
  
//         $.ajax(settings).done(function (response) {
           
//           console.log(response['match_data'])      
//           var cooper_images = response['match_data']['cooper']['top_url']
//           $("#ch_img_1").css('background-image', 'url("' + cooper_images[0] + '")');
//           $("#ch_img_2").css('background-image', 'url("' + cooper_images[1] + '")');
//           $("#ch_img_3").css('background-image', 'url("' + cooper_images[2] + '")');
  
//           var met_images = response['match_data']['met']['top_url']
//           $("#met_img_1").css('background-image', 'url("' + met_images[0] + '")');
//           $("#met_img_2").css('background-image', 'url("' + met_images[1] + '")');
//           $("#met_img_3").css('background-image', 'url("' + met_images[2] + '")');
  
//           var sm_images = response['match_data']['science']['top_url']
//           $("#sm_img_1").css('background-image', 'url("' + sm_images[0] + '")');
//           $("#sm_img_2").css('background-image', 'url("' + sm_images[1] + '")');
//           $("#sm_img_3").css('background-image', 'url("' + sm_images[2] + '")');
//         })
//       })

    

    
// }


  
    










  function changeInput(cityName, elmnt) {
      // Hide all elements with class="tabcontent" by default */
      var i, tabcontent, tab_buttons, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      // tab_buttons = document.getElementsByClassName("tab_buttons");
    

      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      
  
      // Show the specific tab content
      document.getElementById(cityName).style.display = "block";
    
      
    }
    
    // Get the element with id="defaultOpen" and click on it
    document.getElementById("defaultOpen").click(); 



    //https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
  var base64;

  function previewFile() {
      const preview = document.querySelector('.img_upload');
      const file = document.querySelector('input[type=file]').files[0];
      const reader = new FileReader();

      reader.addEventListener("load", function () {
          // get base64 image 
          $(".upload_img").css('background-image', 'url("' + reader.result + '")'); 
          //https://stackoverflow.com/questions/47195119/how-to-capture-filereader-base64-as-variable
          base64 = reader.result;
      }, false);

      if (file) {
          reader.readAsDataURL(file);
      }
  }

  

    const canvas = document.getElementById("canvas");
    var canvas_wrapper = document.getElementById("canvas_wrapper");
    let context = canvas.getContext("2d");
    var size = 420;
    canvas.style.width = size + "px";
    canvas.style.height = size + "px";
    
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = Math.floor(size * scale);
    canvas.height = Math.floor(size * scale);
    
    // Normalize coordinate system to use css pixels.
    context.scale(scale, scale);


    
    let start_bg_color = "white";
    context.fillStyle = start_bg_color;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    let draw_color = "black";
    let draw_width = "4";
    let is_drawing = false;
    
    //save drawing paths in array for undo function
    let restore_array = [];
    //-1 means that there is no drawing (first path position starts at 0)
    let index = -1;
    
    //for phone/tablet
    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", draw, false);
    //for computer
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", draw, false);
    
    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mouseup", stop, false);
    canvas.addEventListener("mouseout", stop, false);
    
    
    
    
    
    //prepare drawing (event gets mouse coordinates)
    function start(event) {
        is_drawing = true;
        //tells canvas to prepare to do something
        context.beginPath();
        //get coordinates (what about canvas.offset?)
        context.moveTo(event.clientX - canvas.offsetLeft, 
                        event.clientY - canvas.offsetTop);
        //let default changes disappear (?)
        event.preventDefault();
    }
    
    //make drawing
    function draw(event) {
        if ( is_drawing ) {
            //draw line to coordinates the mouse is moving to 
            context.lineTo(event.clientX - canvas.offsetLeft, 
                            event.clientY - canvas.offsetTop);
            //line styles
            context.strokeStyle = draw_color;
            context.lineWidth = draw_width;
            context.lineCap = "round";
            //get an uninterrupted line
            context.lineJoin = "round";
            //use the line styles
            context.stroke();
        }
        event.preventDefault();
    }
    
    function stop(event) {
        if ( is_drawing ) {
            context.stroke();
            context.closePath();
            is_drawing = false;
        }
        event.preventDefault();
    
        //when drawing stops, add paths into path array (push brings element to last position of an array)
        //getImageData gets the image pixels of given rectangle
        //will this work for phone?
        if ( event.type != "mouseout" ) {
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index += 1;
        }   
        console.log(restore_array);
    }
    
    function clear_canvas() {
        context.fillStyle = start_bg_color;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);
    
        restore_array = [];
        index = -1;
        $(".match_box").css('background-image', 'url()');   
    }
    
    function undo_last() {
        if ( index <= 0 ) {
            clear_canvas();
        } else {
            index -= 1;
            //remove last element from array
            restore_array.pop();
            //restore canvas with path data, start at top left corner (0,0)
            context.putImageData(restore_array[index], 0, 0);
        }
    }
    


$('#doodle_predict').click(function () {
// select all layers
// var raster = project.activeLayer.rasterize();
// turn to base64 data
img = canvas.toDataURL();

var settings = {
    "url": "http://127.0.0.1:5000/museum-retriever",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({
      "query_img": img
    }),
  };

  $.ajax(settings).done(function (response) {


    console.log(response['match_data'])      
    var cooper_images = response['match_data']['cooper']['top_url']
    $("#ch_img_1").css('background-image', 'url("' + cooper_images[0] + '")');
    $("#ch_img_2").css('background-image', 'url("' + cooper_images[1] + '")');
    $("#ch_img_3").css('background-image', 'url("' + cooper_images[2] + '")');

    var cooper_title = response['match_data']['cooper']['title'];
    $("#ch_img_title").text(cooper_title[0]);

    var cooper_tags = response['match_data']['cooper']['top_tags'];
    $("div#ch_all > .object_match > .object_tags > .tag").each(function(index) {
      $(this).text(cooper_tags[0][index]);
    });


    var met_images = response['match_data']['met']['top_url'];
    $("#met_img_1").css('background-image', 'url("' + met_images[0] + '")');
    $("#met_img_2").css('background-image', 'url("' + met_images[1] + '")');
    $("#met_img_3").css('background-image', 'url("' + met_images[2] + '")');

    var met_title = response['match_data']['met']['title']
    $("#met_img_title").text(met_title[0])

    var met_tags = response['match_data']['met']['top_tags'];
    $("div#met_all > .object_match > .object_tags > .tag").each(function(index) {
      $(this).text(met_tags[0][index]);
    });

    var sm_images = response['match_data']['science']['top_url']
    $("#sm_img_1").css('background-image', 'url("' + sm_images[0] + '")');
    $("#sm_img_2").css('background-image', 'url("' + sm_images[1] + '")');
    $("#sm_img_3").css('background-image', 'url("' + sm_images[2] + '")');

    var sm_title = response['match_data']['science']['title']
    $("#sm_img_title").text(sm_title[0])

    var sm_tags = response['match_data']['science']['top_tags'];
    $("div#sm_all > .object_match > .object_tags > .tag").each(function(index) {
      $(this).text(sm_tags[0][index]);
    });

  })
})



$('#image_predict').click(function () {
    var settings = {
        "url": "http://127.0.0.1:5000/museum-retriever",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({
          "query_img": base64
        }),
      };

      $.ajax(settings).done(function (response) {


        console.log(response['match_data'])      
        var cooper_images = response['match_data']['cooper']['top_url']
        $("#ch_img_1").css('background-image', 'url("' + cooper_images[0] + '")');
        $("#ch_img_2").css('background-image', 'url("' + cooper_images[1] + '")');
        $("#ch_img_3").css('background-image', 'url("' + cooper_images[2] + '")');
    
        var cooper_title = response['match_data']['cooper']['title'];
        $("#ch_img_title").text(cooper_title[0]);
    
        var cooper_tags = response['match_data']['cooper']['top_tags'];
        $("div#ch_all > .object_match > .object_tags > .tag").each(function(index) {
          $(this).text(cooper_tags[0][index]);
        });
    
    
        var met_images = response['match_data']['met']['top_url'];
        $("#met_img_1").css('background-image', 'url("' + met_images[0] + '")');
        $("#met_img_2").css('background-image', 'url("' + met_images[1] + '")');
        $("#met_img_3").css('background-image', 'url("' + met_images[2] + '")');
    
        var met_title = response['match_data']['met']['title']
        $("#met_img_title").text(met_title[0])
    
        var met_tags = response['match_data']['met']['top_tags'];
        $("div#met_all > .object_match > .object_tags > .tag").each(function(index) {
          $(this).text(met_tags[0][index]);
        });
    
        var sm_images = response['match_data']['science']['top_url']
        $("#sm_img_1").css('background-image', 'url("' + sm_images[0] + '")');
        $("#sm_img_2").css('background-image', 'url("' + sm_images[1] + '")');
        $("#sm_img_3").css('background-image', 'url("' + sm_images[2] + '")');
    
        var sm_title = response['match_data']['science']['title']
        $("#sm_img_title").text(sm_title[0])
    
        var sm_tags = response['match_data']['science']['top_tags'];
        $("div#sm_all > .object_match > .object_tags > .tag").each(function(index) {
          $(this).text(sm_tags[0][index]);
        });
    
      })
    })