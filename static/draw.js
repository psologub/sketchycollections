
const canvas = document.getElementById("canvas");
var canvas_wrapper = document.getElementById("canvas_wrapper");
let context = canvas.getContext("2d");
// canvas.style.width = 320 + "px";
// canvas.style.height = 400 + "px";

// https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
// Set actual size in memory (scaled to account for extra pixel density).
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
// canvas.width = Math.floor(420 * scale);
// canvas.height = Math.floor(500 * scale);
canvas.width = Math.floor(320 * scale);
canvas.height = Math.floor(400 * scale);

// Normalize coordinate system to use css pixels.
context.scale(scale, scale);



let start_bg_color = "#f3f2f2";
// let start_bg_color = "white";
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
    if (event.type === 'mousedown') {
        context.moveTo(event.clientX - canvas.offsetLeft, 
            event.clientY - canvas.offsetTop);
    } else {
        context.moveTo(event.touches[0].clientX - canvas.offsetLeft, 
            event.touches[0].clientY - canvas.offsetTop);
    }
    
    //let default changes disappear (?)
    event.preventDefault();
}

//make drawing
function draw(event) {
    if ( is_drawing ) {
        //draw line to coordinates the mouse is moving to 
        if (event.type === 'mousemove') {
            context.lineTo(event.clientX - canvas.offsetLeft, 
                        event.clientY - canvas.offsetTop);
        } else {
            context.lineTo(event.touches[0].clientX - canvas.offsetLeft, 
                event.touches[0].clientY - canvas.offsetTop);
        }
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

// function touchstart(event) { start(event.touches[0]) }
// function touchdraw(event) { draw(event.touches[0]); event.preventDefault(); }
// function touchend(event) { stop(event.changedTouches[0]) }

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
