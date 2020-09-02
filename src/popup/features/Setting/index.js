import React, { useEffect, useState } from 'react';
import _get from 'lodash/get';
import { Tooltip, Row, Col, Empty, Card, Tag, Input, Button, Popover, AutoComplete } from 'antd';
import { HeartOutlined, LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ContextProvider, useContextValue } from '~~hooks/useContextProvider';
import { getStock, getStockAutoComplete, APIURL } from '~~utils';

const ScarchContainer = styled.div`
  margin-bottom: 0.2rem;
`;

export default function Setting(props) {
  const { list, onChange } = props;

  return (null);
}
