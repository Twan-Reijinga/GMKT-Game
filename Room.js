class Room {
    constructor(room, tileSize, tiles) {
        this.map = room.map;
        this.tileSize = tileSize;
        this.tiles = tiles;

        this.bridges = room.bridges;
    }

    interact(x, y, isHunter) {
        let tileX = Math.floor(x / this.tileSize);
        let tileY = Math.floor(y / this.tileSize);
        for (x = -1; x < 2; x++) {
            for (y = -1; y < 2; y++) {
                for (let i = 0; i < this.bridges.length; i++) {
                    if (
                        this.bridges[i][0] == tileX + x &&
                        this.bridges[i][1] == tileY + y &&
                        (x != 0 || y != 0)
                    ) {
                        console.log("ye");
                        this.map[tileY + y][tileX + x] = isHunter;
                    }
                }
            }
        }
    }

    getTileFloor(x, y) {
        if (
            x < 0 ||
            y < 0 ||
            x >= this.map.length * this.tileSize ||
            y >= this.map.length * this.tileSize //checkt of x of y buiten de map komt (al die andere onhandigheid is nu onnodig)
        ) {
            return -1;
        }

        let tileX = Math.floor(x / this.tileSize);
        let tileY = Math.floor(y / this.tileSize);
        return this.map[tileY][tileX];
    }

    isBridge(x, y) {
        for (let i = 0; i < this.bridges.length; i++) {
            if (this.bridges[i][0] == x && this.bridges[i][1] == y) {
                return true;
            }
        }
        return false;
    }

    getRequiredTile(x, y, map) {
        let val = 0;
        let left = false;
        let top = false;
        let corner = false;

        if (x == 0 || map[y][x] != map[y][x - 1]) left = true;
        if (y == 0 || map[y][x] != map[y - 1][x]) top = true;
        if (left || top || map[y][x] != map[y - 1][x - 1]) corner = true;

        if (corner && !left && !top) {
            val = 0;
        } else if (left && top) {
            val = 1;
        } else if (!left && top) {
            val = 2;
        } else if (left && !top) {
            val = 3;
        } else {
            val = 4;
        }
        val = val + 5 * (map[y][x] == 1) + 10 * this.isBridge(x, y);
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
