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
    return (
      <fragment>
        <button onClick={this.handleClick}>Counter</button>
        {this.count % 2 ? <div>ODD</div> : <div>EVEN</div>}
      </fragment>
    );
  },
};
