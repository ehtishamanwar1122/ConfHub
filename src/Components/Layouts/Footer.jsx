import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
    background-color: #343a40; 
    color: #fff;
    padding: 25px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    position: relative; /* Can be changed to fixed if needed */
    bottom: 0;
    margin: 0; /* Removes left and right margin */
    margin-top: auto; /* Pushes footer to the bottom if the container is a flexbox */
`;


const FooterText = styled.p`
    font-size: 0.9rem;
    margin:0;
`;

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <FooterContainer>
            <FooterText>ConfHub</FooterText>
            <FooterText>Company, {currentYear} &copy; All Rights Reserved</FooterText>
        </FooterContainer>
    );
};

export default Footer;