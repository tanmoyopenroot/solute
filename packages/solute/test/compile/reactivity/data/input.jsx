export default {
  data: {
    count: 0,
  },
  methods: {
    handleClick() {
      this.count += 1;
    },
  },
  render() {
    return <button onClick={this.handleClick}>{this.count === 1 ? 'time' : 'times'}</button>;
  },
};
