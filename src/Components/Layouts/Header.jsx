import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa'; // Import icons

const HeaderContainer = styled.header`
    background-color: #f8f9fa;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dee2e6;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

const Logo = styled(Link)`
    font-size: 1.75rem;
    font-weight: bold;
    text-decoration: none;
    color: #3f51b5;
    margin-right: 20px;
    span {
        color: #9c27b0;
    }
`;

const MenuButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #555;
    cursor: pointer;
    margin-right: 20px;
`;

const Nav = styled.nav`
    display: flex;
`;

const NavItem = styled(Link)`
    color: #333; /* Darker text for nav items */
    text-decoration: none;
    margin-left: 20px;
    padding: 5px 10px; /* Add some padding */
    border-radius: 5px; /* Rounded corners */
    &:hover {
        background-color: #e9ecef; /* Light gray on hover */
    }
`;


const RightSection = styled.div`
    display: flex;
    align-items: center;
`;

const NotificationIcon = styled.span`
    font-size: 1.2rem;
    color: #555;
    margin-right: 20px;
`;

const LogoutButton = styled.button`
    border: 1px solid #007bff;
    color: #007bff;
    padding: 8px 15px;
    border-radius: 5px;
    background-color: transparent;
    cursor: pointer;

    &:hover {
        background-color: #e9ecef;
    }
`;

const Header = ({ role }) => { // Receive role as a prop
    const links = {
        Admin: [
            { name: 'Dashboard', to: '/admin/dashboard' },
            { name: 'Users', to: '/admin/users' },
            { name: 'Settings', to: '/admin/settings' },
        ],
        Author: [
            { name: 'Submit Paper', to: '/author/submit' },
            { name: 'My Submissions', to: '/author/submissions' },
        ],
        Organizer: [
            { name: 'Schedule Sessions', to: '/organizer/schedule' },
            { name: 'Manage Reviews', to: '/organizer/reviews' },
        ],
        Reviewer: [{ name: 'Assigned Reviews', to: '/reviewer/reviews' }],
        Guest: [{name: 'Conferences', to: '/conferences'}]
    };

    return (
        <HeaderContainer>
            <LeftSection>
                <MenuButton><FaBars /></MenuButton>
                <Logo to="/">Conf<span>Hub</span></Logo>
              
                {role && (
                    <Nav>
                        {links[role]?.map((link) => (
                            <NavItem key={link.name} to={link.to}>
                                {link.name}
                            </NavItem>
                        ))}
                    </Nav>
                )}
            </LeftSection>
            <RightSection>
                <NotificationIcon><FaBell /></NotificationIcon>
                <LogoutButton>Logout</LogoutButton>
            </RightSection>
        </HeaderContainer>
    );
};

export default Header;