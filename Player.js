class Player {
    constructor(playerSprite, x, y, playerWidth, playerHeight, isHunter) {
        this.orientation = 0;
        this.sprite = playerSprite;
        this.pos = createVector(x, y);
        this.width = playerWidth;
        this.height = playerHeight;
        this.velocity = 5;
        this.health = 100;
        this.maxHealth = 100;

        this.isHunter = isHunter;
    }

    draw() {
        let rotations = [0, 90, 180, 270];
        noSmooth(); //behoudt pixel-style
        translate(this.pos.x + this.width / 2, this.pos.y + this.height / 2);
        rotate((PI / 180) * rotations[this.orientation]);
        image(
            this.sprite,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        rotate(-(PI / 180) * rotations[this.orientation]);
        translate(
            -(this.pos.x + this.width / 2),
            -(this.pos.y + this.height / 2)
        );
    }

    move(direction) {
        switch (direction) {
            case "up":
                this.pos.y -= this.velocity;
                this.orientation = 3;
                if (
                    this.isHunter ^ room.getTileFloor(this.pos.x, this.pos.y) || //isHunter XOR die andere om te flippen als ishunter 1 is en niks te doen als 0(laat player op boven lopen).
                    this.isHunter ^
                        room.getTileFloor(this.pos.x + this.width, this.pos.y)
                ) {
                    this.pos.y += this.velocity;
                    let updist = this.pos.y % tileSize; //updist/rightdist ect zorgd ervoor dat de player wel tegen een muur aan kan drukken (ik wil het wel uitleggen in een call)
                    this.pos.y -= updist - 1;
                }
                break;
            case "down":
                this.pos.y += this.velocity;
                this.orientation = 1;
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
                    let downdist =
                        tileSize - ((this.pos.y % tileSize) + this.height);
                    this.pos.y += downdist - 1;
                }
                break;
            case "left":
                this.pos.x -= this.velocity;
                this.orientation = 2;
                if (
                    this.isHunter ^ room.getTileFloor(this.pos.x, this.pos.y) ||
                    this.isHunter ^
                        room.getTileFloor(this.pos.x, this.pos.y + this.height)
                ) {
                    this.pos.x += this.velocity;
                    let leftdist = this.pos.x % tileSize;
                    this.pos.x -= leftdist - 1;
                }
                break;
            case "right":
                this.pos.x += this.velocity;
                this.orientation = 0;
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
                    let rightdist =
                        tileSize - ((this.pos.x % tileSize) + this.width);
                    this.pos.x += rightdist - 1;

                    print("ping", room.getTileFloor(this.pos.x, this.pos.y)); //vergeet niet dit weg te halen
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
