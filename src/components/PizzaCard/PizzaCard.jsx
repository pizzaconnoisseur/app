import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './PizzaCard.module.scss';


class PizzaCard extends Component {

  render() {
    const {
      pizza,
      filters
    } = this.props;
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <div>
            <h3>{pizza.name}</h3>
            <div className={styles.toppings}>
              {
                pizza.toppings && pizza.toppings.map(t => (<span key={t}>{t}</span>))
              }
            </div>
          </div>
        </div>
        <div className={styles.filters}>
          {
            Object.keys(pizza).filter(key => key !== 'toppings' && key !== 'name' && key !== 'total')
              .map(i => (
                <div key={i} style={{ background: filters.filter(t => t.id === i).map(r => r.color) }}>
                  <div style={{ fontSize: '2em' }}>{pizza[i]}</div>
                  {filters.filter(t => t.id === i).map(r => r.label)}
                </div>
              ))
          }
        </div>
      </div>
    );
  }
}

PizzaCard.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})),
};

export default PizzaCard;
