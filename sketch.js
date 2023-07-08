function preload() {
    playerSprite = loadImage("textures/player.png");
    tileMap = loadImage("textures/newtiles.png");
}

function setup() {
    keyPressFlags = [false, false];
    tileSize = 50;
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
    createCanvas(1000, 1000);
    background(51);
    room = new Room(roomTemplates.level2, tileSize, tiles);
    player1 = new Player(playerSprite, 0, 0, 30, 30, true);
    player2 = new Player(playerSprite, 50, 50, 30, 30, false);
}

function draw() {
    room.draw();
    player1.draw();
    player1Input();

    player2.draw();
    player2Input();
}

function player1Input() {
    //playerInput geseparate, maakt later makkelijker om 2 players te hebben.
    if (keyIsDown(UP_ARROW)) {
        player1.move("up");
    }
    if (keyIsDown(DOWN_ARROW)) {
        player1.move("down");
    }
    if (keyIsDown(LEFT_ARROW)) {
        player1.move("left");
    }
    if (keyIsDown(RIGHT_ARROW)) {
        player1.move("right");
    }
    if (keyIsDown(13) && keyIsDown(13) != keyPressFlags[0]) {
        player1.interact(player2.TilePos);
    }
    keyPressFlags[0] = keyIsDown(13);
}

function player2Input() {
    //playerInput geseparate, maakt later makkelijker om 2 players te hebben.
    if (keyIsDown(87)) {
        player2.move("up");
    }
    if (keyIsDown(83)) {
        player2.move("down");
    }
    if (keyIsDown(65)) {
        player2.move("left");
    }
    if (keyIsDown(68)) {
        player2.move("right");
    }
    if (keyIsDown(82) && keyIsDown(82) != keyPressFlags[1]) {
        player2.interact(player1.tilePos);
    }
    keyPressFlags[1] = keyIsDown(82);
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
