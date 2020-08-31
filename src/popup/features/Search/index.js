import React, { useEffect, useState } from 'react';
import _get from 'lodash/get';
import { Tooltip, Row, Col, Empty, Card, Tag, Input, Button, Popover, AutoComplete } from 'antd';
import { HeartOutlined, LinkOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { ContextProvider, useContextValue } from '~~hooks/useContextProvider';
import { getStock, APIURL } from '~~utils';

const { Search } = Input;

const IframeContainer = styled.div`
  position: relative;
  display: block;
  width: 105%;
  padding-bottom: 84%;
  iframe {
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: 0;
    display:block;
    width: 100%;
    transform: scale(0.9);
    transform-origin: 24% 50%;
  }
`;

const InfoContainer = styled.div`
  max-width: 100%;
  table-layout: fixed;
  width: 100%;
  border: 1px solid #ddd;
  font-size: 6px;
  .ant-col {
    text-align: center;
    padding: 2px 0px;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:last-child {
      border-right: 0;
    }
    button {
      margin-right: 6px;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
`;

export default function Container() {
  const [contextValue, dispatch] = useContextValue();
  const [isLoading, setIsLoading] = useState(false);
  const [stockOptions, setStockOptions] = useState({});
  const { stockList = [] } = contextValue;

  const info = _get(stockOptions, ['info'], {});
  const { name = '-', price = '-', diff = '', max = 0, min = 0, id: infoId = '' } = info;

  const isExist = stockList.find(o => o.id === infoId);
  const isGreen = diff && diff.indexOf('▽') >= 0;

  async function searchstockOptions(id) {
    setIsLoading(true);
    const newstockOptions = await getStock({ id });
    if (newstockOptions) {
      setStockOptions([newstockOptions]);
    } else {
      setStockOptions([]);
    }
    setIsLoading(false);
  }

  function handleAddStock() {
    if (!isExist) {
      // const newStockList = [...stockList, stockOptions];
      // dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
    }
  }

  function handleLink() {
    window.open(`${APIURL}?s=${infoId}`, '_blank');
  }

  const stockOptionsExist = Object.keys(stockOptions).length > 0;

  return (
    <>
      <AutoComplete
        dropdownClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={500}
        style={{ width: 250 }}
        options={stockOptions}
      >
        <Input.Search size="large" placeholder="input here" />
      </AutoComplete>
      {/* <Search
        placeholder="搜尋股票"
        onSearch={value => searchstockOptions(value)}
        enterButton
        allowClear
        loading={isLoading}
      />
      <Card
        bordered
        loading={isLoading}
      >
        {
          stockOptionsExist
            ? (
              <InfoContainer>
                <Row>
                  <Col span={6}>名稱</Col>
                  <Col span={18}>{name}</Col>
                </Row>
                <Row>
                  <Col span={6}>今價</Col>
                  <Col span={18}>{price}</Col>
                </Row>
                <Row>
                  <Col span={6}>漲跌</Col>
                  <Col span={18}>
                    {diff
                      && (
                        <Tag color={isGreen ? 'green' : 'red'}>
                          {diff}
                        </Tag>
                      )}
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>最高</Col>
                  <Col span={18}>{max}</Col>
                </Row>
                <Row>
                  <Col span={6}>最低</Col>
                  <Col span={18}>{min}</Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Tooltip title="加入最愛清單">
                      <Button
                        onClick={handleAddStock}
                        type="danger"
                        shape="circle"
                        icon={<HeartOutlined />}
                        size="middle"
                        disabled={isExist}
                      />
                    </Tooltip>
                    <Tooltip title="前往個股網站">
                      <Button
                        onClick={handleLink}
                        type="link"
                        shape="circle"
                        icon={<LinkOutlined />}
                        size="middle"
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </InfoContainer>
            )
            : <Empty />
        }
      </Card> */}
    </>
  );
}
