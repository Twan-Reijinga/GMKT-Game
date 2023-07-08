let room;
let player1;
let player2;
let winner = null;
let mapOffset;
let tileSize;
let canvasSize;
let mapSize;

const states = {
    MENU: 0,
    RUNNING: 1,
    FINISHED: 2,
};

var state = states.RUNNING;

function preload() {
    player1Sprite = loadImage("textures/player1.png");
    player2Sprite = loadImage("textures/player2.png");
    tileMap = loadImage("textures/tiles.png");
    leverMap = loadImage("textures/buttons.png");
}

function setup() {
    tileSize = 50;

    canvasSize = [1920, 1080];
    // mapOffset = createVector(0, 0);

    keyPressFlags = [false, false];

    tiles = [
        //dark <-> light = +- 5 | bridge <-> floor = +- 10 | normal <-> barrier/win = +- 15
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

        tileMap.get(0, 0 + 32, 8, 8), // win area textures
        tileMap.get(0, 8 + 32, 8, 8),
        tileMap.get(8, 0 + 32, 8, 8),
        tileMap.get(16, 0 + 32, 8, 8),
        tileMap.get(8, 8 + 32, 8, 8),

        tileMap.get(0 + 24, 0 + 32, 8, 8), // barrier textures
        tileMap.get(0 + 24, 8 + 32, 8, 8),
        tileMap.get(8 + 24, 0 + 32, 8, 8),
        tileMap.get(16 + 24, 0 + 32, 8, 8),
        tileMap.get(8 + 24, 8 + 32, 8, 8),
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
    createCanvas(canvasSize[0], canvasSize[1]);
    background(51);
    setuplevel(roomTemplates.level1);
}

function calculateMapOffset(size) {
    totalsize = size * tileSize;
    let Xoffset = (canvasSize[0] - totalsize) / 2;
    let Yoffset = (canvasSize[1] - totalsize) / 2;
    return createVector(Xoffset, Yoffset);
}

function setuplevel(gameLevel) {
    level = JSON.parse(JSON.stringify(gameLevel));

    winner = undefined;
    room = undefined;
    player1 = undefined;
    player2 = undefined;

    room = new Room(level, tileSize, [tiles, levers]);

    mapOffset = calculateMapOffset(room.map.length);
    let runnerStart = level.startPositions[0];
    let hunterStart = level.startPositions[1];
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
    switch (state) {
        case states.MENU: {
            break;
        }
        case states.RUNNING: {
            background(51);
            if (winner != null) {
                state = states.FINISHED;
            }

            room.draw(mapOffset);
            player1.draw(mapOffset);
            player1Input();

            player2.draw(mapOffset);
            player2Input();
            break;
        }
        case states.FINISHED: {
            drawWinScreen();
            getWinScreenInputs();
            break;
        }
        default: {
            break;
        }
    }
}

function drawWinScreen() {
    background(51);
    textAlign(CENTER);
    textSize(45);
    fill(255, 255, 255);
    text("Press R to restart", width / 2, height / 2);
    text("Press M to go back to the menu", width / 2, height / 2 + 200);
    textSize(55);
    if (winner == player1) {
        fill(0, 0, 255);
        text("Player 1 wins the game!", width / 2, height / 2 - 200);
    } else if (winner == player2) {
        fill(255, 0, 0);
        text("Player 2 wins the game!", width / 2, height / 2 - 200);
    } else {
        text("How did I get here?", width / 2, height / 2 - 200);
    }
}
function getWinScreenInputs() {
    if (keyIsDown(82)) {
        setuplevel(roomTemplates.level3);
        state = states.RUNNING;
    }
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
    if (keyIsDown(70) && keyIsDown(70) != keyPressFlags[1]) {
        player2.interact(player1);
    }
    keyPressFlags[1] = keyIsDown(70);
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
    startPositions = [[], []];
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
                startPositions[0] = "[" + x + ", " + y + "],";
            } else if (hexcol == hStart) {
                startPositions[1] = "[" + x + ", " + y + "],";
            }
        }
        tmpstr = "[ " + maprow.join(",") + " ],\n";
        map.push(tmpstr);
    }
    mapStr = "map: [" + map.join("") + "], \n";
    bridgesStr = "bridges: [" + bridgeArr.join("") + "],\n";
    exitStr = "escape: " + mapExit;
    buttonStr = "switch: " + buttonFin;
    startStr = "startPositions: [" + startPositions.join("") + "]";
    console.log(mapStr + bridgesStr + exitStr + buttonStr + startStr);
}
