export default {
  data: {
    count: 0,
  },
  render() {
    return <div>{this.count === 1 ? 'time' : 'times'}</div>;
  },
};
