class Room {
    constructor(roomPattern, tileSize) {
        this.pattern = roomPattern;
        this.keys = roomTemplates.keys;
        this.tileSize = tileSize;
        this.height = roomPattern.length;
        this.width = roomPattern[0].length;
        this.loadImages();
    }

    loadImages() {
        this.images = [];
        for (let i = 0; i < this.keys.length; i++) {
            this.images.push(loadImage("textures/" + this.keys[i].src));
        }
    }

    draw() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                image(this.images[0], 0, 0);
            }
        }
    }
}
