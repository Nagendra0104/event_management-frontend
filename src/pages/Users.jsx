import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, [filter]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/users');
            const filteredUsers = filter === 'all' ? response.data.users : response.data.users.filter(user => user.role === filter);
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/user/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser({ ...selectedUser, [name]: value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/user/${selectedUser._id}`, selectedUser);
            fetchUsers();
            handleModalClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-5">
            <div className="mb-5 flex gap-2">
                <button onClick={() => setFilter('admin')} className="px-4 py-2 bg-blue-500 text-white rounded">Admin</button>
                <button onClick={() => setFilter('organizer')} className="px-4 py-2 bg-green-500 text-white rounded">Organizers</button>
                <button onClick={() => setFilter('user')} className="px-4 py-2 bg-yellow-500 text-white rounded">Users</button>
                <button onClick={() => setFilter('all')} className="px-4 py-2 bg-gray-500 text-white rounded">All</button>
                <input 
                    type="text" 
                    placeholder="Search by name or email" 
                    value={search} 
                    onChange={handleSearch} 
                    className="px-4 py-2 rounded border border-gray-300 flex-1"
                />
            </div>
            <table className="w-full border-collapse shadow-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Role</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map(user => (
                        <tr key={user._id}>
                            <td className="p-2 border">{user.name}</td>
                            <td className="p-2 border">{user.email}</td>
                            <td className="p-2 border">{user.role}</td>
                            <td className="p-2 border text-center flex justify-center">
                                <FaEdit className="mr-2 cursor-pointer" onClick={() => handleEdit(user)} />
                                <FaTrashAlt className="cursor-pointer" onClick={() => handleDelete(user._id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded shadow-lg w-[40%]">
                        <h2 className="text-xl mb-4">Edit User</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={selectedUser.name} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    value={selectedUser.email} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-2 border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Role</label>
                                <select 
                                    name="role" 
                                    value={selectedUser.role} 
                                    onChange={handleInputChange} 
                                    className="w-full px-4 py-2 border rounded"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="organizer">Organizer</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button type="button" onClick={handleModalClose} className="px-4 py-2 bg-gray-500 text-white rounded mr-2">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
