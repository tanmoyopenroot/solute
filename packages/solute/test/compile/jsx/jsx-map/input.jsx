export default {
  data: {
    list: ['item 1', 'item 2', 'item 3', 'item 4'],
  },
  render() {
    return (
      <div>
        <ul>
          {this.props.elements.map((value, index) => {
            return <li key={index}>{value}</li>;
          })}
        </ul>
      </div>
    );
  },
};
