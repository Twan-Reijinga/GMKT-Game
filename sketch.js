function preload() {
    tiles = {
        W: {
            texture: loadImage("textures/Brick.png"),
            walkable: false,
            generationChance: 5,
        },
        G: {
            texture: loadImage("textures/Ground.png"),
            walkable: true,
            generationChance: 5,
        },
        R: {
            texture: loadImage("textures/Roof.png"),
            walkable: false,
            generationChance: 190,
        },
    };
}

function setup() {
    createCanvas(1000, 1000);
    background(51);
    room = new Room(MakeRoom(10, 10), 100, tiles);
}

function draw() {
    room.draw();
}
