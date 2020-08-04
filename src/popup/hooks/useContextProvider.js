import React, { createContext, useContext, useReducer } from 'react';

export const MyContext = createContext();

export const ContextProvider = ({ reducer, initialState, children }) => (
  <MyContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </MyContext.Provider>
);

export const useContextValue = () => useContext(MyContext);
