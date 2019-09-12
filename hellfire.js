//  other values can be stored to modify other mutating factors over time, but lets just start with this.

//The map buffer is where the draw data is stored. 
//This is necessary because this program needs to be double buffered.
function BufferedMap(width, height) {
    this.width = width;
    this.height = height;
    this.primaryBuffer = [];
    this.backBuffer = [];

    for(var y = 0; y < this.height; y++) { //for every x coordinate
        this.primaryBuffer[y] = [];
        this.backBuffer[y] = [];
        for(var x = 0; x < this.width; x++) { //for every column
            if(y == height - 1) {
                this.backBuffer[y][x] = 15;
            }else {
                this.backBuffer[y][x] = 0;
            }
            this.primaryBuffer[y][x] = 0;
        }
    }
}

//returns the value from the primary buffer.
BufferedMap.prototype.getValue = function(x, y) {
    if(this.primaryBuffer[y] == null || this.primaryBuffer[y][x] == null) {
        return null;
    }
    return this.primaryBuffer[y][x];
}

//sets the value to the BACK buffer.
BufferedMap.prototype.setValue = function(x, y, value) {
    if(this.backBuffer[y] == null || this.backBuffer[y][x] == null) {
        return;
    }
    this.backBuffer[y][x] = value;
}

//move values from the backBuffer to the primary buffer, then clear the backbuffer.
//  we could leave the backbuffer with old data, but clearing it with 0s gives us more 
//  predictable code, should something get weird.
BufferedMap.prototype.swap = function () {
    for(var y = 0; y < this.height; y++) { //for every row
        for(var x = 0; x < this.width; x++) { //for every column
            this.primaryBuffer[y][x] = this.backBuffer[y][x]; //put the value in the backbuffer into the primary.
            //this.backBuffer[row][column] = 0; //clear the back buffer.
        }
    }
}


function Hellfire(canvas, scale, processMethod) {
    this.processMethod = processMethod;
    this.canvas = canvas
    this.scale = scale;


    this.canvasContext = canvas.getContext('2d');

    //set the canvas' internal size to its actual pyhsical dimension
    this.canvas.width = this.canvas.scrollWidth;
    this.canvas.height = this.canvas.scrollHeight;

    this.canvasContext.scale(this.scale, this.scale);

    this.bufferedMap = new BufferedMap( Math.floor(this.canvas.scrollWidth / scale), 
                                        Math.floor(this.canvas.scrollHeight / scale));

    this.pixelBuffer = this.canvasContext.createImageData(this.bufferedMap.width, this.bufferedMap.height);
    
    this.canvasContext.imageSmoothingEnabled = false;
}

Hellfire.prototype.colorFromNumber = function(number) {

    if(number == 0) {
        return [16, 12, 16];
        //return "#100C10";
    }else if(number == 1) {
        return [47, 15, 7];
        //return "#2f0f07";
    }else if(number == 2) {
        return [87,23,7];
        //return "#571707";
    }else if(number == 3) {
        return [119,31,7];
        //return "#771f07";
    }else if(number == 4) {
        return [159,47,7];
        //return "#9f2f07";
    }else if(number == 5){
        return [191,71,7];
        //return "#bf4707";
    }else if(number == 6){
        return [223,87,7];
        //return "#DF5707";
    }else if(number == 7){
        return [215,95,7];
        //return "#D75F07";
    }else if(number == 8){
        return [207,111,15];
        //return "#cf6f0f";
    }else if(number == 9){
        return [199,151,31];
        //return "#C7971F";
    }else if(number == 10){
        return [191,159,31];
        //return "#BF9F1F";
    }else if(number == 11){
        return [191,167,39];
        //return "#BFA727";
    }else if(number == 12){
        return [183,183,55];
        //return "#B7B737";
    }else if(number == 13){
        return [207,207,111];
        //return "#CFCF6F";
    }else if(number == 14){
        return [223,223,159];
        //return "#DFDF9F";
    }else {
        return [255,255,255];
        //return "#FFFFFF"
    }
}

Hellfire.prototype.drawDot = function(x, y, color) {
    //determine the exact pixel location, and modify its buffers.
    var index = ((y * this.bufferedMap.width) + x);
    
    this.pixelBuffer.data[(index * 4)] = color[0]//red;
    this.pixelBuffer.data[(index * 4) + 1] = color[1] //green;
    this.pixelBuffer.data[(index * 4) + 2] = color[2]//blue
    this.pixelBuffer.data[(index * 4) + 3] = 255;//opaque
}


Hellfire.prototype.draw = function () {
    //swap map buffers. process, draw to back pixel buffer, then draw buffer to canvas.
    this.bufferedMap.swap();

    for(var y = 0; y < this.bufferedMap.height; y++) { //for every row
        for(var x = 0; x < this.bufferedMap.width; x++) { //for every column
                this.processMethod(this, x, y);
                this.drawDot(x, y, this.colorFromNumber(this.bufferedMap.getValue(x, y)));
        }
    }
    this.canvasContext.putImageData(this.pixelBuffer, 0, 0);
    this.canvasContext.drawImage(this.canvas, 0, 0);

}