export default class SceneGameOver extends Phaser.Scene {

    background;        // oggetto relativo all'elemento "sfondo"

    constructor(){
        // Il costruttore della classe base Phaser.Scene prende come argomento il nome della scena
		super("gameover");
    }

    create() {
        const styleConfig = { color: '#FFFFFF', fontSize: 36 };

        // Inserisci il testo con il punteggio corrente
        this.scoreBox = this.add.text(this.game.config.width/2, this.game.config.height/2, "GAME OVER", styleConfig);
        this.scoreBox.setOrigin(0.5, 0.5);

    }

};
