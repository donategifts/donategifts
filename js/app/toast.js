((ns) => {
	ns.Toast = class Toast {
		constructor(config = {}) {
			this.defaultConfig = $.extend(
				{},
				{
					toast: '#toast',
				},
				config,
			);

			this._toast = this.defaultConfig.toast;
			this._toastInstance = this.setToastInstance();
		}

		show(message, style) {
			if (message) {
				$(this._toast).find($('.toast-body')).text(message);
			}

			$(this._toast).addClass(style || Toast.styleMap.success);

			if (this._toastInstance) {
				this._toastInstance.show();
			} else {
				console.error('Toast instance is not set');
			}
		}

		setToastInstance() {
			return bootstrap.Toast.getOrCreateInstance(this._toast);
		}

		set toast(value) {
			this._toast = value;
			this._toastInstance = this.setToastInstance();
		}

		get styleMap() {
			return Toast.styleMap;
		}

		static get styleMap() {
			return {
				primary: 'bg-primary',
				secondary: 'bg-secondary',
				success: 'bg-success',
				danger: 'bg-danger',
				warning: 'bg-warning',
				info: 'bg-info',
			};
		}
	};
})((window.DG = window.DG || {}));
