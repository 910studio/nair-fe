// Tracks which discipline card should hold the shared view-transition-name
// during a navigation. Set when leaving (forward click) or arriving on detail
// (so back-nav has a target to morph into), cleared after the transition
// completes so unrelated reflows don't accidentally pin a vt-name.

let _slug = $state<string | null>(null);

export const disciplineTransition = {
	get slug() {
		return _slug;
	},
	arm(slug: string) {
		_slug = slug;
	},
	disarm() {
		_slug = null;
	}
};
