export default class Player extends Phaser.GameObjects.Sprite {

    cursorKeys;
    keySpace;
    initialPosition;
    floorHeight;
    stepLength;       // lunghezza del passo
    isJumping;        // verifichiamo se l'animazione del giocatore è già in salto o no
    maxWidth;

    constructor(scene, x, y, maxWidth) {
        // Il costruttore della classe base Phaser.Scene prende come argomento la scena
		super(scene, x, y, "playerrun");
        scene.add.existing(this);
        this.initialPosition = x;
        this.floorHeight = y;
        this.setOrigin(0,1); // Punto pivot in basso a sinistra
        this.setScale(4.0);   // Scala le dimensioni del giocatore

        // Inizializziamo i valori di alcune proprietà
        this.isJumping = false; //di default il giocatore non sta saltando
        this.stepLength  = 20;
        this.maxWidth = maxWidth;

        // Recuperiamo i riferimenti (oggetti) ai tasti cursore
        this.cursorKeys = scene.input.keyboard.createCursorKeys();

        // Recuperiamo il riferimento al tasto SPAZIO
        this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.initAnimations();
    }

    initAnimations() {
        //creiamo l'animazione della corsa del personaggio tramite lo spritesheet
        this.anims.create({
            key: "playerMove",
            frames: this.anims.generateFrameNumbers("playerrun", {
                start: 0, //iniziamo dal primo frame
                end: 9, //e i primi 10 frame (fino alla fine della corsa)
            }),
            frameRate: 10, //aggiornimao l'immagine ogni 15 frame per rendere l'animazione non troppo rapida
            repeat: -1 //ripetiamo all'infinito la stessa animazione
        });

        //creiamo l'animazione del personaggio che sta fermo
        this.anims.create({
            key: "playerStop",
            frames: this.anims.generateFrameNumbers("playerrun", {
                start: 4, //prendiamo un frame in cui il personaggio è fermo in una posizione ragionevole
                end: 4, //e riusiamo lo stesso frame, questo vuol dire che non verrà cambiata l'immagine
            }),
            frameRate: 15, //aggiornimao l'immagine ogni 15 frame per rendere l'animazione non troppo rapida
            repeat: -1 //ripetiamo all'infinito la stessa animazione
        });

        //creiamo l'animazione del salto del personaggio tramite lo spritesheet
        this.anims.create({
            key: "playerJump",
            frames: this.anims.generateFrameNumbers("playerrun", {
                start: 10, //iniziamo dal primo frame
                end: 17, //e i primi 10 frame (fino alla fine della corsa)
            }),
            frameRate: 15, //aggiornimao l'immagine ogni 15 frame per rendere l'animazione non troppo rapida
            repeat: -1
        });

        this.anims.play("playerStop"); //facciamo partire l'animazione del personaggio, questa volta fermo
    }

    manageAnimations() {
        // Gestiamo separatamente le animazioni

        const curr_anim = this.anims.currentAnim.key;   // Otteniamo il nome dell'animazione corrente

        if (this.body.velocity.y != 0) {
            // Se mi sto muovendo verticalmente, l'animazione
            // è sempre playerJump
            if (curr_anim != "playerJump") {
                this.anims.play("playerJump");
            }
        } else if (this.body.velocity.x != 0) {
            // Se invece non mi muovo verticalmente, ma mi muovo
            // orizzontalmente, eseguirò l'animazione di Move
            if (curr_anim != "playerMove") {
                this.anims.play("playerMove");
            }
            // e configurerò il flip corretto.
            this.flipX = this.body.velocity.x < 0;
        } else {
            // Per finire, se il giocatore è fermo sia sulla x che sulla y
            // possiamo fermarlo
            this.anims.play("playerStop");
        }
    }

    manageMovements() {
        // E' stato premuto il tasto freccia sinistra e il giocatore è a destra del limite sinistro del quadro?
        if (this.cursorKeys.left.isDown && this.x >= 0) {
            this.body.setVelocityX(-200);// Velocità per spostamento verso sinistra
        // E' stato premuto il tasto freccia destra e il giocatore è a sinistra del limite sinistro del quadro?
        } else if (this.cursorKeys.right.isDown && this.x <= this.maxWidth - this.displayWidth){
            this.body.setVelocityX(200); // Velocità per spostamento verso destra
        } else {
            // In questa condizione non è stato premuto alcun tasto e possiamo fermare il giocatore
            // rispetto alla X
            this.body.setVelocityX(0); 
        }

        if (this.keySpace.isDown && this.y >= this.displayHeight) {
            if (!this.isJumping) {
                this.isJumping = true;
                this.body.setVelocityY(-300);  // Salto (caso con l'introduzione della fisica)
            }
        }

        // Se il giocatore non sta premendo la barra spaziatrice e il personaggio è con
        // i piedi per terra, non c'è salto oppure è stato già gestito...
        if (this.keySpace.isUp && this.y >= this.floorHeight) {
            this.isJumping = false;
        }

        // Gestiamo le animazioni separatamente
        this.manageAnimations();

        /*
        *** Con l'introduzione della fisica, questo codice può essere rimosso ***
        // Effetto gravità: se il personaggio sta fluttuando, riportiamolo a terra frame dopo frame
        if (!this.keySpace.isDown && this.y < this.floorHeight) {
            this.y += this.gravityPull;
        }
        */
    }

    die() {
        // Nel nostro caso la morte del giocatore consiste nel reset alla posizione iniziale
        // del livello
        this.x = this.initialPosition;
    }

}