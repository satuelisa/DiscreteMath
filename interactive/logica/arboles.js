var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");

// https://stackoverflow.com/questions/9790845/check-if-an-option-exist-in-select-element-without-jquery
function optionExists(needle, haystack) {
    if (haystack === undefined) {
	return false;
    }
    var optionExists = false;
    var optionsLength = haystack.length;
    while (optionsLength--) {
	if (haystack.options[optionsLength].value === needle) {
	    optionExists = true;
	    break;
	}
    }
    return optionExists;
}

// own code

var replacements = { "∧": "&and;",
		     "¬": "&not;",
		     "∨": "&or;",
		     "↔": "&harr;",
		     "→": "&rarr;",
		     "⊕": "&oplus;"}
		     
function utf2html(input) {
    output = input;
    for (var r in replacements) {
	if (replacements.hasOwnProperty(r)) {
	    while (output.indexOf(r) > -1) { 
		output = output.replace(r, replacements[r]);
	    }
	}
    }
    return output;
}

var invrepl = {"&and;": "∧",
	       "&not;": "¬",
	       "&or;": "∨",
	       "&harr;": "↔",
	       "&rarr;": "→",
	       "&oplus;": "⊕"}

function html2utf(input) {
    output = input;
    for (var r in invrepl) {
	if (invrepl.hasOwnProperty(r)) {
	    while (output.indexOf(r) > -1) { 
		output = output.replace(r, invrepl[r]);
	    }
	}
    }
    return output;
}

var expression = document.getElementById("expr");
var operators = ["(", ")", "&oplus;", "&rarr;", "&harr;", "&and;", "&or;", "&not;"];

function updateVariables() {
    clearTree();
    var present = [];
    var raw = expression.innerHTML.replace('&nbsp;', ' ');
    raw = raw.replace('<br>', ' '); // firefox de la nada mete esos al campo en el 4208
    var spaced = '';
    for (var i = 0; i < raw.length; i++) {
	var c = raw.charAt(i);
	if (c !== " ") {
	    spaced += c + " ";
	} 
    }
    spaced = spaced.trim();
    expression.innerHTML = spaced;
    var tokens = utf2html(spaced).split(" ");
    while (tokens.length > 0) {
	var token = tokens.shift(); 
	if (operators.indexOf(token) == -1) { // non-operators are variables
	    present.push(token);
	}
    }
    var variables = document.getElementById("vars");
    var existing = variables.options;
    if (existing !== undefined) { // if there are some already
	var i = 0;
	while (i < existing.length) {
	    if (present.indexOf(existing[i].value) == -1) { // not used
		variables.remove(i);
	    } else {
		i++;
	    }
	}
    }
    while (present.length > 0) {
	var curr = present.shift();
	if (!optionExists(curr, variables)) {
	    var opt = document.createElement("option");
	    opt.text = curr;
	    variables.add(opt);
	}
    }
}

updateVariables();

function clearTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("msg").innerHTML = '';
}

// https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
	&& typeof document.createRange != "undefined") {
	var range = document.createRange();
	range.selectNodeContents(el);
	range.collapse(false);
	var sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
	var textRange = document.body.createTextRange();
	textRange.moveToElementText(el);
	textRange.collapse(false);
	textRange.select();
    }
}

// var first = true;
// expression.addEventListener('focus',
//			    function() {
//				if (first) {
//				    expression.innerHTML = "";
//				    first = false;
//				}
//			    }, false);

// https://stackoverflow.com/questions/31280209/restrict-certain-characters-in-textarea-input
expression.addEventListener('keypress',
			    function (event) {
				// document.getElementById("debug").innerHTML += event.keyCode + "<br>";
				var code = event.keyCode || event.which;
				if (code != 8 && (code < 97 || code > 122)) {
				    event.preventDefault();
			 	}
			    }
			   );

// https://stackoverflow.com/questions/10588607/tutorial-for-html5-dragdrop-sortable-list
var _el; 

function dragOver(e) {
    if (isBefore(_el, e.target))
	e.target.parentNode.insertBefore(_el, e.target);
    else
	e.target.parentNode.insertBefore(_el, e.target.nextSibling);
    clearTree();
}

