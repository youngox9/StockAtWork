import React, { useEffect, useState } from 'react';
import _get from 'lodash/get';
import { Tooltip, Row, Col, Empty, Card, Tag, Input, Button, Popover, AutoComplete } from 'antd';
import { HeartOutlined, LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ContextProvider, useContextValue } from '~~hooks/useContextProvider';
import { getStock, getStockAutoComplete, APIURL } from '~~utils';

const { Search } = Input;

const InfoContainer = styled.div`
  table {
    width: 100%;
    td {
      border: 1px solid #ddd;
      padding: 0px 4px;
      text-align: center;
    }
  }
`;

export default function Container() {
  const [contextValue, dispatch] = useContextValue();
  const [isLoading, setIsLoading] = useState(false);
  const [stockOptions, setStockOptions] = useState([]);
  const [stockInfo, setStockInfo] = useState({});
  const { stockList = [] } = contextValue;

  const { name = '-', price = '-', diff = '', max = 0, min = 0, id: infoId = '' } = stockInfo;

  const isExist = stockList.find(o => o.id === infoId);
  const isGreen = diff && diff.indexOf('▽') >= 0;

  function handleAddStock() {
    if (!isExist) {
      // const newStockList = [...stockList, stockOptions];
      // dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
    }
  }

  function handleLink() {
    window.open(`${APIURL}?s=${infoId}`, '_blank');
  }

  async function onSearch(val) {
    const list = await getStockAutoComplete(val);
    const newOptions = list.map(obj => {
      return {
        value: obj.id,
        label: `${obj.name} (${obj.id})`
      };
    });
    setStockOptions(newOptions);
  }

  async function onSelect(opt) {
    try {
      const info = await getStock(opt);
      setStockInfo(info);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <Row align="middle" justify="space-between">
        <Col>
          <AutoComplete
            onSearch={onSearch}
            onSelect={onSelect}
            options={stockOptions}
          >
            <Input.Search size="small" placeholder="搜尋個股(中文名稱, 代號)" />
          </AutoComplete>
        </Col>
        <Col>
          {stockInfo.name
            && (
              <>
                <Popover
                  content={() => {
                    return (
                      <InfoContainer>
                        <table>
                          <tr>
                            <td>名稱</td>
                            <td>今價</td>
                            <td>漲跌</td>
                            <td>最高</td>
                            <td>最低</td>
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
                          </tr>
                        </table>
                      </InfoContainer>
                    );
                  }}
                >
                  <Button size="small">{name}</Button>
                </Popover>
                <Tooltip title="加入最愛清單">
                  <Button
                    onClick={handleAddStock}
                    // type="danger"
                    icon={<HeartOutlined />}
                    size="small"
                  />
                </Tooltip>
                <Tooltip title="前往個股網站">
                  <Button
                    onClick={handleLink}
                    // type="link"
                    icon={<LinkOutlined />}
                    size="small"
                  />
                </Tooltip>
              </>
            )}
        </Col>
      </Row>
    </>
  );
}
