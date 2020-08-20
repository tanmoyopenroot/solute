export default {
  data: {
    count: 0,
  },
  methods: {
    handleClick() {
      this.count += 1;
    },
  },
  computed: {
    doubled() {
      return this.count * 2;
    },
  },
  render() {
    return (
      <fragment>
        <button onClick={this.handleClick}>{this.count === 1 ? 'time' : 'times'}</button>
        <div>
          {this.count} * 2 = {this.doubled}
        </div>
      </fragment>
    );
  },
};
