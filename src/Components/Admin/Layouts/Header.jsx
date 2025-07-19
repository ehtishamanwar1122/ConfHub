import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import { ConfHub } from "../../../assets/Images";
import RoleSwitcherButton from '../../RoleSwitcher'; // Import RoleSwitcherButton
import ChangePasswordModal from '../../ChangePasswordModal';

const Header = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('Admin'); // Default role
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null); // To detect click outside dropdown
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

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

    return (
        <header className="bg-gray-50 py-4 px-6 flex items-center justify-between border-b border-gray-300">
            <div className="flex items-center relative">
                <button onClick={toggleDropdown} className="bg-transparent border-none text-gray-600 text-2xl cursor-pointer mr-5">
                    <FaBars />
                </button>
                <Link to="/" className="text-2xl font-bold text-indigo-600 mr-5">
                    <img src={ConfHub} alt="ConfHub" style={{ height: '30px' }} />
                </Link>

                {/* Dropdown Menu */}
                <div
                    ref={dropdownRef}
                    className={`absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48 ${dropdownVisible ? 'block' : 'hidden'}`}
                >
                    <Link to="/AdminDashboard" className="block py-3 px-4 text-gray-700 hover:bg-gray-100">Organizer Requests</Link>
                    <Link to="/AdminConferenceManager" className="block py-3 px-4 text-gray-700 hover:bg-gray-100">Conference Requests</Link>
                    <Link to="#" className="block py-3 px-4 text-gray-500 cursor-not-allowed">Help</Link>
                    <button
                      className="block w-full text-left py-3 px-4 bg-white text-black hover:bg-gray-100"
                      onClick={() => { setShowChangePasswordModal(true); setDropdownVisible(false); }}
                    >
                      Change Password
                    </button>
                </div>

            </div>

            {/* Role Switcher */}
            <div className="flex items-center ml-auto mr-2 text-base">
                <RoleSwitcherButton
                    roles={['Admin', 'Author', 'Organizer', 'Reviewer', 'Guest', 'SubOrganizer']}
                    onRoleSelect={handleRoleChange}
                />
            </div>

            {/* Notification and Logout */}
            <div className="flex items-center">
                <span className="text-xl text-gray-600 mr-5">
                    <FaBell />
                </span>
                <button
                    onClick={handleLogout}
                    className="border border-blue-500 text-blue-500 py-2 px-4 rounded-md bg-transparent hover:bg-gray-100"
                >
                    Logout
                </button>
            </div>
            <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
        </header>
    );
};

export default Header;
