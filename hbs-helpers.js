'use strict';

module.exports.register = function(Handlebars, options) {
	/*Handlebars.registerHelper('dynPartial', function (template, context, opts)  {
		template = template.replace(/\//g, '_');
		var f = Handlebars.partials[template];
		if (!f) {
			return "Partial not loaded";
		}
		return new Handlebars.SafeString(f(context));
	});*/


	Handlebars.registerHelper('formatNumber', function(value) {
		return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ');
	});

	Handlebars.registerHelper('isEven', function(conditional, options) {
		if((conditional % 2) === 0) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper('indent', function(indent, options) {
		var content = options.fn(this),
			sep = new Array( indent + 1 ).join(' ');

		content = String(content)
			.split("\n")
			.join("\n" + sep);

		return content;
	});
};