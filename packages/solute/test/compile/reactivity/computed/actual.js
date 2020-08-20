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
		}
	};
};

const getWatchers = () => {
	return {};
};

const createIfBlock3 = () => {
	let text9;

	return {
		create() {
			text9 = text("'time'");
		},
		mount() {
			append(target, text9)
		},
		update(dirty) {
			
		}
	};
};

const createIfBlock4 = () => {
	let text10;

	return {
		create() {
			text10 = text("'times'");
		},
		mount() {
			append(target, text10)
		},
		update(dirty) {
			
		}
	};
};

const createFragment = () => {
	let fragment1;
	let text8;
	let button1;
	let ifBlock2;
	let text11;
	let div3;
	let text12;
	let text13;
	let text14;
	let text15;
	let text16;
	let text17;

	return {
		create() {
			fragment1 = createElement("fragment");
			text8 = text("\n        ");
			button1 = createElement("button");
			ifBlock2 = this.count === 1 ? createIfBlock3() : createIfBlock4();
			ifBlock2 && ifBlock2.create.call(this);
			text11 = text("\n        ");
			div3 = createElement("div");
			text12 = text("\n          ");
			text13 = text(this.count);
			text14 = text(" * 2 = ");
			text15 = text(this.doubled);
			text16 = text("\n        ");
			text17 = text("\n      ");
		},
		mount() {
			append(target, fragment1)
			append(fragment1, text8)
			append(fragment1, button1)
			append(button1, ifBlock2)
			append(fragment1, text11)
			append(fragment1, div3)
			append(div3, text12)
			append(div3, text13)
			append(div3, text14)
			append(div3, text15)
			append(div3, text16)
			append(fragment1, text17)
		},
		update(dirty) {
			if (dirty === "count") {
				setTextData(text13, this.count);
			}

			if (dirty === "doubled") {
				setTextData(text15, this.doubled);
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