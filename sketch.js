let room;

function setup() {
    createCanvas(400, 400);
    room = new Room(roomTemplates.level1, 20);
}

function draw() {
    room.draw();
}
