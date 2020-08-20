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

const createIfBlock5 = () => {
	let text18;

	return {
		create() {
			text18 = text("'time'");
		},
		mount() {
			append(target, text18)
		},
		update(dirty) {
			
		}
	};
};

const createIfBlock6 = () => {
	let text19;

	return {
		create() {
			text19 = text("'times'");
		},
		mount() {
			append(target, text19)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let button2;
	let ifBlock3;

	return {
		create() {
			button2 = createElement("button");
			ifBlock3 = this.count === 1 ? createIfBlock5() : createIfBlock6();
			ifBlock3 && ifBlock3.create.call(this);
		},
		mount() {
			append(target, button2)
			append(button2, ifBlock3)
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