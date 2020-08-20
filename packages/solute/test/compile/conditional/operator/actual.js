const getState = () => {
	return { count: 0 };
};

const getComputed = () => {
	return {};
};

const getMethods = () => {
	return {
		handleClick() {
			this.$setState("count", () => {
				this.count += 1;
			})
		}
	};
};

const getWatchers = () => {
	return {};
};

const createIfBlock9 = () => {
	let div5;
	let text33;

	return {
		create() {
			div5 = createElement("div");
			text33 = text("ODD");
		},
		mount() {
			append(target, div5)
			append(div5, text33)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let fragment3;
	let text30;
	let button4;
	let text31;
	let text32;
	let ifBlock5;
	let text34;

	return {
		create() {
			fragment3 = createElement("fragment");
			text30 = text("\n        ");
			button4 = createElement("button");
			text31 = text("Counter");
			text32 = text("\n        ");
			ifBlock5 = this.count % 2 && createIfBlock9();
			ifBlock5 && ifBlock5.create.call(this);
			text34 = text("\n      ");
		},
		mount() {
			append(target, fragment3)
			append(fragment3, text30)
			append(fragment3, button4)
			append(button4, text31)
			append(fragment3, text32)
			ifBlock5 && ifBlock5.mount.call(this, fragment3)
			append(fragment3, text34)
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