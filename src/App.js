import React, { Component } from 'react';
import Tabletop from 'tabletop';
import { normalize } from 'normalizr';
import ReactTags from 'react-tag-autocomplete';
import { connect } from 'react-redux';
import { setData } from './redux/duck';
import Widget from './components/Widget/Widget';

import PizzaCard from './components/PizzaCard/PizzaCard';
import {
  getData,
  selectActiveFilters,
  getTagSuggestions,
  selectFilters,
  getGraphInfo,
  getIsLoading,
  getActiveTags,
} from './redux/selectors';
import {
  setFilterActive,
  setFilterInactive,
  setActiveGraph,
  addTag,
  removeTag,
} from './redux/duck';
import mySchema from './redux/models';
import './App.scss';

const publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1BGmcoo6Vx6EZHK8E4WfCTxaYafzHqTFRoF7X7WvU3XM/edit?usp=sharing'


class App extends Component {
  constructor(props){
    super(props);
    this.showInfo = this.showInfo.bind(this);
  }

  componentWillMount() {
    this.init()
  }

  init() {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      callback: this.showInfo,
      simpleSheet: true
    })
  }

  showInfo(data, tabletop) {
    const { setData } = this.props;
    const result = normalize(data, mySchema);
    setData(result.entities);
  }

  handleDelete (i) {
    const { removeTag } = this.props;
    removeTag(i);
  }

  handleAddition (tag) {
    const { addTag } = this.props;
    addTag(tag.id);
  }

  render() {
    const {
      data,
      filters,
      suggestions,
      info,
      changeGraph,
      activeFilters,
      activeTags,
      setFilterActive,
      setFilterInactive,
      isLoading,
    } = this.props;
    return (
      <div className="app">
      <h1>What toppings do you feel like eating?</h1>
      <h4 style={{padding: '0px 10px'}}> 
        Type in the
        toppings you feel like eating today and we'll show you all pizzas that have at least one of the specified
        toppings on them.
      </h4>
        <ReactTags
          tags={activeTags || []}
          suggestions={suggestions || []}
          allowNew={false}
          placeholder=""
          handleDelete={this.handleDelete.bind(this)}
          handleAddition={this.handleAddition.bind(this)}
        />
        <Widget
          filters={filters}
          activeFilters={activeFilters}
          activeTags={activeTags}
          data={data}
          isLoading={isLoading}
          changeGraph={changeGraph}
          setFilterActive={setFilterActive}
          setFilterInactive={setFilterInactive}
          info={info}
        />
        <div className="pizza__container">
          {
            data && data.map(pizza => (
              <PizzaCard filters={filters} key={pizza.name} pizza={pizza} />
            ))
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: getData(state),
  info: getGraphInfo(state),
  activeFilters: selectActiveFilters(state),
  filters: selectFilters(state),
  suggestions: getTagSuggestions(state),
  isLoading: getIsLoading(state),
  activeTags: getActiveTags(state),
});
const mapDispatchToProps = dispatch => ({
  setData: (pizza, toppings) => dispatch(setData(pizza, toppings)),
  addTag: (id) => dispatch(addTag(id)),
  removeTag: (id) => dispatch(removeTag(id)),
  setFilterActive: (id) => dispatch(setFilterActive(id)),
  setFilterInactive: (id) => dispatch(setFilterInactive(id)),
  changeGraph: (id) => dispatch(setActiveGraph(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
