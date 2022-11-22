import Player from "../components/player.js"
import Crocs from "../components/crocs.js"


export default class PhysicsLive extends Phaser.Scene {

    background;       // oggetto relativo all'elemento "sfondo"
    player;           // oggetto relativo all'elemento "giocatore"
    floorHeight;      // Altezza del terreno (asse y) rispetto al riquadro di gioco

    constructor() {
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
        super("physics_live");
    }

    init() {
        console.log("physics_ex - Executing init()");
        // Definiamo l'altezza del terreno pari all'altezza del riquadro
        // di gioco, per posizionare il giocatore sul fondo della schermata.
        this.floorHeight = this.game.config.height - 30;
        this.worldWidth = 10000;
        this.lastCrocs = 0;
    }

    preload() {
        console.log("physics_ex- Executing preload()");
        this.load.image("bottiglia", "assets/images/environment_elements/bottiglia.png");
        this.load.image("fiamma", "assets/images/environment_elements/fiamma.png");
        this.load.image("platform", "assets/images/environment_elements/platform.png");
        this.load.image("crocs", "assets/images/weapons/crocs.png");
    }

    create() {
        // Qui le istruzioni su cosa creare e dove nel mondo di gioco
        console.log("physics_ex - Executing create()");

        // Sfondo
        this.background = this.add.tileSprite(0, 0, 1280, 720, "background_base");
        this.background.setOrigin(0, 0);
        this.background.setScrollFactor(0, 0);
  

        // Crea un piano sul quale fermare gli oggetti soggetti alla fisica (gravità)
        this.floor = this.add.rectangle(
            0, this.game.config.height,
            this.worldWidth, this.game.config.height - this.floorHeight,
            0xFFFFFF, 0);
        this.floor.setOrigin(0, 1);
        this.floor.setScrollFactor(0, 0);
        this.physics.add.existing(this.floor, true);

        // Player
        const thePlayer = new Player(this, 0, this.floorHeight, 10000);
        this.player = this.physics.add.existing(thePlayer);
        // il giocatore deve fermarsi sul pavimento...
        this.physics.add.collider(this.player, this.floor);

        // Imposta la camera per seguire i movimenti del giocatore lungo l'asse x
        this.cameras.main.startFollow(this.player);

        // UI
        this.createUI();

        // Inserisci delle piattaforme
        this.createStaticPlatforms();
        this.createMobilePlatforms();

        // Inserisci i funghetti (buoni e velenosi)
        this.insertOggetti();
    }

