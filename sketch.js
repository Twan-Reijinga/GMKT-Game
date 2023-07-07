function preload() {
    tiles = {
        W: {
            texture: loadImage("textures/Ground.png"),
            walkable: false,
            generationChange: 5,
        },
        G: {
            texture: loadImage("textures/Brick.png"),
            walkable: true,
            generationChange: 5,
        },
        R: {
            texture: loadImage("textures/Roof.png"),
            walkable: false,
            generationChange: 190,
        },
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
