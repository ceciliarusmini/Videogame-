export default class Crocs extends Phaser.GameObjects.Sprite {

    //floorHeight;
    goingRight;
    initialX;
    //stepLength;
    movementSemiLength;

    constructor(scene, x, y, goingRight) {
        // Il costruttore della classe base Phaser.Scene prende come argomento la scena
		super(scene, x, y, "crocs");
        scene.add.existing(this);
        this.initialX = x;
        this.goingRight = goingRight;
        //this.stepLength = stepLength;
        this.floorHeight = y;
        this.setScale(1);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }

    fire() {
        if (this.goingRight) {
            this.body.setVelocityX(-500);
        } else {
            this.body.setVelocityX(500);
        }
    }

}