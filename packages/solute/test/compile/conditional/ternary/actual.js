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

const createIfBlock10 = () => {
	let div6;
	let text38;

	return {
		create() {
			div6 = createElement("div");
			text38 = text("ODD");
		},
		mount() {
			append(target, div6)
			append(div6, text38)
		},
		update(dirty) {
			
		}
	};
};

const createIfBlock11 = () => {
	let div7;
	let text39;

	return {
		create() {
			div7 = createElement("div");
			text39 = text("EVEN");
		},
		mount() {
			append(target, div7)
			append(div7, text39)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let fragment4;
	let text35;
	let button5;
	let text36;
	let text37;
	let ifBlock6;
	let text40;

	return {
		create() {
			fragment4 = createElement("fragment");
			text35 = text("\n        ");
			button5 = createElement("button");
			text36 = text("Counter");
			text37 = text("\n        ");
			ifBlock6 = this.count % 2 ? createIfBlock10() : createIfBlock11();
			ifBlock6 && ifBlock6.create.call(this);
			text40 = text("\n      ");
		},
		mount() {
			append(target, fragment4)
			append(fragment4, text35)
			append(fragment4, button5)
			append(button5, text36)
			append(fragment4, text37)
			append(fragment4, ifBlock6)
			append(fragment4, text40)
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