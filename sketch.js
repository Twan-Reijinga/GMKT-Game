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

    createCanvas(200, 200);
    background(51);
    room = new Room(MakeRoom(2, 2), 100, tiles);
}

function draw() {
    room.draw();
}
