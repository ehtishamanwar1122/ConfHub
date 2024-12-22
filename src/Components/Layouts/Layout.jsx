import React from 'react';
import Header from './Header'; // Relative import from the same folder
import Footer from './Footer';
import styled from 'styled-components';

const Content = styled.main`
    padding: 20px;
    min-height: calc(100vh - 100px); /* Adjust as needed */
`;

const Layout = ({ children }) => {
    return (
        <div>
            <Header />
            <Content>
                {children}
            </Content>
            <Footer />
        </div>
    );
};

export default Layout; // Default export is common for Layout components