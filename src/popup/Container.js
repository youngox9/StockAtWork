import React, { useEffect, useState } from 'react'
import axios from 'axios'
import $ from 'jquery'
import styled from 'styled-components'
import { Card, Table, Tag, Space, Input, Button } from 'antd';

import {
  DeleteOutlined,
} from '@ant-design/icons';

const { Search } = Input;
window.$ = $;

const URL = 'https://tw.stock.yahoo.com/q/q';
const GET_CELL_PATH = (index) => `table:nth-child(14) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(${index})`

const TABLE_MAPPING = {
  name: GET_CELL_PATH(1),
  price: GET_CELL_PATH(3),
  max: GET_CELL_PATH(10),
  min: GET_CELL_PATH(11),
  diff: GET_CELL_PATH(6),
  time: GET_CELL_PATH(2),
}

const getColumns = (props) => [
  {
    title(val, racord) {
      return (
        <p>名稱</p>
      )
    },
    dataIndex: 'name',
    key: 'name',
    width: 100,
    render(val, racord) {
      return (
        <p>{val} </p>
      )
    }
  },
  {
    title(val, racord) {
      return (
        <p>今價</p>
      )
    },
    dataIndex: 'price',
    key: 'price',
    render(val, racord) {
      return (
        <p>{val} </p>
      )
    }
  },
  {
    title(val, racord) {
      return (
        <p>最高</p>
      )
    },
    dataIndex: 'max',
    key: 'max',
    render(val, racord) {
      return (
        <p>{val} </p>
      )
    }
  },
  {
    title(val, racord) {
      return (
        <p>最低</p>
      )
    },
    dataIndex: 'min',
    key: 'min',
    render(val, racord) {
      return (
        <p>{val} </p>
      )
    }
  },
  {
    title(val, racord) {
      return (
        <p>漲幅</p>
      )
    },
    dataIndex: 'diff',
    key: 'diff',
    render(val, racord) {
      const isGreen = val.indexOf('▽') >= 0;
      return (
        <Tag color={isGreen ? 'green' : 'red'} >
          {val}
        </Tag>
      )
    }
  },
  // {
  //   title(val, racord) {
  //     return (
  //       <p></p>
  //     )
  //   },
  //   dataIndex: 'time',
  //   key: 'time',
  //   render(val, racord) {
  //     return (
  //       <p>{val} </p>
  //     )
  //   }
  // },
  {
    title(val, racord) {
      return (
        <p></p>
      )
    },
    dataIndex: 'diff',
    key: 'diff',
    render(val, racord) {
      const { id } = racord;
      return <DeleteOutlined onClick={() => props.removeStock(id)} />;
    }
  },
];


const ContainerWrap = styled.div`
  max-width: 100%;
  display: block;
  margin: 0 auto;
  max-width: 300px;
  margin: 0 auto;
  padding: 6px;
  .ant-table {
    width: 100%;
    td, 
    th {
      text-align: center;
      padding: 6px  !important;
      >p {
        font-size: 6px !important;
      }
      
    }
  }
`;

async function getStockInfo(id, data) {
  const doc = document.createElement("div");
  doc.innerHTML = data;
  const $dom = $(doc);
  const result = Object.keys(TABLE_MAPPING).reduce((prev, k) => {
    const td = $dom.find(TABLE_MAPPING[k]);
    const tdChild = td.find('a, font, b');
    const text = tdChild.length ? tdChild.eq(0).html() : td.html();
    return { ...prev, [k]: text }
  }, { id })
  if (!result.name) { return null; }
  return result;
}


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}


async function getStock(id) {
  try {
    const { data } = await axios({
      method: 'get',
      params: { s: id },
      url: URL,
      'Content-Type': 'xml',
    })
    const sotckInfo = await getStockInfo(id, data);
    if (sotckInfo) {
      return sotckInfo;
    }
  } catch (e) {
    console.log(e);
  }
}

async function getStockList(ids) {
  const result = [];
  await asyncForEach(ids, async id => {
    const sotckInfo = await getStock(id);
    console.log(sotckInfo);
    if (sotckInfo) {
      return result.push(sotckInfo);
    }
  })
  return result;
}

export default function Container(props) {
  const [loading, setLoading] = useState(true);
  const [stockInfo, setStockInfo] = useState(null);
  const [stockList, setStockList] = useState([]);
  const [stockIds, setStockIds] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('item');
    const historyStockIds = data ? JSON.parse(data) : []
    setStockIds(historyStockIds);
  }, [])

  useEffect(() => {
    const ids = stockIds.map(o => o.id);
    getList(ids);
  }, [JSON.stringify(stockIds)])


  useEffect(() => {
    localStorage.setItem('item', JSON.stringify(stockIds))
  }, [JSON.stringify(stockIds)])

  async function getList(ids) {
    setLoading(true);
    const newStockList = await getStockList(ids);
    setStockList(newStockList);
    setLoading(false);
  }

  function addStock(id) {
    const isExist = stockIds.find(o => o.id === id);
    if (!isExist) {
      const newStockList = [...stockIds, { id, list: [] }];
      setStockIds(newStockList)
      setStockInfo(null);
    }
  }

  async function searchStockInfo(id) {
    setLoading(true);
    const stockInfo = await getStock(id);
    if (stockInfo) {
      setStockInfo(stockInfo);
    }
    setLoading(false);
  }

  function removeStock(id) {
    const newStockList = stockIds.reduce((prev, curr) => {
      if (curr.id !== id) {
        return [...prev, curr];
      }
      return prev;
    }, [])
    setStockIds(newStockList)
  }

  const columns = getColumns({ removeStock })
  const isGreen = stockInfo && stockInfo.diff.indexOf('▽') >= 0;
  return (
    <ContainerWrap>
      <Search
        placeholder="搜尋股票"
        onSearch={value => searchStockInfo(value)}
        enterButton
      />
      {stockInfo &&
        <Card
          bordered
        >
          <p>名稱：{stockInfo.name}</p>
          <p>今價：{stockInfo.price}</p>
          <p>漲跌：
            <Tag color={isGreen ? 'green' : 'red'} >
              {stockInfo.diff}
            </Tag></p>
          <p>最高：{stockInfo.max}</p>
          <p>最低：{stockInfo.min}</p>
          <Button type="primary" size='small' onClick={() => addStock(stockInfo.id)}>
            加入追蹤
        </Button>
        </Card>
      }
      <Table loading={loading} dataSource={stockList} columns={columns} />
    </ContainerWrap>
  );
}
