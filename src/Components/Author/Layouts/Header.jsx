import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import { ConfHub } from "../../../assets/Images";
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
    position: relative; /* For dropdown positioning */
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
    color: #333;
    text-decoration: none;
    margin-left: 20px;
    padding: 5px 10px;
    border-radius: 5px;
    &:hover {
        background-color: #e9ecef;
    }
`;

const DropdownMenu = styled.div`
    position: absolute;
    top: 50px; /* Adjust to position dropdown below button */
    left: 10px;
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 200px;
    z-index: 100;
    display: ${(props) => (props.visible ? 'block' : 'none')};
`;

const DropdownItem = styled(Link)`
    display: block;
    padding: 10px 15px;
    color: #333;
    text-decoration: none;
    &:hover {
        background-color: #f8f9fa;
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

const Header = ({ role }) => {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

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
        Guest: [{ name: 'Conferences', to: '/conferences' }],
    };
    const handleLogout = () => {
        localStorage.clear(); 
        navigate('/'); 
    };

    return (
        <HeaderContainer>
            <LeftSection>
                <MenuButton onClick={toggleDropdown}>
                    <FaBars />
                </MenuButton>
                <Logo to="/">
                <img style={{ height:'30px' }} src={ConfHub}  />
                </Logo>
                <DropdownMenu visible={dropdownVisible}>

                    <DropdownItem to="/SubmitPaper">
                    Manage Invitation
                    </DropdownItem>
                    <DropdownItem to="/conference/:id">
                    View Conference Details
                    </DropdownItem>
                    <DropdownItem to="/conference/:id">
                    Submit Review
                    </DropdownItem>
                    <DropdownItem to="/settings">Settings</DropdownItem>
                    <DropdownItem to="/help">Help</DropdownItem>

                    <DropdownItem disabled>
                        Submit Paper
                    </DropdownItem>
                    
                    <DropdownItem disabled>Settings</DropdownItem>
                    <DropdownItem disabled>Help</DropdownItem>

                </DropdownMenu>
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
                <NotificationIcon>
                    <FaBell />
                </NotificationIcon>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </RightSection>
        </HeaderContainer>
    );
};

export default Header;
