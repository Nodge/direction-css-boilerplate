'use strict';

(function($) {
	// Default settings for dialogs
	$.ui.dialog.prototype.options.autoReposition = true;
	$.ui.dialog.prototype.options.closeText = 'Закрыть';
	$.ui.dialog.prototype.options.draggable = false;
	$.ui.dialog.prototype.options.resizable = false;

	$(window).resize(function() {
		$('.ui-dialog-content:visible').each(function() {
			var options = $(this).dialog('option');
			if (options && options.autoReposition) {
				$(this).dialog('option', 'position', options.position);
			}
		});
	});
})(jQuery);