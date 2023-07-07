function preload() {
    tiles = {
        W: {
            texture: loadImage("textures/Ground.png"),
            walkable: false,
            generationChance: 5,
        },
        G: {
            texture: loadImage("textures/Brick.png"),
            walkable: true,
            generationChance: 5,
        },
        R: {
            texture: loadImage("textures/Roof.png"),
            walkable: false,
            generationChance: 190,
        },
    };
    playerSprite = loadImage("textures/tmpPlayerSprite.png");
}

function setup() {
    createCanvas(300, 300);
    background(51);
    room = new Room(roomTemplates.level1, 100, tiles);
    player = new Player(playerSprite, 0, 200, 25, 50);
}

function draw() {
    room.draw();
    player.draw();
}
