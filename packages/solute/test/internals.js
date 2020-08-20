// Internals
export const append = (target, node) => {
  target.appendChild(node);
};

export const insert = (target, node) => {
  target.insertBefore(node, null);
};

export const detach = node => {
  node.parentNode.removeChild(node);
};

export const createElement = name => {
  return document.createElement(name);
};

export const setTextData = (text, data) => {
  data = '' + data;
  if (text.data !== data) text.data = data;
};

export const text = data => {
  return document.createTextNode(data);
};

export const listen = (node, event, handler) => {
  node.addEventListener(event, handler);
  return () => node.removeEventListener(event, handler);
};

export const isNotEqual = (value1, value2) => value1 !== value2;

let flushing = false;

const flush = () => {
  if (flushing) {
    return;
  }

  flushing = true;

  do {
    for (let i = 0; i < dirtyComponents.length; i += 1) {
      const { component, key } = dirtyComponents[i];
      update(component, key);
    }

    dirtyComponents.length = 0;
  } while (dirtyComponents.length);

  update_scheduled = false;
  flushing = false;
};

function update(component, key) {
  if (component.fragment) {
    component.fragment.update.call(component.instance, key);
  }
}

const resolvedPromise = Promise.resolve();
let update_scheduled = false;

const scheduleUpdate = () => {
  if (!update_scheduled) {
    update_scheduled = true;
    resolvedPromise.then(flush);
  }
};

const dirtyComponents = [];

const makeComponentDirty = (component, key) => {
  dirtyComponents.push({ component, key });
  scheduleUpdate();
};

export class SoluteComponent {
  init(options, { state, computed, methods, watch }, createFragment) {
    this.options = options;
    this.fragment = createFragment();

    const props = this.options.props || {};
    this.instance = {
      props: {
        ...props
      },
      ...state,
      ...computed,
      ...methods,
      watch: {
        ...watch
      }
    };

    this.createComponent();
    this.mountComponent();
  }

  createComponent() {
    if (this.fragment) {
      this.fragment.create.call(this.instance);
    }
  }

  mountComponent() {
    if (this.fragment && this.options.target) {
      this.fragment.mount.call(this.instance, this.options.target);
    }
  }

  setState(key) {
    makeComponentDirty(this, key);

    if (this.instance.watch[key]) {
      this.instance.watch[key].call(this.instance);
    }
  }
}
