import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BarChart from '../BarChart/BarChart';
import Resize from '../Resize/Resize';
import { views } from '../../redux/config';
import styles from './Widget.module.scss';


class Widget extends Component {
  constructor(props) {
    super(props);
    this.change = this.change.bind(this);
    this.changeFilters = this.changeFilters.bind(this);
  }

  change(e) {
    this.props.changeGraph(Number(e.target.value));
  }

  changeFilters(e) {
    if (e.target.checked === true) {
      this.props.setFilterActive((e.target.name));
    } else {
      this.props.setFilterInactive(e.target.name);
    }
  }

  render() {
    const {
      data,
      filters,
      activeTags,
      activeFilters,
      isLoading,
      info,
    } = this.props;
    return (
      <div className={styles.card}>
        {
          isLoading &&
          <div style={{ textAlign: 'center' }}>
            <h4>Getting the data ready</h4>
            <img style={{ maxWidth: '100%' }} src="https://media.giphy.com/media/jAYUbVXgESSti/giphy.gif" alt="super kewl gif" />
          </div>
        }
        {
          data && data.length === 0 &&
          <div style={{ textAlign: 'center' }}>
            <h4>Please enter some toppings so we can compare pizzas for you</h4>
            <img style={{ maxWidth: '100%' }} src="https://media.giphy.com/media/OZpBpm7c2AGFG/giphy.gif" alt="super kewl gif" />
          </div>
        }

        {
          data && data.length > 0 && ([
            <div className={styles.header} key="header">
              <div>
                <h3>{info.label}</h3>
                <h4>{info.description}</h4>
              </div>
              <select onChange={this.change} value={info.id}>
                <option value={views.lowestRanked.id}>{views.lowestRanked.label}</option>
                <option value={views.topRanked.id}>{views.topRanked.label}</option>
              </select>
            </div>,
            <div className={styles.filters} key="filters">
              {
                filters && filters.map(filter =>
                  (<div key={`checkbox-${filter.id}`}>
                    <input onChange={this.changeFilters} type="checkbox" name={filter.id} id={`checkbox-${filter.id}`} checked={filter.active} />
                    <label htmlFor={`checkbox-${filter.id}`}>{filter.label}</label>
                  </div>))
              }
            </div>,
            <Resize key="chart">
              <BarChart
                current={info.id}
                filters={activeFilters}
                data={data}
                activeTags={activeTags}
              />
            </Resize>]
          )

        }

      </div>
    );
  }
}

Widget.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

Widget.defaultProps = {
}

export default Widget;
