//wall = W
//roof = R
//ground = G
class coord{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

var tiles = [
    {type: "G", chance: 190},
    {type: "W", chance: 5},
    {type: "R", chance: 5}
]

function sumOfWeights(tilemap){
    return tilemap.reduce(function(val, tile){return val + tile.chance}, 0);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max) + 1;
  }
  

function MakeRoom(size){
    //size = (4, 5)
    pattern = [];
    for (let i = 0; i < size.y; i++){
        pattern[i] = new Array(size.x + 1).join(" ");// create string of x size filled with spaces.
    }
    
    startTile = new coord(getRandomInt(size.x), getRandomInt(size.y))
    pattern[startTile.x][startTile.y] = getWeightedRandomTile();
    pattern = GenerateRoom(startTile, pattern);
}

function GenerateRoom(tile, pattern){
    //rules
    if (pattern[tile.x][tile.y - 1] == "W") pattern = "R";
    else if (pattern[tile.x][tile.y + 1] == "R") pattern = "W";
    else if (pattern[tile.x][tile.y - 1] == "R") pattern = "G";
    else if (pattern[tile.x][tile.y + 1] == "W") pattern = "G";
    else pattern = getWeightedRandomTile();
    
    neighbours = getNeighbours(tile, pattern);
    emptyNeighbours = getEmptyNeighbours(tile, pattern);
    if (emptyNeighbours.length = 4) pattern[tile.x, tile.y] = getWeightedRandomTile();
    return pattern
}

function getEmptyNeighbours(tile, pattern){
    let neighbours = []
    if (tile.x != 0 && pattern[tile.x - 1][tile.y] != " ") neighbours.push(new coord(tile.x - 1, tile.y));
    if (tile.y != 0 && pattern[tile.x][tile.y - 1] != " ") neighbours.push(new coord(tile.x, tile.y - 1));
    if (tile.x != pattern.length && pattern[tile.x + 1][tile.y] != " ") neighbours.push(new coord(tile.x + 1, tile.y));
    if (tile.y != pattern[0].length && pattern[tile.x][tile.y + 1] != " ") neighbours.push(new coord(tile.x, tile.y + 1));
    return neighbours;
}

function getNeighbours(tile, pattern){
    let neighbours = []
    if (tile.x != 0) neighbours.push(new coord(tile.x - 1, tile.y));
    if (tile.y != 0) neighbours.push(new coord(tile.x, tile.y - 1));
    if (tile.x != pattern.length) neighbours.push(new coord(tile.x + 1, tile.y));
    if (tile.y != pattern[0].length) neighbours.push(new coord(tile.x, tile.y + 1));
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
