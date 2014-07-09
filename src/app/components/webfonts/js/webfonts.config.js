'use strict';

window.WebFontConfig = {
	google: {
		families: [
//			'PT+Sans:400italic,700italic,800,400,300,700,600:latin,cyrillic',
//			'PT+Sans:400,700:latin,cyrillic',
			'Open+Sans:400,700,400italic:latin,cyrillic'
//			'Ubuntu:400,500,700:latin,cyrillic'
		]
	},
	active: function() {
		$(window).trigger('fontactive');
	}
};

// If the library has been loaded:
if (window.WebFont && window.WebFont.load) {
	window.WebFont.load(window.WebFontConfig);
}

// Async loader:
/*(function() {
 	var wf = document.createElement('script');
 	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
 	wf.type = 'text/javascript';
 	wf.async = 'true';
  	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
})();*/