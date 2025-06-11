import * as Actions from './Actions';

export const settingsReducer = (state, action) => {
  switch (action.type) {
    case Actions.TOGGLE_SETTING:
      return {
        ...state,
        [action.payload.key]: !state[action.payload.key]
      };
      
    case Actions.UPDATE_SETTING:
      return {
        ...state,
        [action.payload.key]: action.payload.value
      };

    case Actions.LOAD_SETTINGS:
      return {
        ...state,
        ...action.payload
      };
      
    case Actions.SET_NEW_SUPPLIER:
      return {
        ...state,
        newSupplier: action.payload
      };
      
    case Actions.ADD_SUPPLIER:
      return {
        ...state,
        storeSupply: {
          ...state.storeSupply,
          preferredSuppliers: [
            ...state.storeSupply.preferredSuppliers || [],
            action.payload
          ],
          newSupplier: ''
        }
      };
      
    case Actions.REMOVE_SUPPLIER:
      return {
        ...state,
        storeSupply: {
          ...state.storeSupply,
          preferredSuppliers: state.storeSupply.preferredSuppliers.filter(
            supplier => supplier !== action.payload
          )
        }
      };
      
    case Actions.UPDATE_INVENTORY:
      return {
        ...state,
        storeSupply: {
          ...state.storeSupply,
          ...action.payload
        }
      };
      
    default:
      return state;
  }
}; 