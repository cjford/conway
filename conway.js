$(document).ready(function()
{	
	gridWidth = 50;
	gridHeight = 30;
	canvasWidth = 800;
	canvasHeight = 450;
	cellSize = Math.floor(canvasWidth/gridWidth);

	canvas = document.getElementById("canvas");
	canvas.setAttribute("height", cellSize * gridHeight);
	canvas.setAttribute("width", cellSize * gridWidth);
	context = canvas.getContext("2d");
	
	state = new Array(gridWidth);
	savedState = new Array(gridWidth);
	lastUpdate = new Array(2);
	mouseDownCoords = new Array(2);
	
	genCount = 0;
	updateTimer = 0;
	isRunning = false;
	mouseIsDown = false;

	for(var x = 0; x <= gridWidth; x++)
	{
		state[x] = new Array(gridHeight);
		savedState[x] = new Array(gridHeight);
		for(var y = 0; y <= gridHeight; y++)
		{
			updateCell(x, y, 0);
		}
	}
	
	canvas.addEventListener('mousedown', mouseDownHandler, false);
	canvas.addEventListener('mouseup', function(){mouseIsDown = false;}, false);
	canvas.addEventListener('mousemove', cellClickHandler, false);
	canvas.addEventListener('click', cellClickHandler, false);	
});

function drawGrid()
{
	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{
			updateCell(x, y, state[x][y]);
		}
	}
}
	
function getCanvasCoords(evt)
{
	var obj = canvas;
	var top_total = 0;
	var left_total = 0;
	var return_coords = new Array(2);

	while (obj && obj.tagName != 'BODY') 
	{
		top_total += obj.offsetTop;
		left_total += obj.offsetLeft;
		obj = obj.offsetParent;
	}

	return_coords[0] = Math.floor((evt.clientX - left_total + window.pageXOffset) / cellSize);
	return_coords[1] = Math.floor((evt.clientY - top_total + window.pageYOffset) / cellSize);
	return return_coords;
}

function mouseDownHandler(evt)
{
	mouseIsDown = 'true';
	mouseDownCoords = getCanvasCoords(evt);
}

function cellClickHandler(evt)
{	
	var new_state;
	var canvas_coords = getCanvasCoords(evt);
	var cell_x = canvas_coords[0];
	var cell_y = canvas_coords[1];
	
	new_state = state[cell_x][cell_y];
	
	if(evt.type == 'click')
	{	
		var mouse_up_coords = getCanvasCoords(evt);
		if(mouseDownCoords[0] != mouse_up_coords[0] || mouseDownCoords[1] != mouse_up_coords[1]){return;}

		if((state[cell_x][cell_y] == 1))
		{
			new_state = 0;
		}
		else if((state[cell_x][cell_y] == 0))
		{
			new_state = 1;
		}
		lastUpdate[0] = cell_x;
		lastUpdate[1] = cell_y;
		updateCell(cell_x, cell_y, new_state);
	}
	
	if(mouseIsDown  && ((lastUpdate[0] != cell_x) || (lastUpdate[1] != cell_y)))
	{
		if((state[cell_x][cell_y] == 1))
		{
			new_state = 0;
		}
		else if((state[cell_x][cell_y] == 0))
		{
			new_state = 1;
		}
		lastUpdate[0] = cell_x;
		lastUpdate[1] = cell_y;
		updateCell(cell_x, cell_y, new_state);
	}

}


function updateCell(x, y, new_state)
{
	var gridLineBox = document.getElementById('gridLineBox');
	var randColorBox = document.getElementById('randColorBox');
	context.beginPath();
	context.fillStyle = 'white';
	context.strokeStyle = (gridLineBox.checked ? 'black' : 'white');
	context.rect((x * cellSize), (y * cellSize), cellSize, cellSize);
	state[x][y] = new_state;
	if(new_state == 1)
	{
		if(!randColorBox.checked)
		{
			context.fillStyle = 'black';
		}
		else
		{
			context.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);

		}
	}
	context.fill();
	context.stroke();
}


function updateInterval()
{
	var speed = document.getElementById('intervalInput').value;
	if(isNaN(speed) || speed == 0)
	{
		document.getElementById('errorBox').innerHTML = 'Please enter a valid number.';
		setTimeout("document.getElementById('errorBox').innerHTML = ''", 1300);
		return false;
	}
	else
	{
		if(isRunning)
		{
			toggleAnimation();
			toggleAnimation();
		}
	}
	return true;
}

