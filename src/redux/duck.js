import { views } from './config';

const SET_PIZZA_DATA = 'SET_PIZZA_DATA';
const SET_FILTER_ACTIVE = 'SET_FILTER_ACTIVE';
const SET_FILTER_INACTIVE = 'SET_FILTER_INACTIVE';
const SET_ACTIVE_GRAPH = 'SET_ACTIVE_GRAPH';
const ADD_TAG = 'ADD_TAG';
const REMOVE_TAG = 'REMOVE_TAG';

const setData = (entities) => ({
  type: SET_PIZZA_DATA,
  data: {
    ...entities
}});

const setFilterActive = (id) => ({
  type: SET_FILTER_ACTIVE,
  data: id,
});

const setFilterInactive = (id) => ({
  type: SET_FILTER_INACTIVE,
  data: id,
});

const addTag = (tag) => ({
  type: ADD_TAG,
  data: tag,
});

const removeTag = (index) => ({
  type: REMOVE_TAG,
  data: index,
});

const setActiveGraph = type => ({
  type: SET_ACTIVE_GRAPH,
  data: type,
})


const baseReducer = (state = {}, action ) => {
  switch(action.type) {
    case SET_ACTIVE_GRAPH: {
      return Object.assign({}, state, {
        activeGraph: action.data,
      })
    }
    case ADD_TAG: {
      return Object.assign({}, state, {
        activeTags: state.activeTags.concat({id: action.data, name: action.data})
      })
    }
    case REMOVE_TAG: {
      return Object.assign({}, state, {
        activeTags: [
          ...state.activeTags.slice(0, action.data),
          ...state.activeTags.slice(action.data + 1)
        ]
      })
    }
    case SET_PIZZA_DATA: {
      return Object.assign({}, state, {
        ...action.data,
        activeGraph: views.topRanked.id,
        activeTags: Object.keys(action.data.topping).map(t => ({
          id: t,
          name: t,
        })).slice(0,3), // If needed change initial tag number
        isLoading: false,
      });
    }
    case SET_FILTER_ACTIVE: {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          [action.data]: {
            ...state.filter[action.data],
            active: true,
          }
        })
      });
    }
    case SET_FILTER_INACTIVE: {
      return Object.assign({}, state, {
        filter: Object.assign({}, state.filter, {
          [action.data]: {
            ...state.filter[action.data],
            active: false,
          }
        })
      });
    }
    default: return state;
  }
}

export {
  setData,
  setFilterActive,
  setFilterInactive,
  setActiveGraph,
  addTag,
  removeTag,
};

export default baseReducer;