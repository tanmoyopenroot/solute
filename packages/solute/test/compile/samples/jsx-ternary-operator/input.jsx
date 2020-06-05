export default {
  props: {
    onClick: {
      required: true,
      type: Function,
    },
  },
  methods: {
    handleOnClick(e) {
      this.$emit('onClick', e);
    },
  },
  render() {
    return (
      <button onClick={this.handleOnClick}>
        Clicked {this.count} {this.count === 1 ? 'time' : 'times'}
      </button>
    );
  },
};
