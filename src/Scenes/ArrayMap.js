class ArrayMap extends Phaser.Scene {
    constructor() {
        super("arrayMapScene")
    }

    preload() {
        // get assets
        this.load.path = "./assets/"
        this.load.image("smb_tiles", "smb_tiles_simple.png")
        this.load.image("1bit_tiles_mono", "monochrome_packed.png")
    }

    create() {
        // create a 2D array of tile indices
        const level01 = [
            [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15 ],
            [ 39,  0,  0,  0,  0,  0,  0,  0,  0, 39, 15,  0,  0, 16,  0,  0, 12,  0,  0, 15 ],
            [ 39,  0,  0,  0,  0,  0,  0,  0,  0, 39, 15,  0,  0, 16,  0,  0, 12,  0,  0, 15 ],
            [ 39,  0,  0,  0,  0,  0,  0,  0,  0, 39, 15,  0,  0, 16,  0,  0, 12,  0,  0, 15 ],
            [ 39,  0,  0,  0, 15, 15,  0,  0,  0, 39, 15,  0,  0, 16,  0,  0, 13,  0,  0, 15 ],
            [ 39,  0,  0,  0, 15, 15,  0,  0,  0, 39, 15,  0,  0, 13,  0,  0,  0,  0,  0, 15 ],
            [ 39,  0,  0,  0,  0,  0,  0,  0,  0, 39, 15,  0,  0,  0,  0,  0,  0,  0,  0, 15 ],
            [ 39,  0,  0,  0,  0,  0,  0,  0,  0, 39, 15,  0,  0,  0,  0,  0,  0,  0,  0, 15 ],
            [ 39,  0,  0,  0,  0,  0,  0,  0,  0, 39, 15,  0,  0,  4,  0,  0,  4,  0,  0, 15 ],
            [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15 ],
            [ 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ],
            [ 15,  0,  0,  0,  0,  0,  0,  0,  0, 15, 39, 32, 32, 32, 32, 32, 32, 32, 32, 39 ],
            [ 15,  0,  0,  0,  0,  0,  0,  0,  0, 15, 39, 38, 38, 38, 38, 38, 38, 38, 38, 39 ],
            [ 15,  0,  0,  0,  0,  0,  0,  0,  0, 15, 39, 38, 38, 38, 38, 38, 38, 38, 38, 39 ],
            [ 15,  0,  0,  0, 20, 21,  0,  0,  0, 15, 39, 38, 38, 38, 38, 38, 38, 38, 38, 39 ],
            [ 15,  0,  0,  0, 26, 27,  0,  0,  0, 15, 39, 38, 38, 38, 38, 38, 38, 38, 38, 39 ],
            [ 15,  0,  0,  0, 26, 27,  0,  0,  0, 15, 39, 38, 38, 38, 24, 22, 38, 38, 38, 39 ],
            [ 15,  0,  0,  0, 26, 27,  0,  0,  0, 15, 39, 38, 38, 38, 14, 14, 38, 38, 38, 39 ],
            [ 15,  0,  0,  0, 26, 27,  0,  0,  0, 15, 39, 38, 38, 14, 14, 14, 14, 38, 38, 39 ],
            [ 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
        ]

        // make tilemap (array data + tilesheet image)
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectCreator.html#tilemap
        const map = this.make.tilemap({
            data: level01,      // load direct from array
            tileWidth: 16,
            tileHeight: 16
        })
        // add tileset to tilemap
        // addTilesetImage(tilesetName [, key] [, tileWidth] [, tileHeight] [, tileMargin] [, tileSpacing] [, gid])
        // try changing the tilesheet key in the next line to see another tileset uses the same indices
        const tilesheet = map.addTilesetImage("smb_tiles")
        
        // create layer in tilemap
        // createLayer(layerID, tileset [, x] [, y])
        const layer = map.createLayer(0, tilesheet, 0, 0)

        // enable scene switcher / reload keys
        this.swap = this.input.keyboard.addKey('S')

        // update instruction text
        document.getElementById('description').innerHTML = '<h2>ArrayMap.js</h2><br>S: Next Scene'
    }

    update() {
        // scene switching
        if(Phaser.Input.Keyboard.JustDown(this.swap)) {
            this.scene.start("randomMapScene")
        }
    }
}