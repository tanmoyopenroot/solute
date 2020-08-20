import {
  createElement,
  text,
  insert,
  append,
  listen,
  detach,
  isNotEqual,
  setTextData,
  SoluteComponent
} from './internals';

// Main
const count = ' static-count ';

const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const createLoopBlock1 = () => {
  let li1;
  let text1;
  let value1;
  let text2;
  let text3;
  let value2;

  return {
    create(value, index) {
      li1 = createElement('li');
      value1 = index;
      text1 = text(value1);
      text2 = text(' - ');
      value2 = value;
      text3 = text(value2);
    },
    mount(target) {
      insert(target, li1);
      append(li1, text1);
      append(li1, text2);
      append(li1, text3);
    },
    update(dirty, value, index) {
      if (dirty === 'list') {
        if (isNotEqual(index, value1)) {
          value1 = index;
          setTextData(text1, value1);
        }
        if (isNotEqual(value, value2)) {
          value2 = value;
          setTextData(text3, value2);
        }
      }
    },
    destroy() {
      detach(li1);
    }
  };
};

const createIfBlock1 = () => {
  let div1;
  let text1;

  return {
    create() {
      div1 = createElement('div');
      text1 = text(this.count);
    },
    mount(target) {
      insert(target, div1);
      append(div1, text1);
    },
    update(dirty) {
      if (dirty === 'count') {
        setTextData(text1, this.count);
      }
    },
    destroy() {
      detach(div1);
    }
  };
};

const createFragment = () => {
  let button1;
  let h1;
  let text1;
  let text2;
  let text3;
  let text4;
  let dispose1;
  let ifBlock1;
  let ul1;
  let loopBlock1;

  return {
    create() {
      button1 = createElement('button');
      h1 = createElement('h1');
      text1 = text('The Famous Cats of YouTube ');
      text2 = text(this.count);
      text3 = text(count);
      text4 = text(this.plusOne());

      ifBlock1 = this.count % 2 && createIfBlock1();
      ifBlock1 && ifBlock1.create.call(this);

      ul1 = createElement('ul');

      loopBlock1 = this.list.map((value, index) => {
        const block = createLoopBlock1();
        block.create.call(this, value, index);

        return block;
      });
    },
    mount(target) {
      insert(target, button1);
      append(button1, h1);
      append(h1, text1);
      append(h1, text2);
      append(h1, text3);
      append(h1, text4);

      dispose1 = listen(button1, 'click', event => {
        this.handleOnClick(event);
      });

      ifBlock1 && ifBlock1.mount.call(this, target);

      append(target, ul1);
      loopBlock1.forEach(block => {
        block.mount.call(this, ul1);
      });
    },
    update(dirty) {
      console.log('Updating Fragment', dirty);

      if (dirty === 'count') {
        setTextData(text2, this.count);
        setTextData(text4, this.plusOne());
      }

      if (dirty === 'count') {
        if (this.count % 2) {
          if (ifBlock1) {
            ifBlock1.update.call(this, dirty);
          } else {
            ifBlock1 = createIfBlock1();
            ifBlock1 && ifBlock1.create.call(this);
            ifBlock1 && ifBlock1.mount.call(this, target);
          }
        } else {
          ifBlock1 && ifBlock1.destroy();
          ifBlock1 = null;
        }
      }

      if (dirty === 'list') {
        loopBlock1.forEach((block, index) => {
          const value = this.list[index];
          block.update.call(this, dirty, value, index);
        });
      }
    },
    destroy() {
      dispose1();
      ifBlock1 && ifBlock1.destroy();
    }
  };
};

const getState = () => {
  return {
    count: 0,
    list: ['item 1', 'item 2', 'item 3', 'item 4']
  };
};

const getComputed = () => {
  return {
    plusOne() {
      return this.count + 1;
    }
  };
};

const getMethods = component => {
  return {
    handleOnClick() {
      this.count += 1;
      component.setState('count');

      const listLength = this.list.length;
      const index = getRandomArbitrary(0, listLength - 1);

      this.list[index] = `item ${Math.random()}`;
      component.setState('list');
    },
    handleLog(key) {
      console.log(`changed ${key} to ${this[key]}`);
    }
  };
};

const getWatchers = () => {
  return {
    count() {
      this.handleLog('count');
    },
    list() {
      this.handleLog('list');
    }
  };
};

class App extends SoluteComponent {
  constructor(options) {
    super();

    this.init(
      options,
      {
        state: getState(),
        computed: getComputed(this),
        methods: getMethods(this),
        watch: getWatchers(this)
      },
      createFragment
    );
  }
}

const target = document.getElementById('root');

const test = new App({ target });
console.log('Init Data', test.instance);
