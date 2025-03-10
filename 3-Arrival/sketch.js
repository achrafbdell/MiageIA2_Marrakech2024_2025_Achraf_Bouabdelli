let target, vehicle;
let vehicles = [];
let targets = [];
let font;
let mode = "snake";

// Appelée avant de démarrer l'animation, utile pour l'exercice avec text2points
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  target = createVector(0, 0);

  // Pour le texte
  // Dessin du texte en blanc
  targets = font.textToPoints('EMSI!', 116, 300, 335,
    { sampleFactor: 0.05 });

  creerDesVehicules(targets.length);
}

function creerDesVehicules(nb) {
  for (let i = 0; i < nb; i++) {
    let v = new Vehicle(random(width), random(height));
    vehicles.push(v);
  }
}

// appelée 60 fois par seconde
function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 10);

  // Draw a dot at each point.
  for (let p of targets) {
    push();
    fill(255, 20);
    circle(p.x, p.y, 10);
    pop();
  }



  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;

  // dessin de la cible en rouge
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  vehicles.forEach((vehicle, index) => {
    if (mode === "snake") {
      if (index === 0) {
        // Le vehicule courant est le premier, il suit la target dirigée par la souris
        vehicle.applyBehaviors(target);
      } else {
        // Les autres vehicules suivent le vehicule précédent
        let vehiculePrecedent = vehicles[index - 1];
        vehicle.applyBehaviors(vehiculePrecedent.pos, 15);

        // On dessine une ligne transparente entre le véhicule courant et le véhicule précédent
        push();
        stroke(255, 50);
        strokeWeight(vehicle.r)
        line(vehicle.pos.x, vehicle.pos.y, vehiculePrecedent.pos.x, vehiculePrecedent.pos.y);
        pop();
      }
    } else if (mode === "texte") {
      let t = createVector(targets[index].x, targets[index].y);

      // Si la souris n'est pas près du vehicule, on fait le arrive sur la cible
      // (le point du texte correspondant à l'index)
      let d = p5.Vector.dist(target, vehicle.pos);
      if (d > 100) {
        // Le vehicule courant suit un point de la liste targets
        vehicle.applyBehaviors(t);
      } else {
        let force = vehicle.flee(target);
        vehicle.applyForce(force);
      }

      // A tester aussi pour faire trembler le texte...
      /*
      // Si la souris n'est pas près du vehicule, on fait le arrive sur la cible
      // (le point du texte correspondant à l'index)
      let d = p5.Vector.dist(t, vehicle.pos);
      if (d > 30) {
        // Le vehicule courant suit un point de la liste targets
        vehicle.applyBehaviors(t);
      } else
      */
    } else if (mode === "texteExplose") {
      // Le vehicule fuit sa cible
      let t = createVector(targets[index].x, targets[index].y);
      let force = vehicle.flee(t);
      vehicle.applyForce(force);
    }

    vehicle.update();
    vehicle.show();
  });
}

function keyPressed() {
  switch (key) {
    case 'd':
      Vehicle.debug = !Vehicle.debug;
      break;
    case 's':
      mode = 'snake';
      break;
    case 't':
      mode = 'texte';

      // On démarre un timer qui va changer le mode 3s plus tard
        setTimeout(() => {
          mode = 'texteExplose';
        }, 3000);

        /* ceci correspond à l'exercice des slides */
        /*
        mode = 'none';
        vehicles.forEach((vehicle,) => {
          vehicle.vel.x = random(-5, 5);
          vehicle.vel.y = random(-5, 5);
        });
      }, 3000);
      */
      break;
  }
}