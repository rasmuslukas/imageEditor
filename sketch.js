let images = [];        // Array to store images
let blendModes = [];    // Array to store blend modes for each image
let overlayColor = [0, 0, 0, 50]; // Default overlay color (black with 50 alpha)
let saveButton;
let colorInput;

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

      // Draw the image
      image(images[i], xPos, yPos, newWidth, newHeight);
      
      // Apply the color overlay on top of the image
      fill(overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]);
      noStroke();
      rect(xPos, yPos, newWidth, newHeight);  // Overlay as a transparent rectangle
    }
  }

  blendMode(BLEND);  // Reset the blend mode after drawing all images
}

function handleFiles(file) {
  // This function handles the file upload
  if (file.type === 'image') {
    loadImage(file.data, (img) => {
      images.push(img);  // Add the loaded image to the images array
      blendModes.push('BLEND');  // Default blend mode for each image
    });
  } else {
    alert('Please upload only image files!');
  }
}

function randomizeBlendModes() {
  // Randomize blend modes for each image
  const possibleBlendModes = ['BLEND', 'ADD', 'DARKEST', 'LIGHTEST', 'DIFFERENCE', 'EXCLUSION', 'MULTIPLY', 'SCREEN'];
  
  for (let i = 0; i < images.length; i++) {
    let randomMode = random(possibleBlendModes); // Pick a random blend mode
    blendModes[i] = randomMode; // Assign the random blend mode to the image
  }
}

function saveImage() {
  // Create an off-screen canvas to combine images
  let saveCanvas = createGraphics(width, height);

  // Draw each image on the off-screen canvas
  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      // Apply the random blend mode
      saveCanvas.blendMode(eval(blendModes[i]));
      
      // Calculate the aspect ratio of the image
      let imgWidth = images[i].width;
      let imgHeight = images[i].height;
      let aspectRatio = imgWidth / imgHeight;

      // Resize image to fit within 60% of the canvas width
      let newWidth = width * 0.6;
      let newHeight = newWidth / aspectRatio;

      // Center the image horizontally and vertically
      let xPos = (width - newWidth) / 2;
      let yPos = (height - newHeight) / 2;

      // Draw the image on the off-screen canvas
      saveCanvas.image(images[i], xPos, yPos, newWidth, newHeight);

      // Apply the color overlay on top of the image
      saveCanvas.fill(overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]);
      saveCanvas.noStroke();
      saveCanvas.rect(xPos, yPos, newWidth, newHeight);  // Overlay as a transparent rectangle
    }
  }

  // Save the combined image as a .png file
  saveCanvas.save('combined_image.png');
}

function updateOverlayColor() {
  // Get the hex color code from the input field and update the overlay color
  let hexCode = colorInput.value();
  
  // Make sure the input is a valid hex code (e.g., #FF5733)
  let c = color(hexCode);
  overlayColor = [red(c), green(c), blue(c), alpha(c)];
}
