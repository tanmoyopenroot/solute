export default {
  props: {
    elements: {
      required: true,
      type: Array,
    },
  },
  methods: {
    handleOnClick(e) {
      this.$emit('onClick', e);
    },
  },
  render() {
    return (
      <ul>
        {this.props.elements.map((value, index) => {
          return <li key={index}>{value}</li>;
        })}
      </ul>
    );
  },
};
