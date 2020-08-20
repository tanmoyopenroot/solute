const getState = () => {
	return {
		list: ["item 1", "item 2", "item 3", "item 4"]
	};
};

const getComputed = () => {
	return {};
};

const getMethods = () => {
	return {};
};

const getWatchers = () => {
	return {};
};

const createCallBlock1 = () => {
	let li1;
	let text3;

	return {
		create() {
			li1 = createElement("li");
			text3 = text(value);
		},
		mount() {
			append(target, li1)
			append(li1, text3)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let div1;
	let text1;
	let ul1;
	let text2;
	let callBlock1;
	let text4;
	let text5;

	return {
		create() {
			div1 = createElement("div");
			text1 = text("\n        ");
			ul1 = createElement("ul");
			text2 = text("\n          ");
			callBlock1 = Array.isArray(this.props.elements) && createCallBlock1()
			callBlock1 && callBlock1.create.call(this)
			text4 = text("\n        ");
			text5 = text("\n      ");
		},
		mount() {
			append(target, div1)
			append(div1, text1)
			append(div1, ul1)
			append(ul1, text2)

			Array.isArray(this.props.elements) && callBlock1.forEach(block => {
				block.mount.call(this, ul1);
			})

			append(ul1, text4)
			append(div1, text5)
		},
		update(dirty) {
			
		}
	};
};

class AnonymousComponent extends SoluteComponent {
	constructor(options) {
		super();

		this.init(
			options,
			{
				state: getState(),
				computed: getComputed(),
				methods: getMethods(),
				watch: getWatchers()
			},
			createFragment
		);
	}
}