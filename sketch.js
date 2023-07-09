let room;
let player1;
let player2;
let winner = null;
let mapOffset;
let tileSize;
let canvasSize;
let mapSize;
let currentLevel;

const states = {
    MENU: 0,
    RUNNING: 1,
    FINISHED: 2,
    TUTORIAL: 3,
};

var state = states.MENU;

function preload() {
    player1Sprite = loadImage("textures/player1.png");
    player2Sprite = loadImage("textures/player2.png");

    tileMap = loadImage("textures/tiles.png");
    leverMap = loadImage("textures/buttons.png");

    menuBackground = loadImage("textures/background.png");
    keybinds = loadImage("textures/keybindings.png");
    logo = loadImage("textures/logo.png");

    m5x7 = loadFont("font/m5x7.ttf");
}

function setup() {
    textFont(m5x7);
    currentLevel = roomTemplates.level1;
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
    setuplevel(currentLevel);
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
            drawMenu();
            getMenuInputs();
            break;
        }
        case states.RUNNING: {
            background(70);
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
        case states.TUTORIAL: {
            drawTutorial();
            getTutorialInputs();
            break;
        }
        default: {
            break;
        }
    }
}

function textWithShadow(val, x, y, shadowOffset, col = 255) {
    fill(0);
    text(val, x + shadowOffset, y + shadowOffset);
    fill(col);
    text(val, x, y);
}

function drawMenu() {
    noSmooth();
    textAlign(CENTER);

    image(menuBackground, 0, 0, width, height);
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    mult = 3;
    x = width / 2 - (logo.width / 2) * mult;
    y = 150 - (logo.height / 2) * mult;

    image(logo, x, y, logo.width * mult, logo.height * mult);

    fill(0, 0, 0, 70);
    rect(x, y, logo.width * mult, logo.height * mult);
    textSize(30);
    textWithShadow(
        "Play in Fullscreen (F11) for best experience",
        width / 2,
        25,
        5
    );
    textSize(50);
    textWithShadow("A 2-player game for a single keyboard", width / 2, 300, 5);

    textSize(75);
    textWithShadow("Press ENTER to start game", width / 2, height / 2 - 100, 5);
    textWithShadow("Press H for a tutorial", width / 2, height / 2 + 100, 5);
}

function getMenuInputs() {
    if (keyIsDown(13)) {
        setuplevel(currentLevel);
        state = states.RUNNING;
    } else if (keyIsDown(72)) {
        state = states.TUTORIAL;
    }
}

function drawWinScreen() {
    background(70);
    textAlign(CENTER);
    textSize(75);

    textWithShadow("Press R to play again.", width / 2, height / 2, 5);
    textWithShadow(
        "Press M to go back to the menu.",
        width / 2,
        height / 2 + 200,
        5
    );
    textSize(125);
    if (winner == player1) {
        fill(0, 0, 255);
        textWithShadow(
            "Player 1 wins the game!",
            width / 2,
            height / 2 - 200,
            5,
            [0, 0, 255]
        );
    } else if (winner == player2) {
        fill(255, 0, 0);
        textWithShadow(
            "Player 2 wins the game!",
            width / 2,
            height / 2 - 200,
            5,
            [255, 0, 0]
        );
    } else {
        textWithShadow(
            "How did I get here?",
            width / 2,
            height / 2 - 200,
            5,
            [0, 255, 0]
        );
    }
}

function getWinScreenInputs() {
    if (keyIsDown(82)) {
        setuplevel(currentLevel);
        state = states.RUNNING;
    } else if (keyIsDown(77)) {
        state = states.MENU;
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

function drawTutorial() {
    noSmooth();
    textSize(75);
    textAlign(CENTER);
    image(menuBackground, 0, 0, width, height);
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    textWithShadow(
        "MAZESWAP is a 2-player game played on a single keyboard",
        width / 2,
        50,
        5
    );
    textWithShadow("Press ESC to go back to Menu", width / 2, height - 50, 5);

    textSize(50);
    textAlign(LEFT);
    textWithShadow("The Roles:", 100, 200, 5);
    textWithShadow("The Tiles:", width / 2, 200, 5);
    textWithShadow("Controls:", 100, height / 2, 5);
    textWithShadow("Player 1:", 100, height / 2 + 100, 5, [50, 50, 255]);
    textWithShadow("Player 2:", 100, height / 2 + 225, 5, [255, 50, 50]);

    image(keybinds, 250, height / 2 + 50, 250, 250);

    textSize(30);

    textAlign(LEFT, TOP);
    textWithShadow(
        "Runner: \nAs the Runner, your goal is to escape the maze by pressing the button \nand getting to the exit.\n\nHunter:\nAs the Hunter, your goal is to get close to the runner and swap roles\nwith them by using your Interact key (F or Enter), and become the runner.",
        125,
        250,
        5
    );

    textSize(40);
    textLeading(30);
    textAlign(LEFT, CENTER);
    textWithShadow(
        "Ground tiles: The Ground tile is the default tile.\nIt can be walked on only by the Runner.",
        width / 2 + 55,
        250 + 20,
        5
    );
    image(tiles[4], width / 2, 250, 50, 50);

    textWithShadow(
        "Top tiles: Top tiles are the same as ground tile,\nbut can only be walked on by the Hunter.",
        width / 2 + 55,
        250 + 20 + 75,
        5
    );
    image(tiles[4 + 5], width / 2, 250 + 75, 50, 50);

    textWithShadow(
        "Bridge tiles: these allow both the Runner and the\nHunter to walk on, depending on their state, which\ncan be seen as a difference in brightness.",
        width / 2 + 55,
        250 + 15 + 20 + 75 * 2,
        5
    );
    image(tiles[4 + 10], width / 2, 250 + 15 + 75 * 2, 50, 50);

    textWithShadow(
        "Exit tiles: Step on this tile as a Runner to win.",
        width / 2 + 55,
        250 + 50 + 75 * 3,
        5
    );
    image(tiles[4 + 20], width / 2, 250 + 30 + 75 * 3, 50, 50);

    textWithShadow(
        "Barrier tiles: these Block anyone trying to pass.",
        width / 2 + 55,
        250 + 50 + 75 * 4,
        5
    );
    image(tiles[4 + 25], width / 2, 250 + 30 + 75 * 4, 50, 50);

    textWithShadow(
        "Button: Press this as a Runner to unlock the Exit.",
        width / 2 + 55,
        250 + 50 + 75 * 5,
        5
    );
    image(tiles[4], width / 2, 250 + 30 + 75 * 5, 50, 50);
    image(levers[0], width / 2, 250 + 30 + 75 * 5, 50, 50);
}

function getTutorialInputs() {
    if (keyIsDown(27)) {
        state = states.MENU;
    }
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
