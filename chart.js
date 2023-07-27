// Select the chart 
const chartElt = document.querySelector(".chart");

// Create the canvas
const canvas = document.createElement("canvas");
canvas.width = 50;
canvas.height = 50;

// Append the canvas to the chart
chartElt.appendChild(canvas);

// Drawing the canvas
// 1. Getting the context & setting the line-width
const ctx = canvas.getContext("2d");

ctx.lineWidth = 8;

// 2. Circle radius
const R = 20;

// 3. Draw the circle
function drawCircle(color, ratio, anticlockwise) {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, R, 0, ratio * 2 * Math.PI, anticlockwise);
    ctx.stroke();
}

// Updating the chart
function updateChart(income, outcome) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let ratio = income / (income + outcome);

    drawCircle("#fff", -ratio, true); // Income
    drawCircle("#ff2b39", 1 - ratio, false); // Outcome
}