function preload() {
    tiles = {
        W: loadImage("textures/Ground.png"),
        G: loadImage("textures/Brick.png"),
        R: loadImage("textures/Roof.png"),
    };
}

function setup() {
    createCanvas(300, 300);
    background(51);
    room = new Room(roomTemplates.level1, 100, tiles);
}

function draw() {
    room.draw();
}