    createUI() {
        // Punteggio
        const styleConfig = { color: '#FFFFFF', fontSize: 36 };
        const scoreMessage = "Score: " + this.game.gameState.score;
        this.scoreBox = this.add.text(100, 0, scoreMessage, styleConfig);
        this.scoreBox.setOrigin(0, 0);
        this.scoreBox.setScrollFactor(0, 0);

        // Vite...
        const liveMessage = "Lives: " + this.game.gameState.lives;
        this.lifeBox = this.add.text(400, 0, liveMessage, styleConfig);
        this.lifeBox.setOrigin(0, 0);
        this.lifeBox.setScrollFactor(0, 0);

        // Tasto per lancio delle crocs
        this.keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    createStaticPlatforms() {
        this.staticPlatforms = this.physics.add.staticGroup({
            key: "platform",
            repeat: 7,
            setXY: {
                x: 800,
                y: this.floorHeight - this.player.displayHeight,
                stepX: 1000,
                stepY: 0
            }
        });

	// Il giocatore deve fermarmi sulle piattaforme statiche
        this.physics.add.collider(this.staticPlatforms, this.player, ()=> {
            // ...e in quel caso lo stato non sarà "jumping"
            this.player.isJumping = false;
        });
    }

    createMobilePlatforms() {
        this.mobilePlatforms = this.physics.add.group();
        this.mobilePlatforms.create(500, 400, "platform");
        this.mobilePlatforms.create(900, 400, "platform");
        this.mobilePlatforms.create(2000, 600, "platform");

        this.mobilePlatforms.children.iterate( function (platform) {
            // annulliamo l'effetto della gravità
            platform.body.allowGravity = false;
            // la piattaforma non si muove in caso di urti/collisioni
            platform.body.immovable = true;
            // impostiamo una velocità iniziale
            platform.body.setVelocityX(Phaser.Math.Between(-100, 100));
        });

	// Come per le piattaforme statiche...
        this.physics.add.collider(this.mobilePlatforms, this.player, ()=> {
            this.player.isJumping = false;
        });

    }

    insertOggetti() {
        // bottiglia di platica
        this.oggetti = [];
        for (let i = 0; i < 10; i++) {
            const bottiglia = this.add.image(500 + 500*i, 0,  "bottiglia");
            bottiglia.setOrigin(0, 1);
            this.oggetti.push(bottiglia);
        }
        // Creiamo il gruppo per la gestione della fisica
        this.oggettiGroup = this.physics.add.group(this.oggetti);
        // I funghetti devono fermarsi sul pavimento/fondo
        this.physics.add.collider(this.floor, this.oggettiGroup);
        // Se il giocatore si sovrappone al funghetto... aggiorniamo il punteggio...
        this.physics.add.overlap(this.player, this.oggettiGroup, this.updateScore, null, this);

        // Fiamme
        this.oggetti2 = this.physics.add.group({
            key: "fiamma",
            repeat: 6,
            setXY: {
                x: 750,
                y: 200,
                stepX: 500,
                stepY: 0
            }
        });

	// Facciamo rimbalzare le fiamme
        this.oggetti2.children.iterate( function (bottiglia) {
            bottiglia.setBounce(1,1);
        });

	// Un po' come sopra...
        this.physics.add.collider(this.oggetti2, this.floor);
        this.physics.add.overlap(this.player, this.oggetti2, this.updateLives, null, this);

        this.physics.add.collider(this.staticPlatforms, this.mushrooms);
        this.physics.add.collider(this.staticPlatforms, this.oggetti2);
    }

    update() {
        // Azioni che vengono eseguite a ogni frame del gioco
        this.player.manageMovements();
        this.animateBackground();
        this.manageCrocsLaunch();
        this.manageRandomMovementOfMobilePlatforms();
    }

    animateBackground() {
        this.background.tilePositionX = this.cameras.main.scrollX * 0.5;

        // Qui c'e' una modifica: per funzionare correttamente la camera,
        // Phaser non gradisce l'uso di this.player.y nel calcolo della
        // posizione della camera. Dobbiamo usare this.player.body.y che
        // però non è influenzato dal Pivot e quindi dobbiamo manualmente
        // sommare l'altezza del giocatore, ovvero al posto di this.player.y,
        // diventa this.player.body.y + this.player.height/2
        this.cameras.main.followOffset.y = this.player.body.y + this.player.height/2 - this.game.config.height / 2;
    }

    updateScore(player, bottiglia) {
        this.game.gameState.score += 10;
        this.scoreBox.setText("Score: " + this.game.gameState.score);
        bottiglia.destroy();
    }

    updateLives() {
        this.game.gameState.lives--;
        this.lifeBox.setText("Lives: " + this.game.gameState.lives);
        if (this.game.gameState.lives == 0) {
            this.scene.start("gameover");
        }
        this.player.die();
    }

    manageCrocsLaunch() {
        const minTimeBetweenLaunches = 500;
        const lastCrocsLaunchTime = this.time.now - this.lastCrocs;
	// Lanciamo la crocs se viene premuto "F" e se sono trascorsi almeno 500ms dall'ultimo lancio
        if (this.keyF.isDown && lastCrocsLaunchTime > minTimeBetweenLaunches) {
            // Aggiorniamo il tempo dell'ultimo lancio
            this.lastCrocs = this.time.now;
            // Creiamo l'oggetto crocs, specificando scena corrent, coordinate e orientamento del giocatore
            const crocs = new Crocs(this, this.player.x + 20, this.player.y - 60, this.player.flipX);
            // Aggiungiamo l'oggetto crocs alla fisica, specificando direttamente la gestione delle collisione
            // con un funghetto velenoso e la relativa azione
            this.physics.add.collider(crocs, this.oggetti2, this.destroyOggetti2, null, this);
            // Lanciamo la crocs
            crocs.fire();
        }
    }

    destroyOggetti2(crocs, bottiglia) {
        crocs.destroy();
        this.updateScore(this.player, bottiglia);
    }

    manageRandomMovementOfMobilePlatforms() {
    	// Ad ogni update, abbiamo una probabilità su 100 di cambiare velocità e/o direzione
    	// alle piattaforme mobili
        if (Phaser.Math.Between(0, 99) == 0) {
            this.mobilePlatforms.children.iterate( function (platform) {
                platform.body.setVelocityX(Phaser.Math.Between(-100, 100));
            })
        }
    }

}
