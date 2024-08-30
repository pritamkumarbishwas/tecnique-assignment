import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Pagination, Button, Toast } from 'react-bootstrap';
import CreateUser from './CreateUser';
import EditUser from './EditUser';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // 'success' or 'error'
    const usersPerPage = 5;

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://jsonplaceholder.typicode.com/users");
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching Users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserCreated = (newUser) => {
        setUsers(prevUsers => [newUser, ...prevUsers]);
        setShowCreateModal(false);
        showToastMessage('User created successfully', 'success');
    };

    const handleUserUpdated = (updatedUser) => {
        setUsers(prevUsers => prevUsers.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
        setShowEditModal(false);
        showToastMessage('User updated successfully', 'success');
    };

    const handleSpecificUserDelete = async () => {
        const userId = selectedUsers[0];
        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
            setSelectedUsers([]);
            showToastMessage('User deleted successfully', 'success');
        } catch (error) {
            showToastMessage('Error deleting user', 'error');
        }
    };

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-4">
            <h2>User List</h2>
            <div className='d-flex justify-content-end pb-2'>
                <Button
                    variant="outline-dark"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create New User
                </Button>
            </div>
            <Table striped bordered hover responsive="sm">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedUsers(users.map(user => user.id));
                                    } else {
                                        setSelectedUsers([]);
                                    }
                                }}
                                checked={selectedUsers.length === users.length}
                            />
                        </th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedUsers(prev => [...prev, user.id]);
                                        } else {
                                            setSelectedUsers(prev => prev.filter(id => id !== user.id));
                                        }
                                    }}
                                />
                            </td>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>
                                <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="me-2"
                                    onClick={() => {
                                        setSelectedUserId(user.id);
                                        setShowEditModal(true);
                                    }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this user?')) {
                                            handleSpecificUserDelete();
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-end">
                <Pagination>
                    {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map((number) => (
                        <Pagination.Item
                            key={number + 1}
                            onClick={() => paginate(number + 1)}
                            active={number + 1 === currentPage}
                        >
                            {number + 1}
                        </Pagination.Item>
                    ))}
                </Pagination>
            </div>
            <CreateUser
                showModal={showCreateModal}
                handleClose={() => setShowCreateModal(false)}
                handleUserCreated={handleUserCreated}
            />
            <EditUser
                showModal={showEditModal}
                handleClose={() => setShowEditModal(false)}
                userId={selectedUserId}
                handleUserUpdated={handleUserUpdated}
            />
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: toastType === 'success' ? '#28a745' : '#dc3545',
                    color: 'white'
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </div>
    );
};

export default UserList;