function dragStart(e) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", null); 
    _el = e.target;
}

function isBefore(el1, el2) {
    if (el2.parentNode === el1.parentNode)
	for (var cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
	    if (cur === el2)
		return true;
    return false;
}

// own code

var dictionary = {"open": "(", "close": ")",
		  "xor": "&oplus;",
		  "impl": "&rarr;", "equi": "&harr;",
		  "and": "&and;", "or": "&or;",
		  "not": "&not;"};

function putSymbol(event) {
    var source = event.target || event.srcElement;
    var repr = dictionary[source.id.split("_")[1]];
    // document.getElementById("debug").innerHTML += source.id + " " + repr  + "<br>";
    expression.innerHTML += " " + repr + " ";
    updateVariables();
}

function precedence(curr, stack) {
    // document.getElementById("debug").innerHTML = "precedencia entre " + curr + " y " + last + "<br/>";	        
    if (stack.length > 0) { 
	var last = stack[stack.length - 1];
	if (curr === last) {
	    return false; 
	}
	var order = document.getElementById("prec").getElementsByTagName("li");
	for (var i = 0; i < order.length; i++) {
	    var op = utf2html(order[i].innerText);
	    // document.getElementById("debug").innerHTML += "comparando " + curr + " y " + last + " con " + op + "<br/>";	    
	    if (op == curr) {
		// document.getElementById("debug").innerHTML +=  curr + " le gana a  " + last + "<br/>";	    		
		return true;
	    } else if (op == last) {
		// document.getElementById("debug").innerHTML += curr + " le pierde a " + last + "<br/>";	    		
		return false;
	    }
	}
	document.getElementById("debug").innerHTML = "orden de precedencia entre " + curr + " y " + last + "desconocido<br/>";
	return null;
    } 
    return false;
} 

function isTrue(token) {
    if (token === "1" || token === "0") {
	return token;
    }
    var opts = document.getElementById("vars").options;
    if (opts == undefined) {
 	return "0";
    }
    for (var i = 0; i < opts.length; i++) {
	if (opts[i].text === token) {
	    if (opts[i].selected) {
		return "1";
	    } else {
		return "0";
	    }
	}
    }
    return null;
}


// https://www.tutorialspoint.com/data_structures_algorithms/expression_parsing_using_statck.htm

function postfix() {
    var result = [];
    var stack = [];
    var tokens = utf2html(expression.innerHTML).split(" ");
    while (tokens.length > 0) {
	var token = tokens.shift(); 
	if (operators.indexOf(token) == -1) {
	    // document.getElementById("debug").innerHTML += token + " no es un operador<br/>";		    
	    result.push(token);
	} else {
	    if (token === "(") {
		stack.push(token);
	    } else { 
		if (token === ")") {
		    while (stack.length > 0) { 
			siguiente = stack.pop();
			if (siguiente === "(") { 
			    break;
			} else { 
			    result.push(siguiente);
			}
			if (stack.length == 0) { 
			    unfreeze();
			    return null;
			}
		    }
		} else {
		    // document.getElementById("debug").innerHTML += "procesando " + token + "<br/>";
	    	    if (precedence(token, stack)) { 
			stack.push(token);
			// document.getElementById("debug").innerHTML += token + " entra al stack<br/>";		    			
		    } else { 
			while (stack.length > 0 && !precedence(token, stack)) { // remove the ones with higher priority
			    result.push(stack.pop());
			    // document.getElementById("debug").innerHTML += result[result.length - 1] + " sale del stack<br/>";
			}
			stack.push(token);
		    }
		}
	    }
	}
    }
    // document.getElementById("debug").innerHTML += "stack contiene " + stack + " al final<br/>";    
    stack.reverse()
    return result.concat(stack);    
}

// own code

function valor(a, b, op) {
    if (op === "&and;") { 
	if (a === "1" && b === "1") { 
	    return "1";
	} else { 
	    return "0";
	}
    } else if (op === "&oplus;") { 
	if (!(a === b)) {
	    return "1";
	} else {
	    return "0";
	}
    } else if (op === "&harr;") { 
	if (a === b) { 
	    return "1";
	} else { 
	    return "0";
	}
    } else if (op === "&or;") { 
	if (a === "1" || b === "1") { 
	    return "1";
	} else { 
	    return "0";
	}
    } else if (op === "&rarr;") { 
	if (a === "0" || b === "1") { 
	    return "1";
	} else { 
	    return "0";
	}
    } 
    return null; // operacion no reconocida
}

function unfreeze() {
    alert("Revisa la entrada, le sobran o faltan cosas para poder evaluarla.");    
    expr.setAttribute("contenteditable", true);
    document.getElementById("fr").disabled = false;
    document.getElementById("put_not").disabled = false;
    document.getElementById("put_and").disabled = false;
    document.getElementById("put_or").disabled = false;
    document.getElementById("put_xor").disabled = false;
    document.getElementById("put_impl").disabled = false;
    document.getElementById("put_equi").disabled = false;
    document.getElementById("put_open").disabled = false;
    document.getElementById("put_close").disabled = false;
    document.getElementById("eval").disabled = true;

}

function freeze() {
    updateVariables();
    expr.setAttribute("contenteditable", false);
    document.getElementById("fr").disabled = true;
    document.getElementById("put_not").disabled = true;
    document.getElementById("put_and").disabled = true;
    document.getElementById("put_or").disabled = true;
    document.getElementById("put_xor").disabled = true;
    document.getElementById("put_impl").disabled = true;
    document.getElementById("put_equi").disabled = true;
    document.getElementById("put_open").disabled = true;
    document.getElementById("put_close").disabled = true;
    document.getElementById("eval").disabled = false;
}



// modified from https://www.tutorialspoint.com/data_structures_algorithms/expression_parsing_using_statck.htm

function process() {
    var pfe = postfix();
    if (pfe === null) {
	return; 
    }
    var stack = [];
    while (pfe.length > 0) { 
	if (operators.indexOf(pfe[0]) == -1)  {
	    var t = pfe.shift();
	    stack.push(t);
	    var value = isTrue(t);
	    if (value === null) {
		unfreeze();
		return null;
	    }
	    document.getElementById("msg").innerHTML += t + " = " + value + "<br/>";	    
	} else { 
	    var oper = pfe.shift();
	    if (oper === "&not;") {
		var t = stack.pop();
		var v = isTrue(t);
		if (v === null) {
		    unfreeze();
		    return;
		}
		if (v === "1") { 
		    document.getElementById("msg").innerHTML += "&not; 1 = 0<br/>";
		    stack.push("0");
		} else if (v == "0") {
		    document.getElementById("msg").innerHTML += "&not; 0 = 1<br/>";
		    stack.push("1");
		} else {
		    document.getElementById("msg").innerHTML = v + "no es binario y no se puede proceder<br/>";
		    return null;
		}
	    } else {
		if (stack.length < 2) {
		    unfreeze();
		    return;
		}
		var tr = stack.pop();
		var right = isTrue(tr);
		if (right === null) {
		    unfreeze();		    
		    return;
		}		
		var tl = stack.pop();
		var left = isTrue(tl);
		if (left === null) {
		    unfreeze();
		    return;
		}				
		stack.push(valor(left, right, oper));
		document.getElementById("msg").innerHTML += left + " " + oper + " " + right + " = " + stack[stack.length - 1] + '<br/>';
	    }
	}
    }
    var res = stack.pop();
    document.getElementById("msg").innerHTML += "La expresi&oacute;n " + expression.innerHTML + " vale " + res + ".<br/>";
    draw(tree(res));
}

var counter = 0;

function tree(latest) {
    counter = 0;
    var pfe = postfix();
    var stack = [];
    var nodes = {};
    while (pfe.length > 0) { 
	if (operators.indexOf(pfe[0]) == -1)  { // variable
	    var t = pfe.shift();
	    var id = counter++;
	    var v = isTrue(t);
	    var node = {'height': 0, 'label': t, 'value': v, 'id': id, 'children': [], 'width': 1}; // leaf
	    nodes[id] = node;
	    stack.push(node);
	} else { 
	    var oper = pfe.shift();
	    if (oper === "&not;") {
		var node = stack.pop();
		var v = node.value;
		var id = counter++;
		if (v === "1") {
		    var node = {'height': node.height + 1, 'label': oper, 'value': "0", 'id': id, 'children': [node.id], 'width': 1};
		    stack.push(node);
		    nodes[id] = node;
		} else if (v == "0") {
		    var node = {'height': node.height + 1, 'label': oper, 'value': "1", 'id': id, 'children': [node.id], 'width': 1};	
		    stack.push(node);
		    nodes[id] = node;		    
		}
	    } else {
		var nr = stack.pop();
		var right = nr.value;
		var nl = stack.pop();
		var left = nl.value;
		var v = valor(left, right, oper);
		var id = counter++;
		var h = Math.max(nr.height, nl.height) + 1;
		var node = {'height': h, 'label': oper, 'value': v, 'id': id, 'children': [nl.id, nr.id], 'width': 1};
		if (h > 1) {
		    if (nr.height == 0) {
			nr.height = h - 1;
		    } else if (nl.height == 0) {
			nl.height = h - 1;
		    }
		}				     
		stack.push(node);
		nodes[id] = node;		    		
	    }
	}
    }
    var node = stack.pop();
    if (node.value !== latest) {
	document.getElementById("debug").innerHTML += "Hay bronca con el &aacute;rbol que vale" + node.value + "<br/>";
    }
    return nodes;
}

var COLORS = {"0": "#e74c3c", "1": "#16a085"}; 

function drawNodes(nodes, curr, r) {
    var cc = curr.children.length;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = COLORS[curr.value];
    if (curr.value == "0") {
	ctx.setLineDash([5, 3]);
    }
    ctx.beginPath();
    if (cc == 0) {
	ctx.rect(curr.x - r, curr.y - r, 2 * r, 2 * r);
    } else {
	ctx.arc(curr.x, curr.y, r, 0, 2 * Math.PI);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);    
    ctx.fillStyle = "#000000";
    ctx.fillText(html2utf(curr.label), curr.x, curr.y + 8);
    for (var i = 0; i < cc; i++) {
	var child = curr.children[i];
	drawNodes(nodes, nodes[child], r);
    }
}

function drawEdges(nodes, curr, sx, sy, aw, unit) {
    var cc = curr.children.length;
    curr.x = sx + (aw / 2);     
    curr.y = sy + (unit / 2);
    if (cc > 0) {
	sy += unit;
	for (var i = 0; i < cc; i++) {
	    var child = nodes[curr.children[i]];
	    var dw = unit * child.width;
	    drawEdges(nodes, child, sx, sy, dw, unit);
	    sx += dw;
	    if (i == 0 && cc == 2) { 
		curr.x = sx; 
	    }
	    ctx.beginPath();
	    ctx.moveTo(curr.x, curr.y);
	    ctx.lineTo(child.x, child.y);
	    ctx.closePath();
	    ctx.stroke();
	}
    }
}

function updateWidth(curr, nodes) {
    var cc = curr.children.length;
    if (cc > 0) {
	var total = 0;
	for (var i = 0; i < cc; i++) {
	    var child = nodes[curr.children[i]];
	    total += updateWidth(child, nodes);
	}
	curr.width = total;
	return total;
    }
    return curr.width;
}

function draw(nodes) {
    var tallest = 0;
    var i = counter;
    var root = null;
    while (i--) {
	var nh = nodes[i].height;
	if (nh > tallest) {
	    tallest = nh;
	    root = nodes[i];
	}
    }
    var tw = updateWidth(root, nodes);
    var MARGIN = 10;
    var d = 70;
    var w = d * tw + 2 * MARGIN;
    var h = d * (tallest + 1) + 2 * MARGIN;
    canvas.width = w;
    canvas.height = h;
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    drawEdges(nodes, root, MARGIN, MARGIN, w - 2 * MARGIN, d);
    ctx.font = "20px Verdana";
    ctx.textAlign = "center"; 
    drawNodes(nodes, root, 15);
}    


