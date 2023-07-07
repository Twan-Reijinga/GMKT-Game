//wall = W
//roof = R
//ground = G
class coord{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let tiles = [
    {type: "G", chance: 190},
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
    return Math.floor(Math.random() * max) + 1;
  }
  

function MakeRoom(x, y){
    size = new coord(x, y);
    pattern = [];
    for (let i = 0; i < size.y; i++){
        pattern[i] = new Array(size.x + 1).join(" ");// create string of x size filled with spaces.
    }
    
    // pattern = new Array(size.y).fill(new Array(size.x).fill(" "));

    console.log(pattern);

    startTile = new coord(getRandomInt(size.x) - 1, getRandomInt(size.y) - 1)
    pattern[startTile.x][startTile.y] = getWeightedRandomTile("GWR");
    pattern = GenerateRoom(startTile, pattern);
    console.log(pattern)
    return pattern;
}

function GenerateRoom(tile, pattern){
    //rules
    if (pattern[tile.x][tile.y - 1] == "W") pattern[tile.x][tile.y] = "R";
    else if (pattern[tile.x][tile.y + 1] == "R") pattern[tile.x][tile.y] = "W";
    else if (pattern[tile.x][tile.y - 1] == "R") pattern[tile.x][tile.y] = "G";
    else if (pattern[tile.x][tile.y + 1] == "W") pattern[tile.x][tile.y] = "G";
    else pattern[tile.x][tile.y] = getWeightedRandomTile("GWR");

    neighbours = getNeighbours(tile, pattern);
    emptyNeighbours = getEmptyNeighbours(tile, pattern);
    while (emptyNeighbours.length != 0){
        pattern = GenerateRoom(emptyNeighbours[0], pattern);
        emptyNeighbours.shift();
    }
    return pattern
}

function getEmptyNeighbours(tile, pattern){
    let neighbours = []
    if (tile.x != 0 && pattern[tile.x - 1][tile.y] != " ") neighbours.push(new coord(tile.x - 1, tile.y));
    if (tile.y != 0 && pattern[tile.x][tile.y - 1] != " ") neighbours.push(new coord(tile.x, tile.y - 1));
    if (tile.x != pattern.length - 1 && pattern[tile.x + 1][tile.y] != " ") neighbours.push(new coord(tile.x + 1, tile.y));
    if (tile.y != pattern[0].length - 1 && pattern[tile.x][tile.y + 1] != " ") neighbours.push(new coord(tile.x, tile.y + 1));
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

function getWeightedRandomTile(str = ""){ //usage str = "WG" or "GW" for only walls or ground
    tilemap = tiles

    if (str =! ""){
        for (let i = 0; i < tilemap.length; i++){
            if (!str.includes(tilemap[i].type)){
                tilemap.splice(i, 1);
                i -= 1
            }
        }
    }

    value = getRandomInt(sumOfWeights(tilemap));
    for (let i = 0; i < tilemap.length; i++){
        value -= tilemap[i].chance;
        if (value <= 0){
            return tilemap[i].type;
        }
    }
}
