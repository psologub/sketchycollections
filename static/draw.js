const canvas = document.getElementById("canvas");
var canvas_wrapper = document.getElementById("canvas_wrapper");
let context = canvas.getContext("2d");
var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
var height = parseFloat(window.getComputedStyle(canvas, null)["height"].slice(0, -2))
var width = parseFloat(window.getComputedStyle(canvas, null)["width"].slice(0, -2))
canvas.width = Math.floor(width * scale);
canvas.height = Math.floor(height * scale);
context.scale(scale, scale);

let start_bg_color = "#f3f2f2";
context.fillStyle = start_bg_color;
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = "black";
let draw_width
var windowSize = window.matchMedia("(max-width: 1279px)")

if (windowSize.matches) {
    draw_width = "3";
} else {
    draw_width = "4"
}

let is_drawing = false;

//save drawing paths in array for undo function
let restore_array = [];
//-1 means that there is no drawing (first path position starts at 0)
let index = -1;

//for phone/tablet
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
//for desktop
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

function start(event) {
    is_drawing = true;
    context.beginPath();
    if (event.type === 'mousedown') {
        context.moveTo(event.clientX - canvas.offsetLeft, 
            event.clientY - canvas.offsetTop);
    } else {
        context.moveTo(event.touches[0].clientX - canvas.offsetLeft, 
            event.touches[0].clientY - canvas.offsetTop);
    }
        event.preventDefault();
}

function draw(event) {
    if ( is_drawing ) {
        if (event.type === 'mousemove') {
            context.lineTo(event.clientX - canvas.offsetLeft, 
                        event.clientY - canvas.offsetTop);
        } else {
            context.lineTo(event.touches[0].clientX - canvas.offsetLeft, 
                event.touches[0].clientY - canvas.offsetTop);
        }
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
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

    if ( event.type != "mouseout" ) {
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
    }   
    console.log(restore_array);
    console.log(parseFloat(window.getComputedStyle(canvas, null)["width"].slice(0, -2)))
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
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}
