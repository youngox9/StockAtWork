import React, { useState, useEffect } from 'react';
import _get from 'lodash/get';
import { Row, Col, Slider, InputNumber } from 'antd';
import styled from 'styled-components';
import { useContextValue } from '~~hooks/useContextProvider';

const SettingContainer = styled.div`
  text-align: center;
  display: block;
  max-width: 450px;
  margin: 0 auto;
`;

export default function Setting() {
  const [contextValue, dispatch] = useContextValue();
  const { setting: propsSetting } = contextValue;

  const [setting, setSetting] = useState(propsSetting);
  const { width } = setting;

  function onChangeWidth(value) {
    setSetting({ ...setting, width: value });
  }

  function onUpdateReducer() {
    dispatch({ type: 'UPDATE_SETTING', setting: { ...setting } });
  }

  useEffect(() => {

  }, [JSON.stringify(setting)]);

  return (
    <SettingContainer>
      <Row align="middle">
        <Col span={6}>
          視窗寬度
        </Col>
        <Col span={18}>
          <Slider
            min={350}
            max={800}
            onChange={onChangeWidth}
            onAfterChange={onUpdateReducer}
            value={width}
          />
        </Col>
      </Row>
      {/* <Row align="middle">
        <Col span={6}>
          自動刷新時間
        </Col>
        <Col span={18}>
          <InputNumber
            min={1}
            max={999}
          />
        </Col>
      </Row> */}
    </SettingContainer>
  );
}
