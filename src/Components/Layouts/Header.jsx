import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaBell } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';
import { ConfHub } from '../../assets/Images';
import RoleSwitcherButton from '../RoleSwitcher'; // Import the new button component
import ChangePasswordModal from '../ChangePasswordModal';

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
            { name: 'Create Conference', to: '/CreateConference' }, // Create Conference option
        ],
        SubOrganizer: [ // SubOrganizer should see Organizer options without Create Conference
            { name: 'Schedule Sessions', to: '/organizer/schedule' },
            { name: 'Manage Reviews', to: '/organizer/reviews' },
        ],
        Reviewer: [{ name: 'Assigned Reviews', to: '/reviewer/reviews' }],
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

    const handleRoleChange = (newRole) => {
        setRole(newRole);
    };
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const isSubOrganizer = userDetails?.SubOrganizerRole?.length > 0;
    console.log('k',isSubOrganizer);
    

    const usertype = JSON.parse(localStorage.getItem('userDetails'));

let availableRoles = [];

if (usertype?.Type === 'reviewer') {
    availableRoles = ['Reviewer', 'SubOrganizer'];
} else if (usertype?.Type === 'author') {
    availableRoles = ['Author', 'SubOrganizer'];
}
    return (
      <>
        <header className="bg-gray-100 p-4 flex items-center justify-between border-b border-gray-300">
          <div className="flex items-center relative">
            <button
              onClick={toggleDropdown}
              className="bg-inherit text-gray-600 text-2xl mr-5"
            >
              <FaBars />
            </button>
            <Link to="/" className="text-2xl font-bold text-indigo-600 mr-5">
              <img src={ConfHub} alt="ConfHub" style={{ height: "30px" }} />
            </Link>
            {dropdownVisible && (
              <div
                ref={dropdownRef}
                className="absolute top-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10"
              >
                {!isSubOrganizer && (
                  <Link
                    to="/CreateConference"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Create New Conference
                  </Link>
                )}
                <Link
                  to="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Manage Conferences
                </Link>
                <Link
                  to="/ManageReviewerRequests"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Manage Reviewer Requests
                </Link>
                <Link
                  to="/Settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <Link
                  to="/Help"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Help
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100"
                  onClick={() => { setShowChangePasswordModal(true); setDropdownVisible(false); }}
                >
                  Change Password
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center ml-auto mr-2 text-base">
            <RoleSwitcherButton
              roles={availableRoles}
              onRoleSelect={handleRoleChange}
            />
          </div>

          <div className="flex items-center">
            <span className="text-gray-600 text-xl mr-5">
              <FaBell />
            </span>
            <button
              onClick={handleLogout}
              className="border bg-inherit border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </header>
        <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
      </>
    );
};

export default Header;
