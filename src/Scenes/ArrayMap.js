class ArrayMap extends Phaser.Scene {
    constructor() {
        super("arrayMapScene");
        this.layer = null; 
        this.waterLayer = null;
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("smb_tiles", "mapPack_tilesheet.png");

        this.seed = Math.random();
        this.sampleScale = 10;
        noise.seed(this.seed);
    }

    create() {
        this.generateMap();

        this.regen = this.input.keyboard.addKey('R');
        this.shrinkWindow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.COMMA);
        this.growWindow = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.PERIOD);

        document.getElementById('description').innerHTML = 'Press R to randomize seed<br>Press "," or "." to increase/decrease the noise sampling window';
        document.getElementById('seed-value').innerHTML = `Seed: ${this.seed}`;
    }

    generateMap() {
        if (this.layer) {
            this.layer.destroy();
        }
        if (this.waterLayer) {
            this.waterLayer.destroy();
        }

        const level01 = [];
        const colSize = 20;
        const rowSize = 20;

        for (let y = 0; y < colSize; y++) {
            const row = [];
            for (let x = 0; x < rowSize; x++) {
                const noiseValue = noise.simplex2(x / this.sampleScale, y / this.sampleScale);
                const tile = noiseValue > 0 ? 23 : 186; // 23 = land, 186 = water
                row.push(tile);
            }
            level01.push(row);
        }

        for (let y = 0; y < colSize; y++) {
            for (let x = 0; x < rowSize; x++) {
                if (level01[y][x] === 23) {
                    let bitMask = this.gridCode(level01, y, x, 186);
                    level01[y][x] = this.applyTransitionTile(bitMask);
                }
            }
        }

        const map = this.make.tilemap({
            data: level01,
            tileWidth: 64,
            tileHeight: 64
        });

        const tilesheet = map.addTilesetImage("smb_tiles", null, 64, 64);
        
        // Water layed written with the help of ChatGPT
        const waterLevel = Array.from({ length: colSize }, () => Array(rowSize).fill(186));
        const waterMap = this.make.tilemap({
            data: waterLevel,
            tileWidth: 64,
            tileHeight: 64
        });
        this.waterLayer = waterMap.createLayer(0, tilesheet, 0, 0);
        this.waterLayer.setScale(0.5);

        this.layer = map.createLayer(0, tilesheet, 0, 0);
        this.layer.setScale(0.5);
    }

    gridCode(grid, y, x, targetTile) {
        let bit = 0;
        if (this.gridCheck(grid, y - 1, x, targetTile)) bit += 1 << 0; // North
        if (this.gridCheck(grid, y + 1, x, targetTile)) bit += 1 << 1; // South
        if (this.gridCheck(grid, y, x + 1, targetTile)) bit += 1 << 2; // East
        if (this.gridCheck(grid, y, x - 1, targetTile)) bit += 1 << 3; // West
        return bit;
    }

    gridCheck(grid, y, x, target) {
        return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length && grid[y][x] === target;
    }

    applyTransitionTile(bitMask) {
        const transitionTiles = {
            0: 23,  // 0000: No water around (normal land tile)
            1: 6,  // 0001: Water to the north
            2: 40,  // 0010: Water to the south
            3: 23,  // 0011: Water to the north and south
            4: 24,  // 0100: Water to the east
            5: 7,  // 0101: Water to the north and east
            6: 41,  // 0110: Water to the south and east
            7: 58,  // 0111: Water to the north, south, and east
            8: 22,  // 1000: Water to the west
            9: 5,  // 1001: Water to the north and west
            10: 39, // 1010: Water to the south and west
            11: 22, // 1011: Water to the north, south, and west
            12: 23, // 1100: Water to the east and west
            13: 6, // 1101: Water to the north, east, and west
            14: 40, // 1110: Water to the south, east, and west
            15: 23, // 1111: Water all around (fully surrounded by water)
        };
        return transitionTiles[bitMask] || 23;
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.regen)) {
            this.seed = Math.random();
            noise.seed(this.seed);
            this.generateMap();
            document.getElementById('seed-value').innerHTML = `Seed: ${this.seed}`;
        }

        if (Phaser.Input.Keyboard.JustDown(this.shrinkWindow)) {
            this.sampleScale = Math.max(1, this.sampleScale - 1);
            this.generateMap();
        }

        if (Phaser.Input.Keyboard.JustDown(this.growWindow)) {
            this.sampleScale += 1;
            this.generateMap();
        }
    }
}
