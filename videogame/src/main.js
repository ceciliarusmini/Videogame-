// Importiamo le scene (ne usiamo una diversa per ogni esempio)
import SceneWelcomeMenu from "./scenes/0_welcome_mouse.js"
import PhysicsLive from "./scenes/7_physics_live.js";
import SceneGameOver from "./scenes/G_gameover.js";

// Definiamo la configurazione di lancio del gioco
const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: 0x000000, // sfondo nero
    scene: [ SceneWelcomeMenu, PhysicsLive, SceneGameOver ],
    pixelArt: true,
    parent: "game_area", // Specifica il div contenitore
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 200,
            },
            debug: false
        }
    }
};



//creiamo il gioco a partire dalla configurazione iniziale
let game = new Phaser.Game(config);

game.gameState = {
    playTime: 30,
    score: 0,
    lives: 3
}

// Carichiamo la scena corrispondente all'esercizio scelto
// (se non eseguiamo questa istruzione viene creata una
// scena a partire dalla prima specificata nell'array "scene"
// della configurazione di gioco)
//game.scene.start("scene_platforms");

