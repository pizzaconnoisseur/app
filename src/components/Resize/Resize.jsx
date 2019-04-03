import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Resize.module.scss';

class Resize extends Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.setRef = this.setRef.bind(this);
    this.state = {
      width: 0,
      height: 0,
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  updateDimensions(s) {
    if (this.container) {
      const boundingRect = this.container.getBoundingClientRect();
      this.setState({
        height: boundingRect.height,
        width: boundingRect.width,
      });
    }

  }

  setRef(parent) {
    this.container = parent;
    if (parent) {
      const boundingRect = this.container.getBoundingClientRect();
      this.setState({
        height: boundingRect.height,
        width: boundingRect.width,
      });
    }

  }

  render() {
    const { children } = this.props;
    const { width, height } = this.state;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, {
        height,
        width,
      })
    );

    return (
      <div className={styles.container}>
        <div ref={this.setRef} className={styles.child}>
          {
            childrenWithProps
          }
        </div>
      </div>
    );
  }
}

Resize.propTypes = {
  size: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

Resize.defaultProps = {
  size: 600
}

export default Resize;
