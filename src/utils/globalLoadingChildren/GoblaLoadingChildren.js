import { withStyles } from '@material-ui/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './styles';

class GoblaLoadingChildren extends Component {
  render() {
    const { classes, loading } = this.props;
    
    if (loading)
      return (
        <div className={classes.globalLoading}>
          {loading}
          <img
            src="/images/gif-leaf-loading-gif-MAIN.gif"
            alt="loading"
            className={classes.icon}></img>
        </div>
      );
    else return null;
  }
}
const mapStateToProps = state => {
  return { loading: state.childrenLoading };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};
export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(GoblaLoadingChildren)
);
