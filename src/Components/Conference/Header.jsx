import React from "react";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from '../ChangePasswordModal';
import { FaBars } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const [showChangePasswordModal, setShowChangePasswordModal] = React.useState(false);
  const [dropdownVisible, setDropdownVisible] = React.useState(false);

  const handleLogoutClick = () => {
    navigate("/login");
    localStorage.clear();
  };

  return (
    <nav className="navbar relative">
      <button
        className="text-xl text-gray-700 mr-4 bg-transparent border-none"
        onClick={() => setDropdownVisible((v) => !v)}
      >
        <FaBars />
      </button>
      {dropdownVisible && (
        <div className="absolute top-12 right-0 bg-white border border-gray-300 rounded-lg shadow-lg w-48 z-10">
          <button
            className="block w-full text-left px-4 py-2 bg-white text-black hover:bg-gray-100"
            onClick={() => { setShowChangePasswordModal(true); setDropdownVisible(false); }}
          >
            Change Password
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      )}
      <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
    </nav>
  );
};

export default Header;
