//wall = W
//roof = R
//ground = G
class coord{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

let tmptiles = [
    {type: "G", chance: 50},
    {type: "W", chance: 5},
    {type: "R", chance: 5}
]

function sumOfWeights(tilemap){
    value = 0;
    for (let i = 0; i < tilemap.length; i++){
        value += tilemap[i].chance;
    }
    return value;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  

function MakeRoom(x, y){
    size = new coord(x, y);
    pattern = [];
    for (let i = 0; i < size.y; i++){
        pattern.push([])
        for (j = 0; j < size.x; j++){
            pattern[i].push(" ");
        }
    }

    startTile = new coord(0, 0);
    console.log(pattern);
    pattern = GenerateRoom(startTile, pattern);
    return pattern;
}

function GenerateRoom(tile, pattern){
    //rules
    // if (pattern[tile.x][tile.y - 1] == "W") pattern[tile.x][tile.y] = "R";
    // else if (pattern[tile.x][tile.y + 1] == "R") pattern[tile.x][tile.y] ="W";
    // else if (pattern[tile.x][tile.y - 1] == "R") pattern[tile.x][tile.y] ="G";
    // else if (pattern[tile.x][tile.y + 1] == "W") pattern[tile.x][tile.y] ="G";
    // else pattern[tile.x][tile.y] = "W";
    pattern[tile.x][tile.y] = getWeightedRandomTile();

    neighbours = getNeighbours(tile, pattern);

    emptyNeighbours = getEmptyNeighbours(tile, pattern);

    while (emptyNeighbours.length > 0){
        pattern = GenerateRoom(emptyNeighbours.shift(), pattern);
    }
    return pattern
}

function getEmptyNeighbours(tile, pattern){
    let neighbours = []
    if (tile.y != 0 && pattern[tile.x][tile.y - 1] == " ") neighbours.push(new coord(tile.x, tile.y - 1));
    if (tile.x != 0 && pattern[tile.x - 1][tile.y] == " ") neighbours.push(new coord(tile.x - 1, tile.y));
    if (tile.y != pattern[0].length - 1 && pattern[tile.x][tile.y + 1] == " ") neighbours.push(new coord(tile.x, tile.y + 1));
    if (tile.x != pattern.length - 1 && pattern[tile.x + 1][tile.y] == " ") neighbours.push(new coord(tile.x + 1, tile.y));
    return neighbours;
}

function getNeighbours(tile, pattern){
    let neighbours = []
    if (tile.x != 0) neighbours.push(new coord(tile.x - 1, tile.y));
    if (tile.y != 0) neighbours.push(new coord(tile.x, tile.y - 1));
    if (tile.x != pattern.length - 1) neighbours.push(new coord(tile.x + 1, tile.y));
    if (tile.y != pattern[0].length - 1) neighbours.push(new coord(tile.x, tile.y + 1));
    return neighbours;
}

function getWeightedRandomTile(mask = ""){ //usage str = "WG" or "GW" for only walls or ground
    tilemap = tmptiles;
    // if (mask =! ""){
    //     for (let i = 0; i < tilemap.length; i++){
    //         if (String(mask).includes(tilemap[i].type) == false){
    //             tilemap.splice(i, 1);
    //             // i -= 1
    //         }
    //     }
    // }

    value = getRandomInt(sumOfWeights(tilemap));
    for (let i = 0; i < tilemap.length; i++){
        value -= tilemap[i].chance;
        if (value <= 0){
            return tilemap[i].type;
        }
    }
}