function toggleAnimation()
{	
	if(!isRunning && !updateInterval())
	{
		return;
	}
	var speed = document.getElementById('intervalInput').value;
	if(!isRunning)
	{
		for(var x = 0; x < gridWidth; x++)
		{
			for(var y = 0; y < gridHeight; y++)
			{	
				savedState[x][y] = state[x][y];
			}
		}
				
		updateTimer = setInterval("animate()", speed);
		isRunning = true;
	}
	else
	{
		clearInterval(updateTimer);
		isRunning = false;
	}
	
	var button = document.getElementById("startButton");
	if(isRunning)
	{
		button.innerHTML = 'Stop';
	}
	else
	{
		button.innerHTML = 'Start';
	}

}


function animate()
{	
	var new_state = new Array(gridWidth);
	for(var x = 0; x <= gridWidth; x++)
	{
		new_state[x] = new Array(gridHeight);
		for(var y = 0; y <= gridHeight; y++)
		{
			if(state[x][y] == 1)																	
			{	
																									
				var neighbors = 0;
				if(state[mod((x-1), gridWidth)][mod((y-1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x-1), gridWidth)][mod((y+1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x-1), gridWidth)][mod(y,		gridHeight)] == 1){neighbors++;}
				if(state[mod((x+1), gridWidth)][mod((y+1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x+1), gridWidth)][mod((y-1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x+1), gridWidth)][mod(y,		gridHeight)] == 1){neighbors++;}
				if(state[mod(x,		gridWidth)][mod((y-1), gridHeight)] == 1){neighbors++;}
				if(state[mod(x,		gridWidth)][mod((y+1), gridHeight)] == 1){neighbors++;}
				
				if(neighbors < 2 || neighbors > 3) {new_state[x][y] = 0;}							
				else{new_state[x][y] = 1;}
			}
			else																					
			{
				var neighbors = 0;																	
				if(state[mod((x-1), gridWidth)][mod((y-1), gridHeight)] == 1){neighbors++;}		
				if(state[mod((x-1), gridWidth)][mod((y+1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x-1), gridWidth)][mod(y,		gridHeight)] == 1){neighbors++;}
				if(state[mod((x+1), gridWidth)][mod((y+1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x+1), gridWidth)][mod((y-1), gridHeight)] == 1){neighbors++;}
				if(state[mod((x+1), gridWidth)][mod(y,		gridHeight)] == 1){neighbors++;}
				if(state[mod(x,		gridWidth)][mod((y-1), gridHeight)] == 1){neighbors++;}
				if(state[mod(x,		gridWidth)][mod((y+1), gridHeight)] == 1){neighbors++;}
									
				if(neighbors == 3) {new_state[x][y] = 1;}											
				else{new_state[x][y] = 0;}
			}
		}
	}

	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{
			if(state[x][y] != new_state[x][y])
			{
				updateCell(x,y,new_state[x][y]);
			}
		}
	}
	genCount++;
	document.getElementById('genCount').innerHTML = 'Generation Count: ' + genCount;
}


function clearGrid()
{	
	isRunning = false;
	clearInterval(updateTimer);
	document.getElementById('startButton').innerHTML = 'Start';
	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{
			state[x][y] = 0;
		}
	}

	context.clearRect(0, 0, canvasWidth, canvasHeight);
	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{
			updateCell(x, y, 0);
		}
	}
	genCount = 0;
	document.getElementById('genCount').innerHTML = 'Generation Count: ' + '0';
}

function randomizeGrid()
{
	isRunning = false;
	clearInterval(updateTimer);
	document.getElementById('startButton').innerHTML = 'Start';
	var new_state;
	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{	
			new_state = Math.floor(Math.random()*2);
			updateCell(x, y, new_state);
		}
	}
}

function saveState()
{	
	if(isRunning){toggleAnimation();}
	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{
			savedState[x][y] = state[x][y];
		}
	}
	tmpGenCount = genCount;
}

function loadState()
{
	if(isRunning){toggleAnimation();}
	for(var x = 0; x <= gridWidth; x++)
	{
		for(var y = 0; y <= gridHeight; y++)
		{
			state[x][y] = savedState[x][y];
		}
	}
	genCount = tmpGenCount;
	document.getElementById('genCount').innerHTML = 'Generation Count: ' + genCount;
	drawGrid();
}

function buttonMouseover(element)
{
	element.style.border = '3px solid black';
	element.style.color = 'white';
	if(element.id == 'startButton')
	{
		element.style.margin = '4px 6px 0px 0px';
	}
	else
	{
		element.style.margin = '4px 6px';
	}
}

function buttonMouseOut(element)
{
	element.style.border = '2px solid black';
	element.style.color = 'black';
	if(element.id == 'startButton')
	{
		element.style.margin = '5px 6px 0px 0px';
	}
	else
	{
		element.style.margin = '5px 6px';
	}
}

// JS modulo doesn't work with negatives, this does
function mod(a, b)
{
	return ((a % b) + b) % b;
}
