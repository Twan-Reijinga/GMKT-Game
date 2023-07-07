class Player {
    constructor(playerSprite, x, y, playerWidth, playerHeight) {
        this.sprite = playerSprite;
        this.pos = createVector(x, y);
        this.width = playerWidth;
        this.height = playerHeight;
        this.velocity = 1;
        this.health = 100;
        this.maxHealth = 100;
    }

    draw() {
        image(this.sprite, this.pos.x, this.pos.y, this.width, this.height);
    }

    move(direction) {
        switch (direction) {
            case "up":
                this.pos.y -= this.velocity;
                break;
            case "down":
                this.pos.y += this.velocity;
                break;
            case "left":
                this.pos.x -= this.velocity;
                break;
            case "right":
                this.pos.x += this.velocity;
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
