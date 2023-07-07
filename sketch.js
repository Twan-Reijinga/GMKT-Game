function preload(){
    groundTex = loadImage("textures/Ground.png");
    wallTex = loadImage("textures/Brick.png");
    roofTex = loadImage("textures/Roof.png");
}

function setup() {
    tiles = {
        "G": groundTex,
        "W": wallTex,
        "R": roofTex
    };

    createCanvas(300, 300);
    background(51);
    room = new Room(["RRR", "WWW", "GGG"], 100, tiles);
}

function draw() {
    room.draw();
}
