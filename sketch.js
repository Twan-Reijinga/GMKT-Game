let room;
let player1;
let player2;

function preload() {
    player1Sprite = loadImage("textures/player1.png");
    player2Sprite = loadImage("textures/player2.png");
    tileMap = loadImage("textures/tiles.png");
    leverMap = loadImage("textures/buttons.png");
    map2 = loadImage("map2.png");
}

function setup() {
    keyPressFlags = [false, false];
    tileSize = 50;
    tiles = [
        //dark <-> light = +- 5 | bridge <-> floor = +- 10
        tileMap.get(0, 0, 8, 8), // dark textures
        tileMap.get(0, 8, 8, 8),
        tileMap.get(8, 0, 8, 8),
        tileMap.get(16, 0, 8, 8),
        tileMap.get(8, 8, 8, 8),

        tileMap.get(0 + 24, 0, 8, 8), // light textures
        tileMap.get(0 + 24, 8, 8, 8),
        tileMap.get(8 + 24, 0, 8, 8),
        tileMap.get(16 + 24, 0, 8, 8),
        tileMap.get(8 + 24, 8, 8, 8),

        tileMap.get(0, 0 + 16, 8, 8), // dark bridge textures
        tileMap.get(0, 8 + 16, 8, 8),
        tileMap.get(8, 0 + 16, 8, 8),
        tileMap.get(16, 0 + 16, 8, 8),
        tileMap.get(8, 8 + 16, 8, 8),

        tileMap.get(0 + 24, 0 + 16, 8, 8), // light bridge textures
        tileMap.get(0 + 24, 8 + 16, 8, 8),
        tileMap.get(8 + 24, 0 + 16, 8, 8),
        tileMap.get(16 + 24, 0 + 16, 8, 8),
        tileMap.get(8 + 24, 8 + 16, 8, 8),
    ];

    levers = [
        leverMap.get(0, 0, 8, 8),
        leverMap.get(0, 8, 8, 8),
        leverMap.get(8, 8, 8, 8),
        leverMap.get(8, 0, 8, 8),

        leverMap.get(0 + 16, 0, 8, 8), //enabled = disabled + 5
        leverMap.get(0 + 16, 8, 8, 8),
        leverMap.get(8 + 16, 8, 8, 8),
        leverMap.get(8 + 16, 0, 8, 8),
    ];
    createCanvas(1050, 1050);
    background(51);
    setuplevel(roomTemplates.level2);
}

function setuplevel(level) {
    room = new Room(level, tileSize, [tiles, levers]);
    let runnerStart = level.startpositions[0];
    let hunterStart = level.startpositions[1];
    player1 = new Player(
        player1Sprite,
        runnerStart[0] * tileSize,
        runnerStart[1] * tileSize,
        30,
        30,
        false
    );
    player2 = new Player(
        player2Sprite,
        hunterStart[0] * tileSize,
        hunterStart[1] * tileSize,
        30,
        30,
        true
    );
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
    if (
        (keyIsDown(13) || keyIsDown(16)) &&
        (keyIsDown(13) || keyIsDown(16)) != keyPressFlags[0]
    ) {
        player1.interact(player2);
    }
    keyPressFlags[0] = keyIsDown(13) || keyIsDown(16);
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
        player2.interact(player1);
    }
    keyPressFlags[1] = keyIsDown(82);
}

function mapFromImg(img, size) {
    let floor0 = ["818181", "FF0000", "000000", "444444"];
    let bridges = ["000000", "FFFFFF"];
    let exit = "0000FF";
    let button = "FF0000";
    let rStart = "444444";
    let hStart = "999999";
    map = [];
    bridgeArr = [];
    startpositions = [[], []];
    mapExit = "";
    buttonFin = "";
    for (let y = 0; y < size; y++) {
        maprow = [];
        for (let x = 0; x < size; x++) {
            //get Layer
            col = img.get(x, y);
            col.pop();
            hexarr = hex(col, 6);

            hexcol =
                hexarr[0].slice(-2) + hexarr[1].slice(-2) + hexarr[2].slice(-2);
            if (floor0.includes(hexcol)) {
                maprow.push(0);
            } else maprow.push(1);

            if (bridges.includes(hexcol)) {
                bridgeArr.push("[" + x + ", " + y + "],");
            } else if (hexcol == exit) {
                mapExit = "[" + x + ", " + y + "],";
            } else if (hexcol == button) {
                buttonFin = "[" + x + ", " + y + ", false, 0],";
            } else if (hexcol == rStart) {
                startpositions[0] = "[" + x + ", " + y + "],";
            } else if (hexcol == hStart) {
                startpositions[1] = "[" + x + ", " + y + "],";
            }
        }
        tmpstr = "[ " + maprow.join(",") + " ],\n";
        map.push(tmpstr);
    }
    mapStr = "map: [" + map.join("") + "], \n";
    bridgesStr = "bridges: [" + bridgeArr.join("") + "],\n";
    exitStr = "escape: " + mapExit;
    buttonStr = "switch: " + buttonFin;
    startStr = "startPositions: [" + startpositions.join("") + "]";
    console.log(mapStr + bridgesStr + exitStr + buttonStr + startStr);
}
