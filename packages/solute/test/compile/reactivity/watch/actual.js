const getState = () => {
	return { count: 0 };
};

const getComputed = () => {
	return {
		doubled() {
			return this.count * 2;
		}
	};
};

const getMethods = () => {
	return {
		handleClick() {
			this.$setState("count", () => {
				this.count += 1;
			})
		},
		handleCountLog(value) {
			console.log(`count changed to ${value}`);
		}
	};
};

const getWatchers = () => {
	return {
		count(value) {
			this.handleCountLog(value);
		}
	};
};

const createIfBlock7 = () => {
	let text21;

	return {
		create() {
			text21 = text("'time'");
		},
		mount() {
			append(target, text21)
		},
		update(dirty) {
			
		}
	};
};

const createIfBlock8 = () => {
	let text22;

	return {
		create() {
			text22 = text("'times'");
		},
		mount() {
			append(target, text22)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let fragment2;
	let text20;
	let button3;
	let ifBlock4;
	let text23;
	let div4;
	let text24;
	let text25;
	let text26;
	let text27;
	let text28;
	let text29;

	return {
		create() {
			fragment2 = createElement("fragment");
			text20 = text("\n        ");
			button3 = createElement("button");
			ifBlock4 = this.count === 1 ? createIfBlock7() : createIfBlock8();
			ifBlock4 && ifBlock4.create.call(this);
			text23 = text("\n        ");
			div4 = createElement("div");
			text24 = text("\n          ");
			text25 = text(this.count);
			text26 = text(" * 2 = ");
			text27 = text(this.double);
			text28 = text("\n        ");
			text29 = text("\n      ");
		},
		mount() {
			append(target, fragment2)
			append(fragment2, text20)
			append(fragment2, button3)
			append(button3, ifBlock4)
			append(fragment2, text23)
			append(fragment2, div4)
			append(div4, text24)
			append(div4, text25)
			append(div4, text26)
			append(div4, text27)
			append(div4, text28)
			append(fragment2, text29)
		},
		update(dirty) {
			if (dirty === "count") {
				setTextData(text25, this.count);
			}
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