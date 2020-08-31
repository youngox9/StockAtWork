/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';

import { Tabs, Input, Button } from 'antd';
import { useContextValue } from '~~hooks/useContextProvider';


const initialPanes = [
  {
    title: 'Tab 1',
    content: 'Content of Tab 1',
    key: '1',
    closable: false,
  },
  {
    title: 'Tab 2',
    content: 'Content of Tab 2',
    key: '2',
    closable: false,
  },
  {
    title: 'Tab 3',
    content: 'Content of Tab 3',
    key: '3',
    closable: false,
  },
];

function InputComponent(props) {
  const [text, setText] = useState('');
  const { value, onBlur } = props;
  useEffect(() => {
    setText(value);
  }, [value]);

  return <Input {...props} value={text} onChange={e => setText(e.target.value)} onBlur={onBlur} />;
}

export default function TabsContainer() {
  const [contextValue, dispatch] = useContextValue();
  const { stockList = [] } = contextValue;
  const [isEditMode, setIsEditMode] = useState(false);
  const [panes] = useState(initialPanes);
  const [activeKey, setActiveKey] = useState('1');

  function toggleEditMode() {
    setIsEditMode(!isEditMode);
  }

  function onTabChnage(key) {
    if (!isEditMode) {
      setActiveKey(key);
    }
  }

  function onTabInputChange(val, tabKey) {
    // console.log();
  }
  function onEdit(taget, action) {
    console.log(taget, action);
  }
  return (
    <>
      <Button onClick={toggleEditMode}>Edit</Button>
      <Tabs
        type="editable-card"
        onChange={onTabChnage}
        size="small"
        activeKey={activeKey}
        onEdit={onEdit}
      >
        {
          panes.map(p => {
            const { title, key, content } = p;
            return (
              <Tabs.TabPane
                tab={isEditMode ? (
                  <InputComponent
                    size="small"
                    value={title}
                    onBlur={val => onTabInputChange(val, key)}
                  />
                ) : title}
                key={p.key}
                closable={isEditMode}
              >
                {content}
              </Tabs.TabPane>
            );
          })
        }

      </Tabs>
    </>
  );
}
