class Room {
    constructor(Room, tileSize, tiles) {
        this.map = Room[map];
        this.tileSize = tileSize;
        this.height = roomPattern.length;
        this.width = roomPattern[0].length;
        this.tiles = tiles;
    }

    getTileFloor(x, y){
        tileX = Math.floor(x / this.tileSize);
        tileY = Math.floor(y / this.tileSize);
        return map[tileY][tileX];
    }

    draw() {
        noSmooth();
        
    }
}
