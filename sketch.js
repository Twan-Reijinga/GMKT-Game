function preload() {
    playerSprite = loadImage("textures/tmpPlayerSprite.png");
    tileMap = loadImage("textures/tiles.png");
}

function setup() {
    tiles = [
        tileMap.get(0, 0, 8, 8),
        tileMap.get(0, 8, 8, 8),
        tileMap.get(8, 0, 8, 8),
        tileMap.get(16, 0, 8, 8),
        tileMap.get(8, 8, 8, 8),
        tileMap.get(0 + 24, 0, 8, 8),
        tileMap.get(0 + 24, 8, 8, 8),
        tileMap.get(8 + 24, 0, 8, 8),
        tileMap.get(16 + 24, 0, 8, 8),
        tileMap.get(8 + 24, 8, 8, 8),
        tileMap.get(8 + 24, 8, 8, 8),
    ];
    createCanvas(950, 950);
    background(51);
    room = new Room(roomTemplates.level1, 50, tiles);
    player = new Player(playerSprite, 0, 0, 20, 40, true);
}

function draw() {
    room.draw();
    player.draw();

    playerInput();
}

function playerInput() {
    //playerInput geseparate, maakt later makkelijker om 2 players te hebben.
    if (keyIsDown(UP_ARROW)) {
        player.move("up");
    }
    if (keyIsDown(DOWN_ARROW)) {
        player.move("down");
    }
    if (keyIsDown(LEFT_ARROW)) {
        player.move("left");
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player.move("right");
    }
}

function arrayFromMap(img, size) {
    arr = [];
    for (let y = 0; y < size; y++) {
        v = [];
        for (let x = 0; x < size; x++) {
            v.push(+(red(img.get(x, y)) != 0));
        }
        str = "[" + v.join(",") + "],\n";
        arr.push(str);
    }
    console.log("[" + arr.join("") + "]");
}
