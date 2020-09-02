import React, { useEffect, useState } from 'react';

import { Spin, Alert } from 'antd';

import uuidv4 from 'uuid/v4';
import styled from 'styled-components';

const iframeWidth = 580;
const IframeContainerStyles = styled.div`
  position: relative;
  display: block;
  width: 100%;
  padding-bottom: 80%;
  margin-bottom: -10%;
  iframe {
    position: absolute;
    top:0;
    left: 0;
    height: auto;
    width: ${`${iframeWidth}px`};
    height: 120%;
    border: none;
    outline: 0;
    display:block;
    transform: ${({ size: { width = 0 } }) => {
    const ratio = width ? (width / iframeWidth) : 1;
    return `scale(${ratio})`;
  }};
    transform-origin: 0% 0%;
  }
`;

const title = uuidv4();

export default function IframeContainer(props) {
  const [loading, setLoading] = useState(false);
  const [boxEl, setBoxEl] = useState(null);
  const [, setEl] = useState(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { src } = props;

  useEffect(() => {
    if (boxEl) {
      const boxWidth = boxEl.clientWidth;
      setSize({ ...size, width: boxWidth });
    }
  }, [boxEl]);

  useEffect(() => {
    setLoading(true);
  }, [src]);

  function onLoad() {
    setLoading(false);
  }

  return (
    <Spin spinning={loading} delay={500}>
      <IframeContainerStyles size={size} ref={setBoxEl}>
        <iframe title={title} src={src} onLoad={onLoad} ref={setEl} frameBorder="0" scrolling="no" />
      </IframeContainerStyles>
    </Spin>
  );
}
