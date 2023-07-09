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
        this.captureDistance = tileSize * 1.5;
        this.isHunter = isHunter;
        this.isSwapping = false;
        this.swapRotationCenter;

        this.cooldownlength = 60;
        this.cooldown = 0;
    }

    draw(offset) {
        if (this.isHunter) {
            this.drawCaptureRadius(offset);
        } else {
            room.detectWin(this);
        }
        if (this.cooldown > 0) this.cooldown -= 1;
        else this.cooldown = 0;

        let rotations = [0, 90, 180, 270];
        noSmooth(); //behoudt pixel-style
        let Xtranslate = this.pos.x + this.width / 2 + offset.x;
        let Ytranslate = this.pos.y + this.height / 2 + offset.y;
        translate(Xtranslate, Ytranslate);
        rotate((PI / 180) * rotations[this.orientation]); //rotations
        image(
            this.sprite,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        rotate(-(PI / 180) * rotations[this.orientation]);
        let pos = this.getCenterPos();
        translate(-Xtranslate, -Ytranslate);

        if (this.isSwapping) {
            // translate(mapOffset.x - width / 2, mapOffset.y - height / 2);
            let centerPos = this.getCenterPos();
            noFill();
            stroke(255, 0, 0);
            strokeWeight(this.width);
            circle(
                this.swapRotationCenter.x + mapOffset.x,
                this.swapRotationCenter.y + mapOffset.y,
                dist(
                    centerPos.x,
                    centerPos.y,
                    this.swapRotationCenter.x,
                    this.swapRotationCenter.y
                ) * 2
            );
            this.isSwapping = false;
            // let radius = dist(
            //     centerPos.x,
            //     centerPos.y,
            //     this.swapRotationCenter.x,
            //     this.swapRotationCenter.y
            // );
            // let angle = 0;
            // let x = sin(angle) * radius + this.swapRotationCenter.x;
            // let y = cos(angle) * radius + this.swapRotationCenter.y;
            // console.log(
            //     dist(x, y, this.swapRotationCenter.x, this.swapRotationCenter.y)
            // );
            // translate(-mapOffset.x, -mapOffset.y);
            // this.isSwapping = false;
        }
    }

    drawCaptureRadius(offset) {
        noStroke();
        fill(0, 0, 0, 20);
        circle(
            this.pos.x + this.width / 2 + offset.x,
            this.pos.y + this.height / 2 + offset.y,
            this.captureDistance * 2
        );
    }

    move(direction) {
        switch (direction) {
            case "up":
                this.pos.y -= this.velocity;
                this.orientation = 3;
                if (
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x,
                            this.pos.y,
                            this.isHunter
                        ) || //isHunter XOR die andere om te flippen als ishunter 1 is en niks te doen als 0(laat player op boven lopen).
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x + this.width,
                            this.pos.y,
                            this.isHunter
                        )
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
                            this.pos.y + this.height,
                            this.isHunter
                        ) ||
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x + this.width,
                            this.pos.y + this.height,
                            this.isHunter
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
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x,
                            this.pos.y,
                            this.isHunter
                        ) ||
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x,
                            this.pos.y + this.height,
                            this.isHunter
                        )
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
                            this.pos.y,
                            this.isHunter
                        ) ||
                    this.isHunter ^
                        room.getTileFloor(
                            this.pos.x + this.width,
                            this.pos.y + this.height,
                            this.isHunter
                        )
                ) {
                    this.pos.x -= this.velocity;
                    let rightdist =
                        tileSize - ((this.pos.x % tileSize) + this.width);
                    this.pos.x += rightdist - 1;
                }
                break;
            default:
                console.error("how are you moving my guy?");
        }
    }

    getCenterPos() {
        return createVector(
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    }

    interact(otherPlayer) {
        let otherPlayerPos = otherPlayer.getCenterPos();
        let pos = this.getCenterPos();
        let distance = dist(pos.x, pos.y, otherPlayerPos.x, otherPlayerPos.y);

        if (
            this.isHunter &&
            distance <= this.captureDistance &&
            this.cooldown == 0
        ) {
            console.log("captured!");
            this.reverseRoles(this, otherPlayer);
        } else {
            room.interact(this);
        }
    }

    reverseRoles(hunter, runner) {
        let soundPlayed = Math.floor(Math.random() * swapSounds.length);
        swapSounds[soundPlayed].play();
        swapSounds[soundPlayed].setVolume(0.125);

        let hunterPos = hunter.getCenterPos();
        let runnerPos = runner.getCenterPos();
        hunter.swapRotationCenter = createVector(
            hunterPos.x + (runnerPos.x - hunterPos.x) / 2,
            hunterPos.y + (runnerPos.y - hunterPos.y) / 2
        );
        runner.swapRotationCenter = hunter.swapRotationCenter;
        hunter.swapTargetPos = runner.pos;
        runner.swapTargetPos = hunter.pos;
        hunterPos = hunter.pos;
        runnerPos = runner.pos;
        hunter.pos = runnerPos;
        runner.pos = hunterPos;

        runner.cooldown = runner.cooldownlength;
        hunter.isHunter = false;
        runner.isHunter = true;
        hunter.isSwapping = false;
        runner.isSwapping = false;
        room.deactivateSwitch();
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
