function process() {
    if (document.getElementById('real').checked) {
	document.getElementById('pin').required = true;
	document.getElementById('pin').disabled = false;
	document.getElementById('submit').disabled = false;
	document.getElementById('swap').disabled = true;
	document.getElementById('swap').checked = false;	
    }
    if (document.getElementById('trial').checked) {
	document.getElementById('pin').required = false;
	document.getElementById('pin').disabled = true;
	document.getElementById('swap').disabled = false;
	document.getElementById('submit').disabled = false;
    }
}
