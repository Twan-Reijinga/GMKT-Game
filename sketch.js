function preload(){
    groundTex = loadImage("textures/Ground.png");
    wallTex = loadImage("textures/Brick.png");
    roofTex = loadImage("textures/Roof.png");
}

function setup() {
    noSmooth()
    tiles = {
        "G": groundTex,
        "W": wallTex,
        "R": roofTex
    };
    createCanvas(300, 300);
    background(51);
    room = new Room(["WWW", "GGG", "WWW"], 100, tiles);

}

function draw() {
    room.draw();
}
function draw() {
    room.draw();
}
