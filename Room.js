class Room {
    constructor(room, tileSize, tiles) {
        this.map = room.map;
        this.tileSize = tileSize;
        this.tiles = tiles;
    }

    getTileFloor(x, y) {
        tileX = Math.floor(x / this.tileSize);
        tileY = Math.floor(y / this.tileSize);
        return map[tileY][tileX];
    }

    getRequiredTile(x, y, map) {
        let val = 0;
        let right = false;
        let bottom = false;
        let corner = false;
        if (x == map[0].length - 1 || map[y][x] != map[y][x + 1]) right = true;
        if (y == map.length - 1 || map[y][x] != map[y + 1][x]) bottom = true;
        if (right || bottom || map[y][x] != map[y + 1][x + 1]) corner = true;
        if (corner && !right && !bottom) {
            val = 0;
        }
        if (right && bottom) {
            val = 1;
        } else if (!right && bottom) {
            val = 2;
        } else if (right && !bottom) {
            val = 3;
        } else {
            val = 4;
        }
        val = val + 5 * map[y][x];
        return val;
    }

    draw() {
        noSmooth();
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[0].length; x++) {
                let img = tiles[this.getRequiredTile(x, y, this.map)];
                image(
                    img,
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }
}
