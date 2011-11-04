exports.drawgrid = function(gridspacing, win, color) {
	// gridspacing = integer
	// win = window to which the grid will be added
	// color = optional color for lines
	var clr = (color) ? color : '#dedede';
	var numhoriz = Math.ceil(Ti.Platform.displayCaps.platformHeight / gridspacing);
	var numvert = Math.ceil(Ti.Platform.displayCaps.platformWidth / gridspacing);
	for( h = 0; h < numhoriz; h++) {
		var hline = Ti.UI.createView({
			height : 1,
			width : '100%',
			backgroundColor : clr,
			top : h * gridspacing,
			left : 0
		});
		win.add(hline);
	}
	for( v = 0; v < numvert; v++) {
		var vline = Ti.UI.createView({
			width : 1,
			height : '100%',
			backgroundColor : clr,
			left : v * gridspacing,
			top : 0
		});
		win.add(vline);
	}
}