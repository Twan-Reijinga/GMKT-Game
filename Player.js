class Player {
    constructor(playerSprite, x, y, playerWidth, playerHeight, isHunter) {
        this.sprite = playerSprite;
        this.pos = createVector(x, y);
        this.width = playerWidth;
        this.height = playerHeight;
        this.velocity = 2.5;
        this.health = 100;
        this.maxHealth = 100;

        this.isHunter = isHunter;
    }

    draw() {
        noSmooth(); //behoudt pixel-style
        image(this.sprite, this.pos.x, this.pos.y, this.width, this.height);
    }

    move(direction) {
        switch (direction) {
            case "up":
                this.pos.y -= this.velocity;
                if (
                    this.isHunter ^ room.getTileFloor(this.pos.x, this.pos.y) || //isHunter XOR die andere om te flippen als ishunter 1 is en niks te doen als 0(laat player op boven lopen).
                    this.isHunter ^
                        room.getTileFloor(this.pos.x + this.width, this.pos.y)
                ) {
                    this.pos.y += this.velocity;
                }
                break;
            case "down":
                this.pos.y += this.velocity;
                if (
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x,
                            this.pos.y + this.height
                        ) ||
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x + this.width,
                            this.pos.y + this.height
                        )
                ) {
                    this.pos.y -= this.velocity;
                }
                break;
            case "left":
                this.pos.x -= this.velocity;
                if (
                    this.isHunter ^ room.getTileFloor(this.pos.x, this.pos.y) ||
                    this.isHunter ^
                        room.getTileFloor(this.pos.x, this.pos.y + this.height)
                ) {
                    this.pos.x += this.velocity;
                }
                break;
            case "right":
                this.pos.x += this.velocity;
                if (
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x + this.width,
                            this.pos.y
                        ) ||
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x + this.width,
                            this.pos.y + this.height
                        )
                ) {
                    this.pos.x -= this.velocity;
                    print("ping", room.getTileFloor(this.pos.x, this.pos.y));
                }
                break;
            default:
                console.error("test");
        }
    }

    setHealth(health) {
        this.health = health;
    }

    heal(amount) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    takeDamage(damage) {
        //takes damage and returns 1 if the player is killed and 0 if nothing happens
        this.health -= damage;
        if (this.health <= 0) {
            this.health = 0;
            return 1;
        }
        return 0;
    }
}
