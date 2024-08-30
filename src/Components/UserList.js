import React, { useState, useEffect } from 'react';
import { Table, Pagination, Button, Form } from 'react-bootstrap';
import axios from 'axios';
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
    };


    const handleUserUpdated = (updatedUser) => {
        setUsers(prevUsers => prevUsers.map(user =>
            user.id === updatedUser.id ? updatedUser : user
        ));
        setShowEditModal(false);
    };

    const handleUserDelete = async () => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user?");
        if (!isConfirmed) return;

        try {
            await Promise.all(selectedUsers.map(userId =>
                axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
            ));
            setUsers(prevUsers => prevUsers.filter(user => !selectedUsers.includes(user.id)));
            setSelectedUsers([]);
        } catch (error) {
            setError("Error deleting users");
        }
    };

    const handleSpecificUserDelete = async (userId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this user?");
        if (!isConfirmed) return;

        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${userId}`);
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } catch (error) {
            setError("Error deleting user");
        }
    };


    const handleCheckboxChange = (userId) => {
        setSelectedUsers(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
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
                <Button
                    variant="outline-danger"
                    onClick={handleUserDelete}
                    disabled={selectedUsers.length === 0}
                    className="ms-2"
                >
                    Delete Selected
                </Button>
            </div>
            <Table striped bordered hover responsive="sm">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleCheckboxChange(user.id)}
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
                                    onClick={() => handleSpecificUserDelete(user.id)}
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
        </div>
    );
};

export default UserList;
