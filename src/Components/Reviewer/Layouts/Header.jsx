import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa';
import { ConfHub } from '../../../assets/Images';
import RoleSwitcherButton from '../../RoleSwitcher';

const Header = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Reviewer'); // Default role
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [availableRoles, setAvailableRoles] = useState([]);
    const dropdownRef = useRef(null);

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

    useEffect(() => {
        const storedUser = localStorage.getItem('userDetails');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            const roles = ['Reviewer']; // Default role

            if (user.SubOrganizerRole && user.SubOrganizerRole.length > 0) {
                roles.push('SubOrganizer');
            }

            setAvailableRoles(roles);
        }
    }, []);

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

                <div
                    ref={dropdownRef}
                    className={`absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-md w-48 ${dropdownVisible ? 'block' : 'hidden'}`}
                >
                    <Link to="#" className="block p-2 text-gray-700 hover:bg-gray-200">
                        Settings
                    </Link>
                    <Link to="#" className="block p-2 text-gray-700 hover:bg-gray-200">
                        Help
                    </Link>
                </div>
            </div>

            {/* Conditional Role Switcher */}
            {hasSubOrganizerRole && (
                <div className="flex items-center ml-auto mr-2 text-base">
                    <RoleSwitcherButton
                        roles={availableRoles}
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
