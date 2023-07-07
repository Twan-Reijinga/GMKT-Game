function preload() {
    playerSprite = loadImage("textures/tmpPlayerSprite.png");
}

function setup() {
    createCanvas(1000, 1000);
    background(51);
    room = new Room(level1, 50, tiles);
}

function draw() {
    room.draw();
    player.draw();
}
