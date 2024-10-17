class RandomMap extends Phaser.Scene {
    constructor() {
        super("randomMapScene")
    }

    create() {
        // constants
        const numSMBtiles = 40

        // randomize border tiles
        let b1 = this.getRandomInt(numSMBtiles)
        let b2 = this.getRandomInt(numSMBtiles)
        let b3 = this.getRandomInt(numSMBtiles)
        let b4 = this.getRandomInt(numSMBtiles)
        // sky tiles
        let s1 = this.getRandomInt(10)
        let s2 = this.getRandomInt(10)
        // and other tiles
        let t1 = this.getRandomInt(numSMBtiles)
        let t2 = this.getRandomInt(numSMBtiles)
        let t3 = this.getRandomInt(numSMBtiles)
        let t4 = this.getRandomInt(numSMBtiles)
        let t5 = this.getRandomInt(numSMBtiles)
        let t6 = this.getRandomInt(numSMBtiles)
        let t7 = this.getRandomInt(numSMBtiles)
        let t8 = this.getRandomInt(numSMBtiles)
        
        // create a 2D array of tile indices
        const rndlvl = [
            [ b1, b1, b1, b1, b1, b1, b1, b1, b1, b1, b2, b2, b2, b2, b2, b2, b2, b2, b2, b2 ],
            [ b1,  0,  0,  0,  0,  0,  0,  0,  0, b1, b2, s2, s2, t3, s2, s2, t3, s2, s2, b2 ],
            [ b1,  0,  0,  0,  0,  0,  0,  0,  0, b1, b2,  0,  0, t3,  0,  0, t3,  0,  0, b2 ],
            [ b1,  0,  0,  0,  0,  0,  0,  0,  0, b1, b2,  0,  0, t3,  0,  0, t3,  0,  0, b2 ],
            [ b1,  0,  0,  0, t5, t5,  0,  0,  0, b1, b2,  0,  0, t3,  0,  0, t4,  0,  0, b2 ],
            [ b1,  0,  0,  0, t5, t5,  0,  0,  0, b1, b2,  0,  0, t4,  0,  0,  0,  0,  0, b2 ],
            [ b1,  0,  0,  0,  0,  0,  0,  0,  0, b1, b2,  0,  0,  0,  0,  0,  0,  0,  0, b2 ],
            [ b1,  0,  0,  0,  0,  0,  0,  0,  0, b1, b2,  0,  0,  0,  0,  0,  0,  0,  0, b2 ],
            [ b1,  0,  0,  0,  0,  0,  0,  0,  0, b1, b2,  0,  0, t6,  0,  0, t6,  0,  0, b2 ],
            [ b1, b1, b1, b1, b1, b1, b1, b1, b1, b1, b2, b2, b2, b2, b2, b2, b2, b2, b2, b2 ],
            [ b3, b3, b3, b3, b3, b3, b3, b3, b3, b3, b4, b4, b4, b4, b4, b4, b4, b4, b4, b4 ],
            [ b3, s1, s1, s1, s1, s1, s1, s1, s1, b3, b4, t8, t8, t8, t8, t8, t8, t8, t8, b4 ],
            [ b3, s1, s1, s1, s1, s1, s1, s1, s1, b3, b4, t4, t4, t4, t4, t4, t4, t4, t4, b4 ],
            [ b3, s1, s1, s1, s1, s1, s1, s1, s1, b3, b4, t4, t4, t4, t4, t4, t4, t4, t4, b4 ],
            [ b3, s1, s1, s1, t1, t1, s1, s1, s1, b3, b4, t4, t4, t4, t4, t4, t4, t4, t4, b4 ],
            [ b3, s1, s1, s1, t2, t2, s1, s1, s1, b3, b4, t4, t4, t4, t4, t4, t4, t4, t4, b4 ],
            [ b3, s1, s1, s1, t2, t2, s1, s1, s1, b3, b4, t4, t4, t4, t7, t7, t4, t4, t4, b4 ],
            [ b3, s1, s1, s1, t2, t2, s1, s1, s1, b3, b4, t4, t4, t4, t7, t7, t4, t4, t4, b4 ],
            [ b3, s1, s1, s1, t2, t2, s1, s1, s1, b3, b4, t4, t4, t7, t7, t7, t7, t4, t4, b4 ],
            [ b3, b3, b3, b3, b3, b3, b3, b3, b3, b3, b4, b4, b4, b4, b4, b4, b4, b4, b4, b4 ]
        ]

        // make tilemap (array data + tilesheet images)
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html#tilemap
        const map = this.make.tilemap({
            data: rndlvl,      // load direct from array
            tileWidth: 16,
            tileHeight: 16
        })
        // add tileset to tilemap
        // addTilesetImage(tilesetName [, key] [, tileWidth] [, tileHeight] [, tileMargin] [, tileSpacing] [, gid])
        const tilesheet = map.addTilesetImage("smb_tiles")
        // create a layer in the tilemap
        // createLayer(layerID, tileset [, x] [, y])
        const layer = map.createLayer(0, tilesheet, 0, 0)

        // create scene switcher / reload keys
        this.swap = this.input.keyboard.addKey('S')
        this.reload = this.input.keyboard.addKey('R')

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>RandomMap.js</h2><br>S: Next Scene<br>R: Restart Scene (to randomize tiles)'
    }

    update() {
        // scene switching / restart
        if(Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.restart()
        }
        if(Phaser.Input.Keyboard.JustDown(this.swap)) {
            this.scene.start("arrayMapScene")
        }
    }

    // generate a random number between 0 and max
    getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    
}