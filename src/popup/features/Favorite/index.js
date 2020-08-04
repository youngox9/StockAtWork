import React, { useEffect, useState } from 'react';

import { Tooltip, Button, Table, Tag } from 'antd';
import _get from 'lodash/get';
import uuidv4 from 'uuid/v4';
import {
  DeleteFilled,
  LinkOutlined,
} from '@ant-design/icons';

import { getStockList, APIURL } from '~~utils';
import { useContextValue } from '~~hooks/useContextProvider';
import StockDetail from '~~components/StockDetail';

const getColumns = (props) => [
  {
    title() {
      return (
        <p>名稱</p>
      );
    },
    dataIndex: ['info', 'name'],
  },
  {
    title() {
      return (
        <p>今價</p>
      );
    },
    dataIndex: ['info', 'price'],
    sorter(a, b) {
      return _get(a, ['info', 'price'], 0) - _get(b, ['info', 'price'], 0);
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
    dataIndex: ['info', 'max'],
    sorter(a, b) {
      return _get(a, ['info', 'max'], 0) - _get(b, ['info', 'max'], 0);
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
    dataIndex: ['info', 'min'],
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
    dataIndex: ['info', 'diff'],
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
    dataIndex: ['info', 'diff'],
    render(racord) {
      const { id } = racord;
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
  // {
  //   title() {
  //     return null;
  //   },
  //   dataIndex: ['info', 'diff'],
  //   render(racord) {
  //     const { id } = racord;

  //     function handleLink() {
  //       window.open(`${APIURL}?s=${id}`, '_blank');
  //     }
  //     return (
  //       <>
  //         <Tooltip title="個股連結">
  //           <Button
  //             onClick={handleLink}
  //             type="link"
  //             shape="circle"
  //             icon={<LinkOutlined />}
  //             size="small"
  //           />
  //         </Tooltip>
  //       </>
  //     );
  //   }
  // },
];

export default function Container() {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [contextValue, dispatch] = useContextValue();
  const [loading, setLoading] = useState(true);

  const { stockList = [] } = contextValue;

  useEffect(() => {
    getList();
  }, [...stockList.map(obj => obj.id)]);

  async function getList() {
    setLoading(true);
    const newStockList = await getStockList(stockList);
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
    setLoading(false);
  }

  function removeStock(id) {
    const newStockList = stockList.reduce((prev, curr) => {
      if (curr.id !== id) {
        return [...prev, curr];
      }
      return prev;
    }, []);
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  function addDetail(id) {
    const newStockList = stockList.reduce((prev, curr) => {
      if (curr.id === id) {
        const { info: { price = 0 }, detail = [] } = curr;
        return [...prev, {
          ...curr,
          detail: [
            {
              id: uuidv4(),
              qty: '1',
              price
            },
            ...detail
          ]
        }];
      }
      return [...prev, curr];
    }, []);
    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  function onDetailChange(detailId, newDetailRecord) {
    const newStockList = stockList.reduce((prev, curr) => {
      const { detail = [] } = curr;
      const newDetail = detail.reduce((p, c) => {
        if (c.id === detailId) {
          return [...prev, newDetailRecord];
        }
        return [...p, c];
      }, []);
      return [...prev, { ...curr, detail: newDetail }];
    }, []);

    dispatch({ type: 'UPDATE_STOCKLIST', stockList: newStockList });
  }

  function onExpand(expanded, record) {
    if (expanded) {
      // const newExpandedKeys = [...expandedKeys, record.id];
      setExpandedKeys([record.id]);
    } else {
      // const newExpandedKeys = expandedKeys.filter(k => k !== record.id);
      setExpandedKeys([]);
    }
  }

  const extendsProps = { removeStock, addDetail, onDetailChange };
  const columns = getColumns(extendsProps);

  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={stockList}
      columns={columns}
      pagination={false}
      showSorterTooltip={false}
      size="small"
      indentSize={0}
      expandIconColumnIndex={-1}
      onExpand={onExpand}
      expandRowByClick
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
  );
}
