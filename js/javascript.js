class Escena extends Phaser.Scene { //Pajaro con físicas y animación

	constructor(){
		super('init');
	}
    preload() {
        this.load.image('fondo','../img/valle.png');
		this.load.spritesheet('pajaro', '../img/birdie.png', {frameWidth: 50, frameHeight: 50});
	    this.load.image('tuberia', '../img/finger.png')
	}

	create() {
       this.add.sprite(600, 397, 'fondo');
		
	   this.player = this.physics.add.sprite(50, 100, 'pajaro');

		this.anims.create({
			key: 'volar',
			frames: this.anims.generateFrameNumbers('pajaro', {start: 0, end: 1}),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({ // Animación al saltar
			key: 'saltar',
			frames: this.anims.generateFrameNumbers('heroe', {start: 2, end: 2}),
			frameRate: 7,
			repeat: 1,
		});

		this.player.play('volar'); //Saltar Con Espacio

		this.input.keyboard.on('keydown', (event) => {
			if (event.keyCode === 32) {
				this.saltar();
			}
		});

		this.input.on('pointerdown', () => this.saltar());//Saltar con clik
	
		this.player.on('animationcomplete', this.animationComplete, this); //Seguir volando
        this.nuevaColumna();

		this.physics.world.on('worldbounds', (body) => {// detectar cuando el pajaro cae de la pantalla
			this.scene.start('finScene');
		});
	
		this.player.setCollideWorldBounds(true);
		this.player.body.onWorldBounds = true;
	}


	nuevaColumna() { //Tuberias
		//Una columna es un grupo de cubos
		const columna = this.physics.add.group();
		//Cada columna tendrá un hueco (zona en la que no hay cubos) por dónde pasará el super héroe
		const hueco = Math.floor(Math.random() * 5) + 1;
		for (let i = 0; i < 8; i++) {
			//El hueco estará compuesto por dos posiciones en las que no hay cubos, por eso ponemos hueco +1
			if (i !== hueco && i !== hueco + 1 && i !== hueco - 1) {
				const cubo = columna.create(960, i * 100, 'tuberia');
				cubo.body.allowGravity = false;
			}
		}
		columna.setVelocityX(-200);
		//Detectaremos cuando las columnas salen de la pantalla...
		columna.checkWorldBounds = true;
		//... y con la siguiente línea las eliminaremos
		columna.outOfBoundsKill = true;
		//Cada 1000 milisegundos llamaremos de nuevo a esta función para que genere una nueva columna
		this.time.delayedCall(1000, this.nuevaColumna, [], this);
		this.physics.add.overlap(this.player, columna, this.hitColumna, null, this);//Colision con tuberias
	
	}

	hitColumna() {
		
		this.scene.start('finScene');
	}

	animationComplete(animation, frame, sprite) {
		if (animation.key === 'saltar') {
			this.player.play('volar');
		}
	}

	saltar() {
		this.player.setVelocityY(-200);
		this.player.play('saltar');
	}
}


class EscenaFin extends Phaser.Scene {
	constructor(){
		super('finScene');
	}

	preload(){
		this.load.image('fondofinal', '../img/fin.jpg');
	}

	create(){
		this.add.sprite(400, 320, 'fondofinal');

		this.input.on('pointerdown', () => this.volverAJugar()) //volver al juego   
	}

	volverAJugar(){
		this.scene.start('init');
	}
}

const config = {
	type: Phaser.Auto,
	width: 960,
	height: 640,
	scene: [Escena,EscenaFin],
	scale: {
		mode: Phaser.scale.FIT
	},
	physics: {
		default:'arcade',
		arcade: {
			debug: true,
			gravity: {
				y: 300,
			},
		},
	},
};

new Phaser.Game(config);


