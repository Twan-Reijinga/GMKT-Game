class Room {
    constructor(roomTemplate, tileSize) {
        this.pattern = Json.parse(roomTemplate).pattern;
        this.tileSize = tileSize;
        this.height = pattern.length;
        this.width = pattern[0].length;
    }

    draw() {}
}
