import React, { Fragment } from 'react'
import Container from './Container'
import { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import 'antd/dist/antd.css';

const GlobalStyle = createGlobalStyle`
  /* ${reset} */
  * {
    font-family: Microsoft JhengHei, 'Helvetica', 'Arial', 'sans-serif' !important;
    box-sizing: border-box !important;
  }
  html, 
  body {
    min-width:300px;
    height: auto;
    border: 2px solid #aaa;
    background-color: transparent;
  }
`

function App() {
  return (
    <Fragment>
      <GlobalStyle />
      <Container />
    </Fragment>
  );
}

export default App
