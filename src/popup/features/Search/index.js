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
  table {
    width: 100%;
    th {
      padding: 4px 12px;
      background-color: #fafafa;
    }
    td {
      padding: 4px 12px;
      border: 1px solid #fafafa;
    }
    td,th {
      text-align: center;
      white-space: nowrap;
      font-size: 6px;
    }
  }
`;

const ResultContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  >span {
    margin-right: 0.2rem;
    font-weight:bolder;
  }
  >.ant-btn {
    margin-right: 0.2rem;
  }
  padding: 0.2rem 0.5rem 0.2rem 1rem;
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

  function handleLink() {
    window.open(`${APIURL}?s=${infoId}`, '_blank');
  }

  async function onSearch(val) {
    const res = await getStockAutoComplete(val);
    const newOptions = res.map(obj => {
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
    <ScarchContainer>
      <Row align="middle" justify="space-between">
        <Col>
          <AutoComplete
            onSearch={onSearch}
            onSelect={onSelect}
            options={stockOptions}
          >
            <Input.Search size="small" placeholder="搜尋個股(中文名稱, 代號)" allowClear />
          </AutoComplete>
        </Col>
        <Col>
          {stockInfo.name
            && (
              <ResultContainer>
                <span>Result:</span>
                <Popover
                  placement="bottom"
                  content={() => {
                    return (
                      <InfoContainer>
                        <table>
                          <tr>
                            <th>名稱</th>
                            <th>今價</th>
                            <th>漲跌</th>
                            <th>最高</th>
                            <th>最低</th>
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
                  <Button type="link" size="small">{name}</Button>
                </Popover>
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
                <Tooltip title="前往個股網站">
                  <Button
                    onClick={handleLink}
                    type="primary"
                    icon={<LinkOutlined />}
                    size="small"
                  />
                </Tooltip>
              </ResultContainer>
            )}
        </Col>
      </Row>
    </ScarchContainer>
  );
}
