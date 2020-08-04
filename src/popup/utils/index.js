import axios from 'axios';
import $ from 'jquery';

export const APIURL = 'https://tw.stock.yahoo.com/q/q';

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const GET_CELL_PATH = (index) => `table:nth-child(14) > tbody > tr > td > table > tbody > tr:nth-child(2) > td:nth-child(${index})`;

export const TABLE_MAPPING = {
  name: GET_CELL_PATH(1),
  price: GET_CELL_PATH(3),
  max: GET_CELL_PATH(10),
  min: GET_CELL_PATH(11),
  diff: GET_CELL_PATH(6),
  time: GET_CELL_PATH(2),
};

export async function getStockInfo(id, data) {
  const doc = document.createElement('div');
  doc.innerHTML = data;
  const $dom = $(doc);
  const result = Object.keys(TABLE_MAPPING).reduce((prev, k) => {
    const td = $dom.find(TABLE_MAPPING[k]);
    const tdChild = td.find('a, font, b');
    const text = tdChild.length ? tdChild.eq(0).html() : td.html();
    return { ...prev, [k]: text };
  }, { id });
  if (!result.name) { return null; }
  return result;
}

export async function getStock(item) {
  const { id, detail = [] } = item;
  try {
    const { data } = await axios({
      method: 'get',
      params: { s: id },
      url: APIURL,
      'Content-Type': 'xml',
    });
    const sotckInfo = await getStockInfo(id, data);
    if (sotckInfo) {
      return {
        id,
        info: {
          ...sotckInfo,
        },
        detail,
      };
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

export async function getStockList(stockList) {
  const result = [];
  await asyncForEach(stockList, async (obj) => {
    const sotckInfo = await getStock(obj);
    if (sotckInfo) {
      return result.push(sotckInfo);
    }
    return null;
  });
  return result;
}
export default {};
