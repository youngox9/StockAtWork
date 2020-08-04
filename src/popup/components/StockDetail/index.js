import React, { useState } from 'react';

import { Tabs } from 'antd';

import IframeContainer from '~~components/IframeContainer';
import { useContextValue } from '~~hooks/useContextProvider';

const STOCKDETAIL_SETTING = {
  STX: 'https://s.yimg.com/nb/tw_stock_frontend/scripts/StxChart/StxChart.9d11dfe155.html?sid=',
  TA: ' https://s.yimg.com/nb/tw_stock_frontend/scripts/TaChart/tachart.3de240ea9a.html?sid=',
};

const { TabPane } = Tabs;

export default function StockDetail(props) {
  const { stockId } = props;
  const [contextValue, dispatch] = useContextValue();
  const [activeTab, setActiveTab] = useState('0');

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} size="small">
      <TabPane tab="走勢圖" key={0}>
        <IframeContainer src={`${STOCKDETAIL_SETTING.STX}${stockId}`} />
      </TabPane>
      <TabPane tab="技術分析" key={1}>
        <IframeContainer src={`${STOCKDETAIL_SETTING.TA}${stockId}`} />
      </TabPane>
    </Tabs>
  );
}
