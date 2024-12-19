import React from 'react';

const Navbar = ({ role }) => {
  const links = {
    Admin: ['Dashboard', 'Users', 'Settings'],
    Author: ['Submit Paper', 'My Submissions'],
    Organizer: ['Schedule Sessions', 'Manage Reviews'],
    Reviewer: ['Assigned Reviews'],
  };

  return (
    <nav>
      <ul>
        {links[role]?.map((link) => (
          <li key={link}>{link}</li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
