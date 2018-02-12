import { eventConstants } from '../_constants';

export function events(state = {}, action) {
  switch (action.type) {
    case eventConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true
      };
    case eventConstants.GETALL_SUCCESS:
      return {
        items: action.events
      };
    case eventConstants.GETALL_FAILURE:
      return {
        error: action.error
      };
    case eventConstants.SELECT:
      return {
        ...state,
        selected: action.event
      };
    case eventConstants.SELECT_DROP:
      return {
        ...state,
        selected: null
      };
    case eventConstants.CREATE_REQUEST:
      return {
        ...state,
        creating: true,
      };
    case eventConstants.CREATE_SUCCESS:
      let items = state.items;
      if(!state.items.find(item => item.id === action.event.id)){
        items.push(action.event);
      }
      return {
        ...state,
        items,
        creating: false,
        created: true,
      };
    case eventConstants.CREATE_FAILURE:
      return {
        error: action.error
      };
    case eventConstants.UPDATE_REQUEST:
      return {
        ...state,
        updating: true,
      };
    case eventConstants.UPDATE_SUCCESS:
      return {
        items: state.items.map(event =>
          event.id === action.event.id
            ? action.event
            : event
        )
      };
    case eventConstants.UPDATE_FAILURE:
      return {
        error: action.error
      };
    case eventConstants.DELETE_REQUEST:
      return {
        ...state,
        items: state.items.map(event =>
          event.id === action.id
            ? { ...event, deleting: true }
            : event
        )
      };
    case eventConstants.DELETE_SUCCESS:
      return {
        items: state.items.filter(event => event.id !== action.id)
      };
    case eventConstants.DELETE_FAILURE:
      return {
        ...state,
        items: state.items.map(event => {
          if (event.id === action.id) {
            const { deleting, ...eventCopy } = event;
            return { ...eventCopy, deleteError: action.error };
          }

          return event;
        })
      };
    default:
      return state
  }
}
