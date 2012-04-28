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
	last_update = new Array(2);
	mousedown = false;
	running = false;
	timer = 0;

	for(var x = 0; x <= gridWidth; x++)
	{
		state[x] = new Array(gridHeight);
		for(var y = 0; y <= gridHeight; y++)
		{
			updateCell(x, y, 0);
		}
	}
	
	canvas.addEventListener('mousedown', function(){mousedown = true;}, false);
	canvas.addEventListener('mouseup', function(){mousedown = false;}, false);
	canvas.addEventListener('mousemove', cellClickHandler, false);
	canvas.addEventListener('click', cellClickHandler, false);	
});


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


function cellClickHandler(evt)
{	
	var canvas_coords = getCanvasCoords(evt);
	var cell_x = canvas_coords[0];
	var cell_y = canvas_coords[1];
	var new_state;
	
	new_state = state[cell_x][cell_y];
	
	if(evt.type == 'click')
	{
		if((state[cell_x][cell_y] == 1))
		{
			new_state = 0;
		}
		else if((state[cell_x][cell_y] == 0))
		{
			new_state = 1;
		}
		last_update[0] = cell_x;
		last_update[1] = cell_y;
		updateCell(cell_x, cell_y, new_state);
	}
	
	if(mousedown  && ((last_update[0] != cell_x) || (last_update[1] != cell_y)))
	{
		if((state[cell_x][cell_y] == 1))
		{
			new_state = 0;
		}
		else if((state[cell_x][cell_y] == 0))
		{
			new_state = 1;
		}
		last_update[0] = cell_x;
		last_update[1] = cell_y;
		updateCell(cell_x, cell_y, new_state);
	}

}


function updateCell(x, y, new_state)
{
	context.beginPath();
	context.strokeStyle = 'black';
	context.fillStyle = 'white';
	context.rect((x * cellSize), (y * cellSize), cellSize, cellSize);
	state[x][y] = new_state;
	if(new_state == 1)
	{
		context.fillStyle = 'black';
	}
	context.fill();
	context.stroke();
}


function toggleAnimation()
{	
	if(!running)
	{
		timer = setInterval("animate()", 100);
		running = true;
	}
	else
	{
		clearInterval(timer);
		running = false;
	}
	
	var button = document.getElementById("startButton");
	if(running)
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
}


function resetGrid()
{	
	running = false;
	clearInterval(timer);
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
}


// JS modulo doesn't work with negatives, this does
function mod(a, b)
{
	return ((a % b) + b) % b;
}
