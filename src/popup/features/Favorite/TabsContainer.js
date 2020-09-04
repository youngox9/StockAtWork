import React, { useEffect, useState } from 'react';

import { Tooltip, Button, Table, Tag, Row, Col, } from 'antd';
import styled from 'styled-components';
import _get from 'lodash/get';
import {
  DeleteFilled,
  ReloadOutlined,
} from '@ant-design/icons';

import { getStockList } from '~~utils';
import { useContextValue } from '~~hooks/useContextProvider';
import StockDetail from '~~components/StockDetail';
import Search from '~~features/Search';

const SearchContainer = styled.div`
  position: relative;
  .refresh-btn {
    position: absolute;
    top: 0;
    right: 0;
  }
    
`;

const getColumns = (props) => [
  {
    title() {
      return (
        <p>名稱</p>
      );
    },
    dataIndex: 'name',
  },
  {
    title() {
      return (
        <p>今價</p>
      );
    },
    dataIndex: 'price',
    sorter(a, b) {
      return _get(a, ['price'], 0) - _get(b, ['price'], 0);
    },
    render(val) {
      return (
        <p>
          {val}
        </p>
      );
    }
  },
  {
    title() {
      return (
        <p>最高</p>
      );
    },
    dataIndex: 'max',
    sorter(a, b) {
      return _get(a, ['max'], 0) - _get(b, ['max'], 0);
    },
    render(val) {
      return (
        <p>
          {val}
        </p>
      );
    }
  },
  {
    title() {
      return (
        <p>最低</p>
      );
    },
    dataIndex: 'min',
    sorter(a, b) {
      return _get(a, ['info', 'min'], 0) - _get(b, ['info', 'min'], 0);
    },
    render(val) {
      return (
        <p>
          {val}
        </p>
      );
    }
  },
  {
    title() {
      return (
        <p>漲幅</p>
      );
    },
    dataIndex: 'diff',
    render(val) {
      if (val) {
        const isGreen = val.indexOf('▽') >= 0;
        return (
          <Tag color={isGreen ? 'green' : 'red'}>
            {val}
          </Tag>
        );
      }
      return null;
    }
  },
  {
    title() {
      return null;
    },
    dataIndex: 'diff',
    render(val, record) {
      const { id } = record;
      console.log(record);
      return (
        <>
          <Tooltip title="刪除最愛">
            <Button
              onClick={() => props.removeStock(id)}
              type="link"
              shape="circle"
              icon={<DeleteFilled />}
              size="small"
            />
          </Tooltip>
        </>
      );
    }
  },
];

export default function Container(props) {
  const { list = [], onChange = () => { } } = props;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [contextValue, dispatch] = useContextValue();
  const [loading, setLoading] = useState(true);

  // const [stockList, setStockList] = useState([]);
  // const { stockList = [] } = contextValue;

  useEffect(() => {
    getList();
  }, [JSON.stringify(list)]);

  async function getList() {
    setLoading(true);
    const newStockList = await getStockList(list);
    setDataSource(newStockList);
    setLoading(false);
  }

  function removeStock(id) {
    const newList = list.reduce((prev, curr) => {
      if (curr !== id) {
        return [...prev, curr];
      }
      return prev;
    }, []);
    console.log(id, newList);
    onChange(newList);
  }

  function onExpand(id) {
    if (expandedKeys.includes(id)) {
      setExpandedKeys([]);
    } else {
      setExpandedKeys([id]);
    }
  }

  const extendsProps = { removeStock, onExpand };
  const columns = getColumns(extendsProps);

  return (
    <>
      <SearchContainer>
        <Search onChange={onChange} list={list} />
        <Tooltip title="刷新頁面">
          <Button className="refresh-btn" type="primary" shape="circle" icon={<ReloadOutlined />} size="small" onClick={getList} />
        </Tooltip>
      </SearchContainer>
      <Table
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        showSorterTooltip={false}
        size="small"
        indentSize={0}
        // expandIconColumnIndex={-1}
        onExpand={(expanded, record) => onExpand(record.id)}
        // expandRowByClick
        expandedRowKeys={expandedKeys}
        expandable={{
          expandedRowRender: (record, index, indent, expanded) => {
            if (!expanded) { return null; }
            const { id = '' } = record;
            return (
              <StockDetail stockId={id} />
            );
          },
        }}
      />
    </>
  );
}
