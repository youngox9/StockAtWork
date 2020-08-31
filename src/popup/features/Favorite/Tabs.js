/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import uuidv4 from 'uuid/v4';
import { Tabs, Input, Button } from 'antd';
import {
  EditFilled,
  SaveFilled,
  DeleteFilled,
} from '@ant-design/icons';
import styled from 'styled-components';
import { useContextValue } from '~~hooks/useContextProvider';

import TabsContainer from './TabsContainer';

const TabTitle = styled.div`
  .anticon {
    margin-left: 0rem;
    margin-right: 0rem;
  }
  .ant-input  {
    width: 4.5rem;
  }
`;

const TabTitleEdit = styled.div`
  /* transition: 0.18s ease padding-right; */
  padding-right: 10px;
  &:hover {
    /* padding-right: 10px; */
    >.ant-btn{
      opacity: 1;
    }
  }
  >.ant-btn {
    opacity: 0;
    position: absolute;
    top: 50%;
    transform: translate(0%, -50%);
    right: 6px;
    transition: 0.18s ease all;
  }
`;

function EditableTitle(props) {
  const {
    onChange = () => { },
    onRemove = () => { },
    title = '',
    key
  } = props;
  const [editMode, setEditMode] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    setText(title);
  }, [title]);

  function onEnter() {
    onChange(text);
    setEditMode(false);
  }

  return (
    <TabTitle>
      {editMode ? (
        <>
          <Input
            size="small"
            value={text}
            onChange={e => setText(e.target.value)}
            onPressEnter={onEnter}
          />
          <Button
            onClick={onEnter}
            size="small"
            type="link"
            shape="circle"
            icon={<SaveFilled size="12px" />}
          />
          <Button
            onClick={onRemove}
            size="small"
            type="link"
            shape="circle"
            icon={<DeleteFilled size="12px" />}
          />
        </>
      )
        : (
          <TabTitleEdit key={key}>
            {title}
            <Button
              onClick={() => setEditMode(true)}
              size="small"
              type="link"
              shape="circle"
              icon={<EditFilled size="12px" />}
            />
          </TabTitleEdit>
        )}
    </TabTitle>
  );
}

export default function TabsComponent() {
  const [contextValue, dispatch] = useContextValue();
  const { stockList = [] } = contextValue;
  const [isEditMode, setIsEditMode] = useState(false);
  // const [panes] = useState(initialPanes);
  const [activeKey, setActiveKey] = useState('');

  // useEffect(() => {
  //   setActiveKey();
  // }, [JSON.stringify(stockList)]);

  function onTabChnage(key) {
    if (!isEditMode) {
      setActiveKey(key);
    }
  }

  function onEdit(taget, action) {
    if (action === 'add') {
      onAddTab();
    }
  }
  function onAddTab() {
    const newTabItem = {
      title: 'New Tab',
      key: uuidv4(),
      list: []
    };
    const newStockList = [...stockList, newTabItem];
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  function onRemoveTab(tabKey) {
    const newStockList = stockList.reduce((prev, curr) => {
      if (curr.key !== tabKey) {
        return [...prev, curr];
      }
      return prev;
    }, []);
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  function onChangeTab(title, tabKey) {
    const newStockList = stockList.map(obj => {
      if (obj.key === tabKey) {
        return {
          ...obj,
          title
        };
      }
      return obj;
    });
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  function onListChange(list, tabKey) {
    const newStockList = stockList.map(obj => {
      if (obj.key === tabKey) {
        return {
          ...obj,
          list
        };
      }
      return obj;
    });
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  return (
    <>
      <Tabs
        type="editable-card"
        onChange={onTabChnage}
        size="small"
        // activeKey={activeKey}
        onEdit={onEdit}
      // addIcon="新增自選"
      >
        {
          stockList.map(p => {
            const { title, key, content, list } = p;
            return (
              <Tabs.TabPane
                key={key}
                tab={(
                  <EditableTitle
                    title={title}
                    onChange={(val) => onChangeTab(val, key)}
                    onRemove={() => onRemoveTab(key)}
                  />
                )}
                closable={false}
              >
                <TabsContainer list={list} onChange={(val) => onListChange(val, key)} />
              </Tabs.TabPane>
            );
          })
        }

      </Tabs>
    </>
  );
}
