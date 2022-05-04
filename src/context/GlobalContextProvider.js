import React, { createContext, useReducer, useState } from "react";

export const initialState = {
  items: [], // {item: {id: ..., ...}, quantity: 1}
  showModal: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      // If item is already added, don't add it again
      const itemAdded = () => {
        for (let i = 0; i < state.items.length; i++) {
          if (state.items[i].item.id === action.payload.id) {
            return true;
          }
        }
        return false;
      };

      if (!itemAdded()) {
        state.items.push({ item: action.payload, quantity: 1 });
        return state;
      }

      return state;

    case "PLUS_ONE_ITEM":
      state.items.map((item) => {
        if (item.item.id === action.payload) {
          item.quantity++;
        }
      });
      return state;

    case "MINUS_ONE_ITEM":
      state.items.map((item) => {
        if (item.item.id === action.payload && item.quantity > 1) {
          item.quantity--;
        }
      });
      return state;
    case "REMOVE_ITEM":
      // payload = id
      return {
        ...state,
        items: state.items.filter(({ item }) => item.id !== action.payload),
      };
    case "CLEAR_ITEMS":
      return {
        ...state,
        items: [],
      };
    case "TOGGLE_MODAL":
      return { ...state, showModal: !state.showModal };

    default:
      return state;
  }
};

export const GlobalStateContext = createContext();
export const GlobalDispatchContext = createContext();
export const GlobalItemsCountContext = createContext();
export const GlobalItemsCounterContext = createContext();

const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [itemsTotal, setItemsTotal] = useState(0); // for watching items being counted (for basket in layout)

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        <GlobalItemsCounterContext.Provider value={setItemsTotal}>
          <GlobalItemsCountContext.Provider value={itemsTotal}>
            {children}
          </GlobalItemsCountContext.Provider>
        </GlobalItemsCounterContext.Provider>
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export default GlobalContextProvider;

// Provider sends state and dispatch to all the lower components.
// Lower components will access it through useContext(store).
// Store is created here.
