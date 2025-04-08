import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import { ConfHub } from "../../../assets/Images";
import RoleSwitcherButton from '../../RoleSwitcher'; // Import the new button component

const Header = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Admin'); // Default role
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // To detect click outside dropdown

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleRoleChange = (newRole) => {
        setRole(newRole);
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
        SubOrganizer: [
            { name: 'Schedule Sessions', to: '/organizer/schedule' },
            { name: 'Manage Reviews', to: '/organizer/reviews' },
        ],
        Reviewer: [
            { name: 'Assigned Papers', to: '/reviewer/assigned-papers' },
            { name: 'Submit Review', to: '/reviewer/submit-review' },
        ],
        Guest: [{ name: 'Conferences', to: '/conferences' }],
    };

    // Close dropdown if clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const hasSubOrganizerRole = userDetails?.SubOrganizerRole?.length > 0;
    return (
        <header className="bg-gray-100 p-4 flex justify-between items-center border-b border-gray-300">
            <div className="flex items-center relative">
                <button onClick={toggleDropdown} className="text-xl text-gray-700 mr-4">
                    <FaBars />
                </button>
                <Link to="/" className="text-2xl font-bold text-indigo-600 mr-5">
                                    <img src={ConfHub} alt="ConfHub" style={{ height: '30px' }} />
                </Link>

                {/* Dropdown Menu */}
                <div
                    ref={dropdownRef}
                    className={`absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-md w-48 ${dropdownVisible ? 'block' : 'hidden'}`}
                >
                  

                    <Link to="/settings" className="block p-2 text-gray-700 hover:bg-gray-200">
                        Settings
                    </Link>
                    <Link to="/help" className="block p-2 text-gray-700 hover:bg-gray-200">
                        Help
                    </Link>
                </div>

            </div>

            {/* Role Switcher */}
            {hasSubOrganizerRole && (
    <div className="flex items-center ml-auto mr-2 text-base">
        <RoleSwitcherButton
            roles={['Author', 'SubOrganizer']}
            onRoleSelect={handleRoleChange}
        />
    </div>
)}
            {/* Notification and Logout */}
            <div className="flex items-center">
                <span className="text-xl text-gray-700 mr-4">
                    <FaBell />
                </span>
                <button
                    onClick={handleLogout}
                    className="border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-gray-200"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
