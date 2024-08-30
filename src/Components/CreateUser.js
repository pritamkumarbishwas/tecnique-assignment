import React, { useState } from 'react';
import { Modal, Form, Button, Toast } from 'react-bootstrap';
import axios from 'axios';

const CreateUser = ({ showModal, handleClose, handleUserCreated }) => {
    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success'); // success or error

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const validateForm = () => {
        let formErrors = {};
        let isValid = true;

        if (!formData.name) {
            formErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.username) {
            formErrors.username = 'Username is required';
            isValid = false;
        }

        if (!formData.email) {
            formErrors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            formErrors.email = 'Email address is invalid';
            isValid = false;
        }

        if (!formData.phone) {
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
            const response = await axios.post('https://jsonplaceholder.typicode.com/users', formData);
            handleUserCreated(response.data); // Notify parent component
            setFormData({
                name: '',
                username: '',
                email: '',
                phone: ''
            }); // Reset form data
            setErrors({}); // Reset validation errors
            handleClose(); // Close the modal after successful submission
            setToastType('success'); // Set toast type to success
            setToastMessage('User created successfully!');
        } catch (error) {
            setError("Error creating user");
            setToastType('error'); // Set toast type to error
            setToastMessage('Failed to create user. Please try again.');
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
                    <Modal.Title>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        {error && <p className="text-danger">{error}</p>}
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                value={formData.name}
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
                                value={formData.username}
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
                                value={formData.email}
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
                                value={formData.phone}
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
                    backgroundColor: toastType === 'success' ? '#28a745' : '#dc3545',
                    color: 'white'
                }}
            >
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </>
    );
};

export default CreateUser;
