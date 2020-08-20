export default {
  data: {
    count: 0,
  },
  methods: {
    handleClick() {
      this.count += 1;
    },
    handleCountLog(value) {
      console.log(`count changed to ${value}`);
    },
  },
  computed: {
    doubled() {
      return this.count * 2;
    },
  },
  watch: {
    count(value) {
      this.handleCountLog(value);
    },
  },
  render() {
    return (
      <fragment>
        <button onClick={this.handleClick}>{this.count === 1 ? 'time' : 'times'}</button>
        <div>
          {this.count} * 2 = {this.double}
        </div>
      </fragment>
    );
  },
};
