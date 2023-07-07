class Player{
    constructor(pos){
        this.pos = pos;
        this.velocity = 1;
        this.health = 100;
        this.maxHealth = 100;
    }

    SetHealth(health) {
        this.health = health;
    }

    Heal(amount){
        this.health += amount;
        if (this.health < this.maxHealth){
            this.health = this.maxHealth;
        }
    }

    TakeDamage(damage) {
        //takes damage and returns 1 if the player is killed and 0 if nothing happens
        this.health -= damage;
        if (this.health <= 0){
            this.health = 0;
            return 1;
        }
        return 0;
    }

}