// Shared drawer state — header owns the drawer component, but any page
// can call open() to trigger it (e.g. CTAs that should reveal services).

let _open = $state(false);

export const drawer = {
	get open() {
		return _open;
	},
	set open(v: boolean) {
		_open = v;
	},
	toggle() {
		_open = !_open;
	},
	close() {
		_open = false;
	}
};
