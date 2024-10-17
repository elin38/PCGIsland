class ArrayMap extends Phaser.Scene {
    constructor() {
        super("arrayMapScene");
        this.layer = null; 
        this.waterLayer = null;
        this.villageNames = [
            "Willowdale",
            "Oakwood",
            "Stonehaven",
            "Briarwood",
            "Maple Grove",
            "Thistledown",
            "Ashford",
            "Fernridge",
            "Hollowbrook",
            "Redstone",
            "Silverpine",
            "Nightshade Hollow",
            "Frostvale",
            "Misty Hollow",
            "Emberwood",
            "Duskwood",
            "Thornefield",
            "Sunhaven",
            "Crestwood",
            "Meadowlark"
        ];
        this.oceanNames = [
            "Sapphire Sea",
            "Azure Abyss",
            "Whispering Waters",
            "Stormy Deep",
            "Celestial Cove",
            "Tidal Vale",
            "Midnight Bay",
            "Coral Expanse",
            "Crystal Ocean",
            "Tempest Tide",
            "Serpent's Sea",
            "Echoing Waters",
            "Sunlit Depths",
            "Phantom Gulf",
            "Silver Currents",
            "Triton's Reach",
            "Mermaid's Lagoon",
            "Thalassic Abyss",
            "Ocean's 11",
            "Pearl Bay"
        ];
        this.maxNames = 8;
        this.namesPlaced = 0; 
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
        this.placeNames();

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
                let tile;
                if (noiseValue > 0.5) {
                    tile = 23;  // Land
                } else if (noiseValue > 0) {
                    tile = 18;  // Sand
                } else {
                    tile = 186; // Water
                }
                row.push(tile);
            }
            level01.push(row);
        }
    
        for (let y = 0; y < colSize; y++) {
            for (let x = 0; x < rowSize; x++) {
                if (level01[y][x] === 23) {  // Land
                    let bitMask = this.gridCode(level01, y, x, 18);
                    level01[y][x] = this.applyTransitionTile(bitMask);
                }
            }
        }
    
        for (let y = 0; y < colSize; y++) {
            for (let x = 0; x < rowSize; x++) {
                if (level01[y][x] === 18) {  // Sand
                    let bitMask = this.gridCode(level01, y, x, 186);
                    level01[y][x] = this.applySandToWaterTransitionTile(bitMask);
                }
            }
        }
    
        const transitionTiles = [
            23, 6, 40, 24, 7, 41, 58, 22, 5, 39 
        ];
    
        // written with the help of chatGPT
        const waterLevel = Array.from({ length: colSize }, (_, y) =>
            level01[y].map(tile => transitionTiles.includes(tile) ? 18 : 186)
        );
    
        const map = this.make.tilemap({
            data: level01,
            tileWidth: 64,
            tileHeight: 64
        });
    
        const tilesheet = map.addTilesetImage("smb_tiles", null, 64, 64);
    
        const waterMap = this.make.tilemap({
            data: waterLevel,
            tileWidth: 64,
            tileHeight: 64
        });
        this.waterLayer = waterMap.createLayer(0, tilesheet, 0, 0);
        this.waterLayer.setScale(0.5);
    
        this.layer = map.createLayer(0, tilesheet, 0, 0);
        this.layer.setScale(0.5);
        console.log(level01);
    }
    
    

    placeNames() {
        const colSize = 20;
        const rowSize = 20;

        for (let y = 0; y < colSize; y++) {
            for (let x = 0; x < rowSize; x++) {
                if (this.namesPlaced < this.maxNames && Math.random() < 0.01) {
                    const tileType = this.layer.getTileAt(x, y).index;
                    let nameToPlace;
    
                    if ((tileType === 23|| tileType == 18) && this.namesPlaced < this.maxNames) {
                        nameToPlace = this.villageNames[this.namesPlaced % this.villageNames.length];
                    } else if (tileType === 186 && this.namesPlaced < this.maxNames) {
                        nameToPlace = this.oceanNames[this.namesPlaced % this.oceanNames.length];
                    }
    

                    if (nameToPlace) {
                        this.add.text(x * 64 * 0.5 + 32, y * 64 * 0.5 + 16, nameToPlace, {
                            font: "8px Arial",
                            fill: "#ffffff"
                        }).setOrigin(0.5);
                        this.namesPlaced++;
                    }
                }
            }
        }
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
            0: 23,  // 0000: No Sand around (normal land tile)
            1: 6,  // 0001: Sand to the north
            2: 40,  // 0010: Sand to the south
            3: 23,  // 0011: Sand to the north and south
            4: 24,  // 0100: Sand to the east
            5: 7,  // 0101: Sand to the north and east
            6: 41,  // 0110: Sand to the south and east
            7: 58,  // 0111: Sand to the north, south, and east
            8: 22,  // 1000: Sand to the west
            9: 5,  // 1001: Sand to the north and west
            10: 39, // 1010: Sand to the south and west
            11: 22, // 1011: Sand to the north, south, and west
            12: 23, // 1100: Sand to the east and west
            13: 6, // 1101: Sand to the north, east, and west
            14: 40, // 1110: Sand to the south, east, and west
            15: 23, // 1111: Sand all around (fully surrounded by Sand)
        };
        return transitionTiles[bitMask];
    }

    applySandToWaterTransitionTile(bitMask) {
        const sandWaterTransitionTiles = {
            0: 18,  // 0000: No water around (normal sand tile)
            1: 1,  // 0001: Water to the north
            2: 35,  // 0010: Water to the south
            3: 18,  // 0011: Water to the north and south
            4: 19,  // 0100: Water to the east
            5: 2,  // 0101: Water to the north and east
            6: 36,  // 0110: Water to the south and east
            7: 53,  // 0111: Water to the north, south, and east
            8: 17,  // 1000: Water to the west
            9: 0,  // 1001: Water to the north and west
            10: 34, // 1010: Water to the south and west
            11: 18, // 1011: Water to the north, south, and west
            12: 18, // 1100: Water to the east and west
            13: 1, // 1101: Water to the north, east, and west
            14: 35, // 1110: Water to the south, east, and west
            15: 18, // 1111: Water all around (fully surrounded by water)
        };
        return sandWaterTransitionTiles[bitMask];
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.regen)) {
            this.seed = Math.random();
            noise.seed(this.seed);
            this.generateMap();
            this.namesPlaced = 0;
            this.placeNames();
            document.getElementById('seed-value').innerHTML = `Seed: ${this.seed}`;
        }

        if (Phaser.Input.Keyboard.JustDown(this.shrinkWindow)) {
            this.sampleScale = Math.max(1, this.sampleScale - 1);
            this.generateMap();
            this.namesPlaced = 0;
            this.placeNames();
        }

        if (Phaser.Input.Keyboard.JustDown(this.growWindow)) {
            this.sampleScale += 1;
            this.generateMap();
            this.namesPlaced = 0;
            this.placeNames();
        }
    }
}