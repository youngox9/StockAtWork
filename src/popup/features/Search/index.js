/* eslint-disable jsx-a11y/control-has-associated-label */
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
const InfoContainer = styled.div`
  margin-top: 6px;
  width: 100%;
  table {
    width: 100%;
    th {
      /* background-color: #fafafa; */
      border: 1px solid #fafafa;
    }
    td {
      border: 1px solid #fafafa;
    }
    td,th {
      padding: 2px 0px;
      text-align: center;
      white-space: nowrap;
      font-size: 6px;
    }
  }
`;

export default function Container(props) {
  const { list, onChange } = props;
  // const [contextValue, dispatch] = useContextValue();
  const [isLoading, setIsLoading] = useState(false);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockInfo, setStockInfo] = useState({});
  // const { stockList = [] } = contextValue;

  const { name = '-', price = '-', diff = '', max = 0, min = 0, id: infoId = '' } = stockInfo;

  const isExist = list.find(id => id === infoId);
  const isGreen = diff && diff.indexOf('▽') >= 0;

  function handleAddStock() {
    if (!isExist) {
      const newList = [...list, infoId];
      onChange(newList);
    }
  }

  // function handleLink() {
  //   window.open(`${APIURL}?s=${infoId}`, '_blank');
  // }

  function resetSearch() {
    setStockInfo({});
    setStockOptions([]);
  }

  async function onSearch(val) {
    if (val) {
      const res = await getStockAutoComplete(val);
      const newOptions = res.map(obj => {
        return {
          value: obj.id,
          label: `${obj.name} (${obj.id})`
        };
      });
      setStockOptions(newOptions);
    } else {
      resetSearch();
    }
  }

  async function onSelect(opt) {
    try {
      const info = await getStock(opt);
      setStockInfo(info);
    } catch (e) {
      console.log(e);
    }
  }

  function onSearchEnter() {
    const opt = stockOptions[0]?.value;
    if (opt) {
      onSelect(opt);
    }
  }

  return (
    <ScarchContainer>
      <AutoComplete
        onSearch={onSearch}
        onSelect={onSelect}
        options={stockOptions}
      >
        <Input.Search
          size="small"
          placeholder="搜尋個股(中文名稱, 代號)"
          allowClear
          onPressEnter={onSearchEnter}
        />
      </AutoComplete>
      {stockInfo.name && (
        <InfoContainer>
          <table>
            <tr>
              <th>名稱</th>
              <th>今價</th>
              <th>漲跌</th>
              <th>最高</th>
              <th>最低</th>
              <th />
            </tr>
            <tr>
              <td>{name}</td>
              <td>{price}</td>
              <td>
                {diff
                  && (
                    <Tag color={isGreen ? 'green' : 'red'}>
                      {diff}
                    </Tag>
                  )}
              </td>
              <td>{max}</td>
              <td>{min}</td>
              <td>
                <Tooltip title={isExist ? '已經加入最愛' : '加入最愛清單'}>
                  <Button
                    onClick={handleAddStock}
                    type="danger"
                    shape="circle"
                    icon={<HeartOutlined />}
                    size="small"
                    disabled={isExist}
                  />
                </Tooltip>
                {/* <Tooltip title="前往個股網站">
                <Button
                  onClick={handleLink}
                  type="primary"
                  icon={<LinkOutlined />}
                  size="small"
                />
              </Tooltip> */}
              </td>
            </tr>
          </table>
        </InfoContainer>
      )}
    </ScarchContainer>
  );
}
