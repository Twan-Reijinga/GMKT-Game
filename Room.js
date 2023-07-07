class Room {
    constructor(roomPattern, tileSize) {
        this.pattern = roomPattern;
        this.keys = roomTemplates.keys;
        this.tileSize = tileSize;
        this.height = roomPattern.length;
        this.width = roomPattern[0].length;
    }

    draw() {}
}
