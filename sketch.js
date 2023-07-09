let room;
let mapPreviewDrawer;

let player1;
let player2;
let winner = null;

let mapOffset;
let tileSize;
let canvasSize;
let mapSize;

let currentLevel;
let levelSelectIndex = 0;
let levels;

const states = {
    MENU: 0,
    MAPSELECT: 1,
    RUNNING: 2,
    FINISHED: 3,
    TUTORIAL: 4,
};

var state = states.MENU;

function preload() {
    doorSounds = [
        loadSound("audio/door1.wav"),
        loadSound("audio/door2.wav"),
        loadSound("audio/door3.wav"),
    ];

    swapSounds = [
        loadSound("audio/swap1.wav"),
        loadSound("audio/swap2.wav"),
        loadSound("audio/swap3.wav"),
    ];

    exitAudio = loadSound("audio/exit.wav");

    player1Sprite = loadImage("textures/player1.png");
    player2Sprite = loadImage("textures/player2.png");
    abilitySprite = loadImage("textures/ability.png");

    tileMap = loadImage("textures/tiles.png");
    leverMap = loadImage("textures/buttons.png");

    menuBackground = loadImage("textures/background.png");
    keybinds = loadImage("textures/keybindings.png");
    logo = loadImage("textures/logo.png");

    m5x7 = loadFont("font/m5x7.ttf");
}

function setup() {
    levels = Object.entries(roomTemplates);
    currentLevel = levels[0][1];
    textFont(m5x7);
    tileSize = 50;

    canvasSize = [1920, 1080];
    // mapOffset = createVector(0, 0);

    keyPressFlags = [false, false, false];

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

    mapPreviewDrawer = new Room(levels[levelSelectIndex][1], 30, [
        tiles,
        levers,
    ]);

    createCanvas(canvasSize[0], canvasSize[1]);
    background(51);
    setuplevel(currentLevel);
}

function calculateMapOffset(size, tSize) {
    totalsize = size * tSize;
    let Xoffset = (canvasSize[0] - totalsize) / 2;
    let Yoffset = (canvasSize[1] - totalsize) / 2;
    return createVector(Xoffset, Yoffset);
}

function setuplevel(gameLevel) {
    currentLevel = gameLevel;
    level = JSON.parse(JSON.stringify(gameLevel));

    winner = undefined;
    room = undefined;
    player1 = undefined;
    player2 = undefined;

    room = new Room(level, tileSize, [tiles, levers]);

    mapOffset = calculateMapOffset(room.map.length, tileSize);
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
        case states.MAPSELECT: {
            getMapSelectInputs();
            drawMapSelect();
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

function getMapSelectInputs() {
    if ((keyIsDown(37) || keyIsDown(65)) && !keyPressFlags[0]) {
        levelSelectIndex -= 1;
        if (levelSelectIndex < 0) levelSelectIndex = levels.length - 1;
        mapPreviewDrawer = new Room(levels[levelSelectIndex][1], 30, [
            tiles,
            levers,
        ]);
    }
    keyPressFlags[0] = keyIsDown(37) || keyIsDown(65);

    if ((keyIsDown(39) || keyIsDown(68)) && !keyPressFlags[1]) {
        levelSelectIndex += 1;
        if (levelSelectIndex > levels.length - 1) {
            levelSelectIndex = 0;
        }
        mapPreviewDrawer = new Room(levels[levelSelectIndex][1], 30, [
            tiles,
            levers,
        ]);
    }
    keyPressFlags[1] = keyIsDown(39) || keyIsDown(68);

    if ((keyIsDown(13) || keyIsDown(16)) && !keyPressFlags[2]) {
        setuplevel(levels[levelSelectIndex][1]);
        state = states.RUNNING;
    }
    keyPressFlags[2] = keyIsDown(13);
}

function drawMapSelect() {
    background(70);
    selectedLevelName = levels[levelSelectIndex][0];
    selectedLevel = levels[levelSelectIndex][1];
    offset = calculateMapOffset(selectedLevel.map.length, 30);
    mapPreviewDrawer.draw(offset);

    textAlign(CENTER, BOTTOM);
    textWithShadow(selectedLevelName, width / 2, offset.y - 20, 5);
    image(
        keybinds.get(32, 16, 16, 16),
        width - offset.x / 2,
        height / 2,
        120,
        120
    );
    image(
        keybinds.get(32, 48, 16, 16),
        width - offset.x / 2,
        height / 2 - 120,
        120,
        120
    );

    image(keybinds.get(0, 16, 16, 16), offset.x / 2, height / 2, 120, 120);
    image(
        keybinds.get(0, 48, 16, 16),
        offset.x / 2,
        height / 2 - 120,
        120,
        120
    );
    textAlign(CENTER);
    textWithShadow(
        "Press ENTER to confirm selection and enter level.",
        width / 2,
        height - (height - (height - offset.y)) / 2,
        5
    );
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
    if ((keyIsDown(13) || keyIsDown(16)) && !keyPressFlags[2]) {
        state = states.MAPSELECT;
    } else if (keyIsDown(72)) {
        state = states.TUTORIAL;
    }
    keyPressFlags[2] = keyIsDown(13);
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

function drawGameHud() {
    if (player1.isHunter) {
        mapSize = room.map.length * tileSize;
        pos = createVector(
            width - (width - (mapOffset.x + mapSize)) / 2,
            height - 200
        );
        image(abilitySprite, pos.x - 100, pos.y - 100, 200, 200);
        image(keybinds.get(32, 0, 32, 16), pos.x, pos.y, 120, 60);
    } else {
        pos = createVector(mapOffset.x / 2 - 100, height - 300);
        image(abilitySprite, pos.x, pos.y, 200, 200);
        image(
            keybinds.get(32, 32, 16, 16),
            pos.x + 100 + 30,
            pos.y + 100,
            60,
            60
        );
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
    if (keyIsDown(13) || keyIsDown(16)) {
        player1.interact(player2);
    }
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
    if (keyIsDown(70)) {
        player2.interact(player1);
    }
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
    let floor0 = ["818181", "00FF00", "000000", "444444"];
    let bridges = ["000000", "FFFFFF"];
    let exit = "0000FF";
    let button = "00FF00";
    let barrier = "FF0000";
    let rStart = "444444";
    let hStart = "999999";
    map = [];
    bridgeArr = [];
    barrierArr = [];
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
            } else if (hexcol == barrier) {
                barrierArr.push("[" + x + ", " + y + "],");
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
    startStr = "startPositions: [" + startPositions.join("") + "],";
    barrierStr = "barriers: [" + barrierArr.join("") + "],";
    console.log(
        mapStr + bridgesStr + exitStr + buttonStr + startStr + barrierStr
    );
}
