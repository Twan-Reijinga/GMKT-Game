class Room {
    constructor(roomPattern, tileSize, tiles) {
        this.pattern = roomPattern;
        this.keys = roomTemplates.keys;
        this.tileSize = tileSize;
        this.height = roomPattern.length;
        this.width = roomPattern[0].length;

        this.tiles = tiles;
    }
    draw() {
        noSmooth();
        for (let i = 0; i < this.pattern.length; i++) {
            for (let j = 0; j < this.pattern[0].length; j++) {
                image(
                    this.tiles[this.pattern[i][j]],
                    j * this.tileSize,
                    i * this.tileSize,
                    this.tileSize,
                    this.tileSize
                );
            }
        }
    }
}
