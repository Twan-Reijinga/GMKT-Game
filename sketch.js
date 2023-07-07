function preload() {
    playerSprite = loadImage("textures/tmpPlayerSprite.png");
    tileMap = loadImage("textures/tiles.png");
}

function setup() {
    tiles = {
        0: tileMap.get(0, 0, 8, 8),
        1: tileMap.get(0, 8, 8, 8),
        2: tileMap.get(8, 0, 8, 8),
        3: tileMap.get(16, 0, 8, 8),
        4: tileMap.get(8, 8, 8, 8),
        5: tileMap.get(0 + 24, 0, 8, 8),
        6: tileMap.get(0 + 24, 8, 8, 8),
        7: tileMap.get(8 + 24, 0, 8, 8),
        8: tileMap.get(16 + 24, 0, 8, 8),
        9: tileMap.get(8 + 24, 8, 8, 8),
    };
    createCanvas(950, 950);
    background(51);
    room = new Room(roomTemplates.level1, 50, tiles);
}

function draw() {
    room.draw();
    // player.draw();
}

function arrayFromMap(img, size) {
    arr = [];
    for (let y = 0; y < size; y++) {
        v = [];
        for (let x = 0; x < size; y++) {
            v.push(+(red(img.get(x, y)) != 0));
        }
        str = "[" + v.join(",") + "],\n";
        arr.push(str);
    }
    console.log("[" + arr.join("") + "]");
}
