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

    getRequiredTile(x, y, map){
        if (y == map.length){
            
        }
    }

    draw() {
        noSmooth();
        for (let y = 0; y < this.map.length; y++){
            for (let x = 0; x < this.map[0].length; x++){

            }
        }
    }
}
