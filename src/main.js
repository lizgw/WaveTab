// page elements
var textDisplay = document.getElementById("text-display");
var timeElem = document.getElementById("time");
var dateElem = document.getElementById("date");
var container = document.getElementById("container");
var optionsElem = document.getElementById("options");

// flags
var showingOptions = false;
var showWelcomeMsg = true;
var debug = false;

// colors
var randNum = 0;

// storage object for options
var options = {};

function updateTime() {
	chrome.storage.local.get("use24HourTime", function(items) {
		if (!items.use24HourTime) {
			timeElem.textContent = moment().format("h:mm A");
		} else {
			timeElem.textContent = moment().format("HH:mm");
		}
	});
}

function updateDate() {
	dateElem.textContent = moment().format("dddd, MMMM Do, YYYY");
}

function pickColors(num)
{
	// make sure it exists already
	if (gradientData != undefined)
	{
		if (!debug) {
			// pick a random gradient from the array
			randNum = Math.floor(Math.random() * gradientData.default.length);
		}
		else {
			// use the one that was passed in
			randNum = num;
		}

		var colorString = "";
		var colorArray = gradientData.default[randNum].colors;
		// for each item (color) in the array...
		for (var color = 0; color < colorArray.length; color++) {
			// add the color to the string
			colorString += colorArray[color];

			// if this is NOT the last color...
			if (color != colorArray.length - 1) {
				// add a comma before the next one
				colorString += ", ";
			}
		}

		container.style.background = "linear-gradient(45deg, " + colorString + ")";
		container.style.backgroundSize = "600% 600%";
		container.style.animation = "Animation 25s ease-in-out infinite";
	}
}

function hideWelcomeMessage() {
	document.getElementById("welcomeMsg").style.display = "none";
}

// when the page loads, do all this stuff
document.addEventListener("DOMContentLoaded", function() {
	// set up event listeners for checkboxes
	var checkboxes = document.querySelectorAll("input[type='checkbox']");
	for (var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].onchange = updatePrefs;
	}

	// setup event listeners for radio buttons
	var radioBtns = document.querySelectorAll("input[type='radio']");
	for (var i = 0; i < radioBtns.length; i++) {
		radioBtns[i].onchange = switchTab;

		// set first radio button as checked
		if (i == 0)
			radioBtns[i].checked = true;
		else
			radioBtns[i].checked = false;
	}

	// setup event listeners for buttons
	document.getElementById("info-icon").onclick = toggleOptions;
	document.getElementById("close-icon").onclick = toggleOptions;
	document.getElementById("close-welcome").onclick = hideWelcomeMessage;

	// add event listener for when storage changes
	chrome.storage.onChanged.addListener(updateDisplay);

	restoreOptions();

	setInterval(updateTime, 999);
	setInterval(updateDate, 1500);

	updateTime();
	updateDate();

	readFile();


	// show welcome message if necessary
	//chrome.storage.sync.clear(); // test line to clear storage & see msg again
	chrome.storage.local.get({
		showWelcomeMsg: true
	}, function (items) {
		if (items.showWelcomeMsg) {
			document.getElementById("welcomeMsg").style.display = "block";
			chrome.storage.local.set({showWelcomeMsg: false});
		}
	});
});
