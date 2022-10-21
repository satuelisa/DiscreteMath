var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var root = null;
var r = 15; // node radius
document.getElementById('clave').focus();

function place(curr, key) {
    if (curr.key == key) {
	document.getElementById("msg").innerHTML += key + ' ya se encuentra incluido<br/>';
	return;
    } else {
	if (key < curr.key) {
	    if (curr.left == null) {
		curr.left = {'height': 1, 'width': 1, 'key': key, 'left': null, 'right': null};
		document.getElementById("msg").innerHTML += key + ' incluido en un ramo izquierdo de ' + curr.key + '<br/>';
	    } else {
		document.getElementById("msg").innerHTML += 'Buscando lugar para ' + key + ' en el ramo izquierdo de ' + curr.key + '<br/>';				
		place(curr.left, key);
	    }	    
	} else if (key > curr.key) {
	    if (curr.right == null) {
		curr.right = {'height': 1, 'width': 1, 'key': key, 'left': null, 'right': null};
		document.getElementById("msg").innerHTML += key + ' incluido en un ramo derecho de ' + curr.key + '<br/>';
	    } else {
		document.getElementById("msg").innerHTML += 'Buscando lugar para ' + key + ' en el ramo derecho de ' + curr.key + '<br/>';						
		place(curr.right, key);
	    }	    
	}
    }
}

function node(curr) {
    var notLeaf = false;
    var isRoot = (curr == root);
    if (curr.left != null) {
	notLeaf = true;
	node(curr.left);
    }
    if (curr.right != null) {
	notLeaf = true;
	node(curr.right);
    }
    ctx.fillStyle = "#ffffff";
    if (isRoot) {
	ctx.strokeStyle = "#ff0000";
    } else if (notLeaf) {
	ctx.strokeStyle = "#0000ff";
    } else {
	ctx.strokeStyle = "#00ff00";    
    }
    ctx.beginPath();
    ctx.rect(curr.x - r, curr.y - r, 2 * r, 2 * r);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.fillText(curr.key, curr.x, curr.y + 8);
}

function connect(curr, sx, sy, available, unit) {
    curr.x = sx + (available / 2);     
    curr.y = sy + (unit / 2);
    sy += unit;
    var dw = available / curr.width;
    var uw = 0;
    var child = null;
    if (curr.left != null) {
	child = curr.left;
	uw = dw * child.width;
	connect(child, sx, sy, uw, unit);
	ctx.strokeStyle = '#333333';	
	ctx.beginPath();
	ctx.moveTo(curr.x, curr.y);
	ctx.lineTo(child.x, child.y);
	ctx.closePath();
	ctx.stroke();
    }
    sx += uw + dw;
    if (curr.right != null) {
	child = curr.right;
	uw = dw * child.width;	
	connect(child, sx, sy, uw, unit);
	ctx.strokeStyle = '#aaaaaa';
	ctx.beginPath();
	ctx.moveTo(curr.x, curr.y);
	ctx.lineTo(child.x, child.y);
	ctx.closePath();
	ctx.stroke();
    }
}

function update(curr) {
    var highest = 0;
    var total = 1;
    if (curr.left != null) {
	update(curr.left);
	highest = Math.max(highest, curr.left.height);
	total += curr.left.width;
    }
    if (curr.right != null) {
	update(curr.right);
	highest = Math.max(highest, curr.right.height);
	total += curr.right.width;	
    }
    curr.width = total;
    curr.height = highest + 1;
}

function draw(root) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var tall = root.height;
    var wide = root.width;
    var MARGIN = 10;
    var unit = 3 * r;
    var w = unit * wide + 2 * MARGIN;
    var h = unit * tall + 2 * MARGIN;
    canvas.width = w;
    canvas.height = h;
    ctx.lineWidth = 3;
    connect(root, MARGIN, MARGIN, w - 2 * MARGIN, unit);
    ctx.font = "15px Verdana";
    ctx.textAlign = "center"; 
    node(root);
}    

function insert() {
    var entry = document.getElementById("clave").value;
    if (entry.indexOf('.') > -1) {
	document.getElementById("msg").innerHTML += "Ignorando clave " + entry + ' por no ser un entero<br/>';
	return;
    }
    var key = parseInt(entry);
    if (key < 1 || key > 99) {
	document.getElementById("msg").innerHTML += "Ignorando clave " + key + ' por no respetar el rango<br/>';
	return;
    }    
    document.getElementById("msg").innerHTML += "Insertando clave " + key + '<br/>';
    document.getElementById("clave").value = '';
    if (root == null) {
	document.getElementById("msg").innerHTML += "Creando una ra&iacute;z para colocar " + key + '<br/>';	
	root = {'height': -1, 'key': key, 'left': null, 'right': null}; 
    } else {
	place(root, key);
    }
    update(root);
    draw(root);
    document.getElementById('clave').focus();
}

