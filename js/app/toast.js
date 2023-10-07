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

		show(message, isError = false) {
			if (message) {
				$(this._toast).find('.toast-body').text(message);
			}

			if (isError) {
				$(this._toast).addClass('bg-danger');
			}

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
	};
})((window.DG = window.DG || {}));
