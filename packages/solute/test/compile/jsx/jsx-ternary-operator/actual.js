const getState = () => {
	return { count: 0 };
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

const createIfBlock1 = () => {
	let text6;

	return {
		create() {
			text6 = text("'time'");
		},
		mount() {
			append(target, text6)
		},
		update(dirty) {
			
		}
	};
};

const createIfBlock2 = () => {
	let text7;

	return {
		create() {
			text7 = text("'times'");
		},
		mount() {
			append(target, text7)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let div2;
	let ifBlock1;

	return {
		create() {
			div2 = createElement("div");
			ifBlock1 = this.count === 1 ? createIfBlock1() : createIfBlock2();
			ifBlock1 && ifBlock1.create.call(this);
		},
		mount() {
			append(target, div2)
			append(div2, ifBlock1)
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