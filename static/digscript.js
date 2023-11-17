const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });

// Function to Draw on the canvas
function draw() {
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;
    ctx.lineWidth = "15";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
  });

  canvas.addEventListener("mouseup", (event) => {
    isDrawing = false;
    makePrediction(event)
  });
}

// geting the pixels value in the form of array and converting it from 0-255 to 0-1
function get_pixle() {
  const IMAGE_SIZE = 280;
  const grayPixels = new Array(IMAGE_SIZE * IMAGE_SIZE);
  var pixels = ctx.getImageData(0, 0, 280, 280).data;

  for (let i = 3; i < pixels.length; i += 4) {
    const x = Math.floor((i / 4) % canvas.width);
    const y = Math.floor(i / 4 / canvas.width);
    const index = y * IMAGE_SIZE + x;

    grayPixels[index] = pixels[i] / 255;
  }
  return grayPixels;
}

draw();

// Clear the canvas screen
clear = document.getElementById("clearCanvas");
clear.addEventListener("click", ()=>{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
})

// To submit forms without reloading and fetch the predicted value from django view(digit)
const button = document.getElementById("sub-btn");
const xhr = new XMLHttpRequest();

button.addEventListener("click", makePrediction);

function makePrediction(event){
  event.preventDefault();
  xhr.open("POST", "");
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken")); //Very important otherwise("Forbidden (CSRF token missing.): /") error
  const data = JSON.stringify({ pixelSet: get_pixle() });
  xhr.send(data);
  xhr.onload = () => {
    if (xhr.status === 200) {
      const pred_data = JSON.parse(xhr.responseText);
      display_pred(pred_data);
    }
  };
}

// To fetch crsftoken
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

//Display the value and progress bar
function display_pred(data) {
  // Display value prediction
  document.getElementById("predict_value").innerText = data.value;

  //Display progress bar
  arr = data.pred_array
  var progressBar = document.getElementById("progress_bar");
  progressBar.replaceChildren(); //Remove old progress bars
  
  // Creating progressBar for all 10 digit prediction
  for(let i=0; i<arr.length; i++){
    var progressContainer = document.createElement("div");
    progressContainer.className = "progress_container";
  
    var predValue = document.createElement("div");
    predValue.className = "prog_text";
    predValue.id = "pred_value";
    predValue.textContent = i;
  
    var progress = document.createElement("div");
    progress.className = "progress";
  
    var progressValue = document.createElement("div");
    // progressValue.style.width = arr[i]+"%";
    progressValue.className = "progress-value";
  
    var predPercent = document.createElement("div");
    predPercent.className = "prog_text";
    predPercent.id = "pred_percent";
    predPercent.textContent = arr[i]+"%";

    // Set the custom Progress value
    progressValue.style.setProperty("--progBarValue", arr[i] + "%");
  
    // Append the elements to the container
    progress.appendChild(progressValue);
    progressContainer.appendChild(predValue);
    progressContainer.appendChild(progress);
    progressContainer.appendChild(predPercent);

    progressBar.appendChild(progressContainer);
  }

  // Auto scroll down
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth"
  })
}
