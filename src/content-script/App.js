import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const FixedDiv = styled.div`
  position: fixed;
  width: 300px;
  padding-bottom: 10%;
  top: 0;
  left: 0;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const App = ({ classes }) => {
  return (
    <FixedDiv>
      <iframe src="https://www.youtube.com/embed/ioNng23DkIM?rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen />
    </FixedDiv>
  )
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default App;
