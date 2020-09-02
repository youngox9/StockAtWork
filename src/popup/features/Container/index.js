import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import styled, { createGlobalStyle } from 'styled-components';
import { Tabs } from 'antd';
import reset from 'styled-reset';
import { HeartFilled, SettingFilled } from '@ant-design/icons';
import { useContextValue } from '~~hooks/useContextProvider';
import Setting from '~~features/Setting';
import Favorite from '~~features/Favorite';

const { TabPane } = Tabs;

const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    font-family: Microsoft JhengHei, 'Helvetica', 'Arial', 'sans-serif' !important;
    box-sizing: border-box !important;
  }
  html, 
  body { 
    /* transition: 0.15s ease height; */
    max-width: 100%;
    width: ${({ values: { width } }) => (`${width}px`)};
    height: ${({ values: { bodyHeight } }) => (`${bodyHeight}px`)};
  }
`;

const ContainerWrap = styled.div`
  max-width: 100%;
  display: block;
  margin: 0 auto;
  max-width: 100%;
  margin: 0 auto;
  padding: 6px;
  transition: 0.3s ease all;
  border: 1px solid #ddd;
  .ant-tabs-nav {
    margin-bottom: 6px;
  }
  .ant-table {
    .ant-table-expand-icon-col, .ant-table-row-expand-icon-cell {
      width: 20px;
      max-width: 20px;
    }
    td,  
    th {
      text-align: center;
      padding: 6px 2px !important;
      vertical-align: middle;
      input {
        width: 60px;
      }
      >p {
        font-size: 6px !important;
      }
    }
    .ant-table-thead {
      white-space: nowrap;
    }
  }
  .ant-tag  {
    &:last-child {
      margin-right: 0;
    }
  }
`;

const TABS_SETTING = [
  {
    name: (
      <>
        <HeartFilled size="small" />
        <span>我的最愛</span>
      </>
    ),
    key: '0',
    render: <Favorite />
  },
  {
    name: (
      <span>
        <SettingFilled />
        設置
      </span>
    ),
    key: '1',
    render: <Setting />
  },
  // { name: <span>損益試算</span>, key: '2', render: '施工中' },
  // { name: <span>設定</span>, key: '3', render: '施工中' },
];

let timer;
export default function Container() {
  const [bodyHeight, setBodyHeight] = useState(300);
  const [containerEl, setContainerEl] = useState(null);
  const [contextValue, dispatch] = useContextValue();
  const [activeTab, setActiveTab] = useState(TABS_SETTING[0].key);

  useEffect(() => {
    if (containerEl) {
      clearInterval(timer);
      timer = setInterval(() => {
        const newBodyHeight = containerEl ? containerEl.clientHeight : 300;
        setBodyHeight(newBodyHeight);
      }, 100);
    }
  }, [containerEl]);

  return (
    <ContainerWrap ref={setContainerEl}>
      <GlobalStyle values={{ ...contextValue, bodyHeight }} />
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="small"
        type="card"
      >
        {
          TABS_SETTING.map(tab => {
            const { render = null, name, key } = tab;
            return (
              <TabPane tab={name} key={key}>
                {render}
              </TabPane>
            );
          })
        }
      </Tabs>
    </ContainerWrap>
  );
}
