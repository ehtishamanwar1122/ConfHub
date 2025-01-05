import React from 'react';
import Header from './Header'; // Relative import from the same folder
import Footer from './Footer';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Ensures the layout takes at least the full viewport height */
`;

const Content = styled.main`
  flex-grow: 1; /* Makes sure content takes available space */
  padding: 20px;
  overflow: auto; /* Ensures the content area scrolls if it overflows */
`;

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <Header />
      <Content>
        {children}
      </Content>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
