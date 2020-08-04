import React from 'react';
import Container from '~~features/Container';
import { ContextProvider } from '~~hooks/useContextProvider';

// import 'antd/dist/antd.css';
import 'antd/lib/style/themes/default.less';
import 'antd/dist/antd.less';

function getStockList() {
  const data = localStorage.getItem('item');
  const stockList = data ? JSON.parse(data) : [];
  return stockList;
}

const initialStockList = getStockList();

const initialState = {
  width: 450,
  height: 'auto',
  stockList: initialStockList
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_STOCKLIST':
      // eslint-disable-next-line no-case-declarations
      const { stockList = [] } = action;
      localStorage.setItem('item', JSON.stringify(stockList));
      return {
        ...state,
        stockList: action.stockList
      };
    case 'RELOAD_STOCKLIST':
      return {
        ...state,
        stockList: getStockList()
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
