import React from 'react';
import Container from '~~features/Container';
import { ContextProvider } from '~~hooks/useContextProvider';

import 'antd/dist/antd.less';

const getLocalStorage = key => {
  const storageData = localStorage.getItem(key);
  try {
    const storageJson = JSON.parse(storageData);
    return storageJson;
  } catch (e) {
    return null;
  }
};

const setLocalStorage = (key, obj) => localStorage.setItem(key, JSON.stringify(obj));

const DEFAULT_SETTING = {
  width: 450,
  height: 'auto'
};

const initialState = {
  setting: getLocalStorage('setting') || DEFAULT_SETTING,
  stockList: getLocalStorage('stockData') || []
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_STOCKLIST':
      setLocalStorage('stockData', action.stockList);
      return {
        ...state,
        stockList: action.stockList
      };
    case 'UPDATE_SETTING':
      setLocalStorage('setting', action.setting);
      return {
        ...state,
        setting: action.setting
      };
    default:
      return state;
  }
};

function App() {
  return (
    <ContextProvider initialState={initialState} reducer={reducer}>
      <Container />
    </ContextProvider>
  );
}

export default App;
