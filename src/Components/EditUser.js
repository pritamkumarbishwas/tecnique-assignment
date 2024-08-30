import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Toast } from 'react-bootstrap';
import axios from 'axios';

const EditUser = ({ showModal, handleClose, userId, handleUserUpdated }) => {
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState(''); // success or error
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (userId) {
            axios.get(`https://jsonplaceholder.typicode.com/users/${userId}`)
                .then(response => setUserData(response.data))
                .catch(error => console.error('Error fetching user data:', error));
        }
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!userData.name) {
            formErrors.name = 'Name is required';
            isValid = false;
        }

        if (!userData.username) {
            formErrors.username = 'Username is required';
            isValid = false;
        }

        if (!userData.email) {
            formErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            formErrors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!userData.phone) {
            formErrors.phone = 'Phone number is required';
            isValid = false;
        }

        setErrors(formErrors);
        return isValid;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${userId}`, userData);
            handleUserUpdated(response.data); // Notify parent component
            setToastType('success');
            setToastMessage('User updated successfully!');
        } catch (error) {
            setToastType('error');
            setToastMessage('Failed to update user. Please try again.');
        } finally {
            setShowToast(true); // Show toast
        }
    };

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formUsername" className="mt-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={userData.username}
                                onChange={handleChange}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.username}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mt-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formPhone" className="mt-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter phone number"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                                isInvalid={!!errors.phone}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phone}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <div className="d-flex justify-content-end mt-3">
                            <Button
                                variant="secondary"
                                onClick={handleClose}
                                className="me-2"
                            >
                                Close
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: toastType === 'success' ? '#28a745' : '#dc3545', // Green for success, red for error
                    color: 'white'
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </>
    );
};

export default EditUser;
