import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import an icon
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
const RoleSwitcherButton = ({ roles, onRoleSelect }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        onRoleSelect(role);  // Call parent function to update the role
        setDropdownVisible(false);

        // Navigate to the corresponding dashboard based on the selected role
        switch (role) {
            case 'Admin':
                navigate('/AdminDashboard');
                break;
            case 'Organizer':
                navigate('/OrganizerDashboard');
                break;
            case 'Author':
                navigate('/AuthorDashboard');
                break;
            case 'Reviewer':
                navigate('/ReviewerDashboard');
                break;
            case 'SubOrganizer':
                navigate('/OrganizerDashboard');  // Add route for Sub-Organizer role
                break;
            default:
                navigate('/');
        }
    };

    return (
      <div className="relative">
  <button
    onClick={() => setDropdownVisible((prev) => !prev)}
    className="flex items-center justify-center bg-indigo-600 text-white p-3 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none"
  >
     <UserCircle className="w-6 h-6" />
  </button>

  {dropdownVisible && (
    <div className="absolute left-0 mt-2 p-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
      <div className="space-y-1">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => handleRoleSelect(role)}
            className="block w-full text-left py-2 px-3 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-150"
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  )}
</div>
    );
};

export default RoleSwitcherButton;
