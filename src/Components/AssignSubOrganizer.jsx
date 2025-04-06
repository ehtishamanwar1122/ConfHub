import React, { useState } from 'react';

const AssignSubOrganizer = ({ conferenceId, onClose }) => {
    // Dummy data for authors and reviewers
    const authors = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Robert Brown' },
    ];

    const reviewers = [
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Charlie Lee' },
        { id: 3, name: 'Eva Green' },
    ];

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [error, setError] = useState('');

    const handleUserSelection = (userId) => {
        setSelectedUsers(prevState =>
            prevState.includes(userId)
                ? prevState.filter(id => id !== userId) // Remove user if already selected
                : [...prevState, userId] // Add user if not selected
        );
    };

    const handleAssign = () => {
        if (selectedUsers.length === 0) {
            setError('Please select at least one person to assign');
            return;
        }

        // Simulate assigning sub-organizers by logging the selected user IDs
        console.log(`Assigned Sub-Organizers for conference ${conferenceId}:`, selectedUsers);
        onClose(); // Close modal after success
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-lg">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Assign Sub-Organizers</h2>
                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Users</h3>

                {/* Authors List */}
                <div className="mb-6 border-b pb-4">
                    <h4 className="font-medium text-gray-600 mb-2">Authors</h4>
                    <div>
                        {authors.map((author) => (
                            <div key={author.id} className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    value={author.id}
                                    onChange={() => handleUserSelection(author.id)}
                                    className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded mr-3"
                                />
                                <label className="text-gray-800">{author.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviewers List */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-600 mb-2">Reviewers</h4>
                    <div>
                        {reviewers.map((reviewer) => (
                            <div key={reviewer.id} className="flex items-center mb-3">
                                <input
                                    type="checkbox"
                                    value={reviewer.id}
                                    onChange={() => handleUserSelection(reviewer.id)}
                                    className="form-checkbox h-5 w-5 text-blue-500 border-gray-300 rounded mr-3"
                                />
                                <label className="text-gray-800">{reviewer.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="bg-gray-400 text-white py-2 px-6 rounded-md hover:bg-gray-500 transition duration-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Assign Sub-Organizers
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignSubOrganizer;
