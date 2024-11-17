let images = [];        // Array to store images
let blendModes = [];    // Array to store blend modes for each image
let overlayColor = [0, 0, 0, 50]; // Default overlay color (black with 50 alpha)
let saveButton;
let colorInput;

function setup() {
  createCanvas(windowWidth, windowHeight); // Set up canvas with a minimum width of 2000 pixels
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
  text('Upload images, randomize blend modes, and click Save Image.', width / 2, height / 2);
}

function draw() {
  if (images.length === 0) {
    return; // Return early if no images are loaded
  }

  // Dynamically calculate the total canvas height based on the images' sizes
  let totalHeight = 0;
  for (let i = 0; i < images.length; i++) {
    totalHeight = max(totalHeight, images[i].height);
  }

  // Ensure the canvas height is large enough to display all images
  resizeCanvas(width, totalHeight);

  background(255);  // Clear the canvas every time draw is called

  // Draw all images with their respective blend modes, stacked on top of each other
  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      // Apply the random blend mode to each image
      blendMode(eval(blendModes[i]));
      
      // Calculate the aspect ratio of the image
      let imgWidth = images[i].width;
      let imgHeight = images[i].height;
      let aspectRatio = imgWidth / imgHeight;

      // Resize image to fit within the canvas while retaining its aspect ratio
      let newWidth, newHeight;

      // If the image is wider than the canvas, scale it to fit the width
      if (imgWidth > imgHeight) {
        newWidth = width * 0.8; // 80% of the canvas width
        newHeight = newWidth / aspectRatio;
      } else { // If the image is taller than wide, scale it to fit the height
        newHeight = height * 0.8; // 80% of the canvas height
        newWidth = newHeight * aspectRatio;
      }

      // Center the image horizontally on the canvas
      let xPos = (width - newWidth) / 2;
      let yPos = (height - newHeight) / 2;

      // Draw the image at the same Y position, stacking them on top of each other
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

  // Draw each image on the off-screen canvas at the same position
  for (let i = 0; i < images.length; i++) {
    if (images[i]) {
      // Apply the random blend mode
      saveCanvas.blendMode(eval(blendModes[i]));
      // Draw the image on the off-screen canvas at the center
      let imgWidth = images[i].width;
      let imgHeight = images[i].height;
      let aspectRatio = imgWidth / imgHeight;
      let newWidth, newHeight;

      if (imgWidth > imgHeight) {
        newWidth = width * 0.8;
        newHeight = newWidth / aspectRatio;
      } else {
        newHeight = height * 0.8;
        newWidth = newHeight * aspectRatio;
      }

      let xPos = (width - newWidth) / 2;
      let yPos = (height - newHeight) / 2;

      saveCanvas.image(images[i], xPos, yPos, newWidth, newHeight);

      // Apply the color overlay on top of the image
      saveCanvas.fill(overlayColor[0], overlayColor[1], overlayColor[2], overlayColor[3]);
      saveCanvas.noStroke();
      saveCanvas.rect(xPos, yPos, newWidth, newHeight);  // Overlay as a transparent rectangle
    }
  }

  // Reset blend mode to BLEND for further drawings
  saveCanvas.blendMode(BLEND);
  
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
