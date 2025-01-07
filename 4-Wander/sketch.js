let imageFusee;
let vehicles = [];

function preload() {
  imageFusee = loadImage('./assets/vehicule.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  creerSliderPourNombreDeVehicules(10);
  creerSlidersPourParametresVehicules();
}

function draw() {
  background(0);

  vehicles.forEach(vehicle => {
    vehicle.applyBehaviors();
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
}

function mousePressed() {
  let vehicle = new Vehicle(mouseX, mouseY, imageFusee);
  vehicle.color = color(random(255), random(255), random(255));
  vehicles.push(vehicle);
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}

function creerSliderPourNombreDeVehicules(defaultValue) {
  let slider = createSlider(1, 200, defaultValue, 1);
  slider.position(160, 185);
  let label = createP("Nombre de véhicules : " + defaultValue);
  label.position(10, 170);
  label.style('color', 'white');

  slider.input(() => {
    vehicles = [];
    for (let i = 0; i < slider.value(); i++) {
      let vehicle = new Vehicle(random(width), random(height), imageFusee);
      vehicle.color = color(random(255), random(255), random(255));
      vehicle.r = random(10, 50);
      vehicles.push(vehicle);
    }
    label.html("Nombre de véhicules : " + slider.value());
  });

  // Initialisation des véhicules
  for (let i = 0; i < defaultValue; i++) {
    let vehicle = new Vehicle(random(width), random(height), imageFusee);
    vehicle.color = color(random(255), random(255), random(255));
    vehicle.r = random(10, 50);
    vehicles.push(vehicle);
  }
}

function creerSlidersPourParametresVehicules() {
  creerUnSlider("Distance cercle", 50, 300, 150, 1, 10, 220, "distanceCercle");
  creerUnSlider("Rayon cercle", 10, 150, 50, 1, 10, 260, "wanderRadius");
  creerUnSlider("Variation angle", 0.1, 1, 0.3, 0.01, 10, 300, "displaceRange");
  creerUnSlider("Vitesse max", 1, 10, 4, 0.1, 10, 340, "maxSpeed");
  creerUnSlider("Force max", 0.1, 1, 0.2, 0.01, 10, 380, "maxForce");
  creerSliderPourLongueurCheminDerriereVehicules(50);
}

function creerUnSlider(label, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);
  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);
  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY + 17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    vehicles.forEach(vehicle => {
      vehicle[propriete] = slider.value();
    });
  });
}

function creerSliderPourLongueurCheminDerriereVehicules(defaultValue) {
  let slider = createSlider(10, 150, defaultValue, 1);
  slider.position(160, 420);
  let label = createP("Longueur trainée : " + defaultValue);
  label.position(10, 405);
  label.style('color', 'white');

  slider.input(() => {
    label.html("Longueur trainée : " + slider.value());
    vehicles.forEach(vehicle => {
      vehicle.path = [];
      vehicle.pathLength = slider.value();
    });
  });
}
