import {
  views,
} from './config';


const selectActiveFilters = state => {
  if (!state.filter) return null;
  return  Object.keys(state.filter).filter(t => state.filter[t].active).map(t => state.filter[t])
};

const selectFilters = state => {
  if (!state.filter) return null;
  return  Object.keys(state.filter).map(t => state.filter[t])
};

const getTagSuggestions = state => {
  if (!state.topping) return null;
  return  Object.keys(state.topping)
    .map(key => ({
      ...state.topping[key],
      name: key,
    }));
}

const getActiveTags = state => {
  if (!state.activeTags) return null;
  return  state.activeTags;
}

/**
 * Gets all pizzas that have at least one topping from the specified active tag list.
 */
const getCandidates = (state) => {
  if (!state.pizza) return null;
  const activeFilters = selectActiveFilters(state);
  const activeTags = state.activeTags;
  return Object.keys(state.pizza)
    .filter(pizzaName => state.pizza[pizzaName].toppings.some(topping => activeTags.find(tag => tag.id === topping)))
    .map(pizzaName => activeFilters.map(c => c.id).reduce((obj, c) => {
      obj[c] = state.pizza[pizzaName][c];
      if (!obj['total']) {
        obj['total'] = 0;
      }
      obj['total'] = obj['total'] + state.pizza[pizzaName][c];
      return obj;
    }, {
      name: pizzaName,
      toppings: state.pizza[pizzaName].toppings
    }));
}

/**
 * Returns the data that needs to be displayed (based on the activeGraph
 * property that represents a view from ./config.js)
 */
const getData = state => {
  if (state.activeGraph === 0) {
    return getHighData(state);
  } else {
    return getLowData(state);
  }
}


const getHighData = state => {
  if (!state.pizza) return null;
  const candidates = getCandidates(state);
  return candidates
    .sort((a,b) => b.total - a.total)
    .slice(0,5); // If needed change number of visible candidates
}

const getLowData = state => {
  if (!state.pizza) return null;
  return getCandidates(state)
    .sort((a,b) => a.total - b.total)
    .slice(0,5); // If needed change number of visible candidates
}
const getGraphInfo = state => Object.keys(views).map(v => views[v]).find(t => t.id === state.activeGraph) || {};
const getIsLoading = state => state.isLoading !== false;

export {
  getData,
  selectActiveFilters,
  getTagSuggestions,
  selectFilters,
  getActiveTags,
  getLowData,
  getIsLoading,
  getGraphInfo,
};