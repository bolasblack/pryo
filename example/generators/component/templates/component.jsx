const React = require('react')
const {connect} = require('react-redux')

const <%= componentName %> = React.createClass({
  render() {
    return (
      <div>
      </div>
    )
  },
})

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(<%= componentName %>)
