//dots will be held as color {}s in a 2d array.
//the number of dots in the image is defined at init, and never changes.
//dots may be resized at runtime. because of this, their pixel size should be calculated at draw-time.
//!!!!!!!!!! DONT STORE COLOR {}s, STORE A SINGLE NUMBER THAT REPRESENTS FIRE INTENSITY.
//  other values can be stored to modify other mutating factors over time, but lets just start with this.


//The map buffer is where the draw data is stored. 
//This is necessary because this program needs to be double buffered.
function DoubleBufferedMap(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.primaryBuffer = [];
    this.backBuffer = [];

    for(var r = 0; r < rows; r++) { //for every row
        this.primaryBuffer[r] = []; //create a row here
        this.backBuffer[r] = []; //create a row here
        for(var c = 0; c < columns; c++) { //for every column
            if(r == rows - 1) {
                this.backBuffer[r][c] = 15;
            }else {
                this.backBuffer[r][c] = 0;
            }
            this.primaryBuffer[r][c] = 0;
            
        }
    }
}

//returns the value from the primary buffer.
DoubleBufferedMap.prototype.getValue = function(row, column) {
    if(this.primaryBuffer[row] == null || this.primaryBuffer[row][column] == null) {
        return null;
    }
    return this.primaryBuffer[row][column];
}

//sets the value to the BACK buffer.
DoubleBufferedMap.prototype.setValue = function(row, column, value) {
    if(this.backBuffer[row] == null || this.backBuffer[row][column] == null) {
        return;
    }
    this.backBuffer[row][column] = value;
}

//move values from the backBuffer to the primary buffer, then clear the backbuffer.
//  we could leave the backbuffer with old data, but clearing it with 0s gives us more 
//  predictable code, should something get weird.
DoubleBufferedMap.prototype.swap = function () {
    for(var row = 0; row < this.rows; row++) { //for every row
        for(var column = 0; column < this.columns; column++) { //for every column
            this.primaryBuffer[row][column] = this.backBuffer[row][column]; //put the value in the backbuffer into the primary.
            //this.backBuffer[row][column] = 0; //clear the back buffer.
        }
    }
}



function Hellfire(canvas, rows, columns, processMethod) {
    this.canvas = canvas
    this.canvasContext = canvas.getContext('2d', { alpha: false });
    this.mapBuffer = new DoubleBufferedMap(rows, columns);
    this.processMethod = processMethod;

    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCanvas.width = canvas.width;
    this.offscreenCanvas.height = canvas.height;
    this.offscreenCanvasContext = this.offscreenCanvas.getContext('2d', {alpha: false});
}

Hellfire.prototype.colorFromNumber = function(number) {

    if(number == 0) {
        return "#070707";
    }else if(number == 1) {
        return "#2f0f07";
    }else if(number == 2) {
        return "#571707";
    }else if(number == 3) {
        return "#771f07";
    }else if(number == 4) {
        return "#9f2f07";
    }else if(number == 5){
        return "#bf4707";
    }else if(number == 6){
        return "#DF5707";
    }else if(number == 7){
        return "#D75F07";
    }else if(number == 8){
        return "#cf6f0f";
    }else if(number == 9){
        return "#C7971F";
    }else if(number == 10){
        return "#BF9F1F";
    }else if(number == 11){
        return "#BFA727";
    }else if(number == 12){
        return "#B7B737";
    }else if(number == 13){
        return "#CFCF6F";
    }else if(number == 14){
        return "#DFDF9F";
    }else {
        return "#FFFFFF"
    }
}

Hellfire.prototype.drawDot = function(row, column, color) {
    var dotWidth = this.canvas.width / this.mapBuffer.columns;
    var dotHeight = this.canvas.height / this.mapBuffer.rows;

    this.offscreenCanvasContext.fillStyle = color;
    this.offscreenCanvasContext.fillRect(column * dotWidth, row * dotHeight, dotWidth, dotHeight);
}

Hellfire.prototype.rgbToHexColor = function(r, g, b) {
    function numberToHex(num) {
        var hex = num.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + numberToHex(r) + numberToHex(g) + numberToHex(b);
}

Hellfire.prototype.draw = function () {
    //swap buffers
    //draw.
    this.mapBuffer.swap();
    for(var row = 0; row < this.mapBuffer.rows; row++) { //for every row
        for(var column = 0; column < this.mapBuffer.columns; column++) { //for every column
            this.processMethod(this, row, column);
            //if(this.mapBuffer.getValue(row, column) != 0) {
                this.drawDot(row, column, this.colorFromNumber(this.mapBuffer.getValue(row, column)));
            //}
        }
    }
    this.canvasContext.drawImage(this.offscreenCanvas, 0, 0);
}