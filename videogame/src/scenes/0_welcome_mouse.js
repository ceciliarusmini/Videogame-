export default class SceneWelcomeMenu extends Phaser.Scene {

    background;        // oggetto relativo all'elemento "sfondo"

    constructor(){
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
		super("scene_welcome_menu");
    }

    init(){
        console.log("scene_welcome - Executing init()");
    }

    preload() {
        console.log("scene_welcome - Executing preload()");
        // Carichiamo gli asset grafici
        this.load.image("background_base", "assets/images/background/background.png");
        this.load.image("playButton", "assets/UI/play_button.png");
        // Carichiamo l'immagine del giocatore in formato spritesheet
        const player_spritesheet_config = {
            frameWidth:  20,
            frameHeight: 35,
        };
        this.load.spritesheet("playerrun", "assets/images/characters/playerrunandjump.png", player_spritesheet_config);

        /*
        // Carichiamo l'immagine del mostro/nemico in formato spritesheet
        const monster_spritesheet_config = {
            frameWidth:  72,
            frameHeight: 72,
        };
        this.load.spritesheet("monster", "assets/images/characters/enemy.png", monster_spritesheet_config);
        */
    }

    create() {
        console.log("scene_welcome - Executing create()");

        // Posizioniamo gli elementi nella scena
        this.background = this.add.image(0, 0, "background_base");
        this.background.setOrigin(0,0);

        //creo una immagine per il bottone. NB NON SEGUITE I TUTORIAL PER PHASER2, è stata completamente cambiata e non funzionano più
        this.playbutton = this.add.image(this.game.config.width/2, this.game.config.height/2, "playButton");
        this.playbutton.setOrigin(0.5, 0.5);
        this.playbutton.setInteractive(); //imposta l'immagine in modo che possa essere cliccata

        this.playbutton.on("pointerdown", ()=>{ //quando viene clickato il bottone succedono cose
            this.scene.start("physics_live");
        });
    }
};
