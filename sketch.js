let images = [];        // Array to store images
let blendModes = [];    // Array to store blend modes for each image
let overlayColor = [0, 0, 0, 50]; // Default overlay color (black with 50 alpha)
let saveButton;
let colorInput;
let blurSlider;         // Slider to adjust blur amount
let blurLayerSelect;    // Dropdown to select which layer to blur
let blurAmount = 0;     // Current blur amount
let blurLayerIndex = -1; // Index of the layer to blur (-1 means no blur)

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  let uploadButton = createFileInput(handleFiles);
  uploadButton.position(10, 10);
  uploadButton.attribute('multiple', 'true');  // Allow multiple file uploads
  
  let randomizeButton = createButton('Randomize Blend Modes');
  randomizeButton.position(10, 60);
  randomizeButton.mousePressed(randomizeBlendModes);
  
  saveButton = createButton('Save Image');
  saveButton.position(10, 110);
  saveButton.mousePressed(saveImage);
  
  // Input for the custom hex color for the overlay
  colorInput = createInput('#000000');
  colorInput.position(10, 160);
  colorInput.input(updateOverlayColor);  // Update overlay color when the hex code is changed

  // Dropdown to select the layer to blur
  blurLayerSelect = createSelect();
  blurLayerSelect.position(10, 210);
  blurLayerSelect.option('None');
  blurLayerSelect.changed(updateBlurLayer);

  // Slider to adjust blur amount
  blurSlider = createSlider(0, 10, 0, 0.1); // Min: 0, Max: 10, Initial: 0, Step: 0.1
  blurSlider.position(10, 260);
  blurSlider.input(updateBlurAmount);

  textSize(16);
  textAlign(CENTER, CENTER);
  text('TASE 2025', width / 2, height / 2);
}

function draw() {
  if (images.length === 0) {
    return; // Return early if no images are loaded
  }

  // Clear the canvas
  background(255);

  // Draw all images with their respective blend modes, stacked on top of each other
  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      // Apply the random blend mode to each image
      blendMode(eval(blendModes[i]));
      
      // Calculate the aspect ratio of the image
      let imgWidth = images[i].width;
      let imgHeight = images[i].height;
      let aspectRatio = imgWidth / imgHeight;

      // Resize image to fit within 60% of the canvas width while keeping the aspect ratio
      let newWidth = width * 0.6;  // 60% of the canvas width
      let newHeight = newWidth / aspectRatio; // Adjust height to maintain aspect ratio

      // Center the image horizontally and vertically
      let xPos = (width - newWidth) / 2;
      let yPos = (height - newHeight) / 2;

      // Apply blur filter if this is the selected layer
      if (i === blurLayerIndex) {
        drawingContext.filter = `blur(${blurAmount}px)`;
      } else {
        drawingContext.filter = 'none'; // Reset filter for other layers
      }

      // Draw the image
      image(images[i], xPos, yPos, newWidth, newHeight);

      // Reset the filter after the image is drawn
      drawingContext.filter = 'none';

      // Apply the color overlay on top of the image
      fill(overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]);
      noStroke();
      rect(xPos, yPos, newWidth, newHeight);  // Overlay as a transparent rectangle
    }
  }

  blendMode(BLEND);  // Reset the blend mode after drawing all images
}

function handleFiles(file) {
  if (file.type === 'image') {
    loadImage(file.data, (img) => {
      images.push(img);  // Add the loaded image to the images array
      blendModes.push('BLEND');  // Default blend mode for each image
      blurLayerSelect.option(`Layer ${images.length}`); // Add layer to blur dropdown
    });
  } else {
    alert('Please upload only image files!');
  }
}

function randomizeBlendModes() {
  const possibleBlendModes = ['BLEND', 'ADD', 'DARKEST', 'LIGHTEST', 'DIFFERENCE', 'EXCLUSION', 'MULTIPLY', 'SCREEN'];
  
  for (let i = 0; i < images.length; i++) {
    let randomMode = random(possibleBlendModes);
    blendModes[i] = randomMode;
  }
}

function saveImage() {
  let saveCanvas = createGraphics(width, height);

  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      saveCanvas.blendMode(eval(blendModes[i]));

      let imgWidth = images[i].width;
      let imgHeight = images[i].height;
      let aspectRatio = imgWidth / imgHeight;

      let newWidth = width * 0.6;
      let newHeight = newWidth / aspectRatio;

      let xPos = (width - newWidth) / 2;
      let yPos = (height - newHeight) / 2;

      // Apply blur filter if this is the selected layer
      if (i === blurLayerIndex) {
        saveCanvas.drawingContext.filter = `blur(${blurAmount}px)`;
      } else {
        saveCanvas.drawingContext.filter = 'none';
      }

      saveCanvas.image(images[i], xPos, yPos, newWidth, newHeight);
      saveCanvas.drawingContext.filter = 'none'; // Reset filter after drawing

      saveCanvas.fill(overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]);
      saveCanvas.noStroke();
      saveCanvas.rect(xPos, yPos, newWidth, newHeight);
    }
  }

  saveCanvas.save('combined_image.png');
}

function updateOverlayColor() {
  let hexCode = colorInput.value();
  let c = color(hexCode);
  overlayColor = [red(c), green(c), blue(c), alpha(c)];
}

function updateBlurLayer() {
  let selected = blurLayerSelect.value();
  blurLayerIndex = selected === 'None' ? -1 : int(selected.split(' ')[1]) - 1;
}

function updateBlurAmount() {
  blurAmount = blurSlider.value();
}
