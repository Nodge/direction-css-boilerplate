'use strict';

(function($, window, document, undefined) {
	/**
	 * Default options
	 * @type {{}}
	 */
	var defaults = {
		selector: '.vertical-resizer__block',
		alsoResize: null,
		cols: null,
		processedClass: 'vertical-resizer__block_processed',
		once: false,
		onResize: $.noop,
		onResizeItem: $.noop,
		onCleanup: $.noop
	};

	function Resizer(element, options) {
		this.$el = $(element);
		this.options = options;
		this.$items = $();
		this._windowResize = null;
		this._delayedResize = null;

		this._init();
	}

	Resizer.prototype = {
		/**
		 *
		 * @private
		 */
		_init: function() {
			this.options = $.extend(true, {}, defaults, this.options);
			this.rescan();

			var resize = this._delayedResize = this.throttle(250, this.resize, true);
			resize = $.proxy(resize, this);

			this._windowResize = function(e) {
				if (e.target === window) {
					resize();
				}
			};

			if (this.options.once) {
				$(window)
					.once('load', resize)
					.once('fontactive', resize);
			}
			else {
				$(window)
					.on('resize', this._windowResize)
					.on('load', resize)
					.on('fontactive', resize);

				$.data(this.$el, 'plugin_verticalResizer', this);
			}
		},

		/**
		 *
		 */
		rescan: function() {
			this.$items = this.$el.find(this.options.selector);
			this.resize();
		},

		/**
		 *
		 */
		resize: function() {
			this._clenupItems();

			var count = this.$items.length,
				cols = this.options.cols ? this.options.cols : count,
				i = 0,
				height = 0,
				$rowItems = $(),
				options = this.options;

			this.$items.each(function(index) {
				var $item = $(this);

				i++;
				$rowItems = $rowItems.add($item);
				height = Math.max(height, $item.outerHeight());

				if (i === cols || index === count - 1) {
					$rowItems.each(function() {
						var $item = $(this);

						$item
							.addClass(options.processedClass)
							.css({ height: height });

						if (options.alsoResize) {
							$item
								.find(options.alsoResize)
								.css({ height: height });
						}

						options.onResizeItem($item, height);
					});

					i = 0;
					height = 0;
					$rowItems = $();
				}
			});

			options.onResize(this.$items);
		},

		/**
		 *
		 */
		destroy: function() {
			this._clenupItems();

			$(window)
				.off('resize', this._windowResize)
				.off('load', this._delayedResize)
				.off('fontactive', this._delayedResize);

			$.data(this.$el, 'plugin_verticalResizer', null);
		},

		/**
		 *
		 * @private
		 */
		_clenupItems: function() {
			this.$items
				.removeClass(this.options.processedClass)
				.css({ height: '' });

			if (this.options.alsoResize) {
				this.$items
					.find(this.options.alsoResize)
					.css({ height: '' });
			}

			this.options.onCleanup(this.$items);
		},

		/**
		 *
		 * @param delay
		 * @param callback
		 * @param trailing
		 * @returns {wrapper}
		 */
		throttle: function(delay, callback, trailing) {
			var allow = true,
				call = false,
				wrapper;

			if (trailing == null) {
				trailing = true;
			}

			wrapper = function() {
				var context = this,
					args = arguments;

				if (allow) {
					allow = false;
					call = false;

					setTimeout(function() {
						allow = true;

						if (call) {
							wrapper.apply(context, args);
						}
					}, delay);

					callback.apply(context, args);
				}
				else {
					call = trailing;
				}
			};

			return wrapper;
		}
	};

	// jQuery plugin definition
	$.fn.verticalResizer = function(options) {
		var args = Array.prototype.slice.apply(arguments);

		this.each(function() {
			if (typeof options === 'string') {
				if (options.length > 1 && options[0] !== '_') {
					var plugin = $.data(this, 'plugin_verticalResizer');
					if (plugin) {
						args.shift();
						plugin[options].apply(plugin, args);
					}
				}
			}
			else {
				if (!$.data(this, 'plugin_verticalResizer')) {
					new Resizer(this, options);
				}
			}
		});

		// chain jQuery functions
		return this;
	};
})(jQuery, window, document);
