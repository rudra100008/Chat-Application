"use client"
import React, { Fragment, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';

export default function UpdateProfile({model}) {
    const getToken = () => {
        return localStorage.getItem('token')
    }
    const getUserId = () => {
        return localStorage.getItem('userId')
    }
    const handleFileChange = (e) => {
        setUser({ ...user, image: e.target.files[0] })
    }
    const [user, setUser] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        description: "",
        image: null
    })
    const [validationError, setValidationError] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        description: "",
        image: ""
    })
    const updateProfile = () => {
        const formData = new FormData();
        formData.append("user", new Blob([JSON.stringify({
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            description: user.description
        })], { type: "application/json" }))
        formData.append("image", user.image)
        axios.put(`${base_url}/users/${getUserId()}`, formData, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response) => {
            console.log(response.data);
            setUser({ username: "", email: "", phoneNumber: "", description: "" })
            toast.success("Profile Updated")
            setValidationError({})
        })
            .catch((error) => {
                console.log(error.response.data)
                if (error.response.status === 400) {
                    const { message } = error.response.data;
                    if (typeof message === 'object') {
                        setValidationError(message);
                    } else {
                        toast.error(message);
                    }
                } else {
                    toast.error("Unexcepted error occured")
                }
            })
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        updateProfile();
    }
    return (
        <div className="min-h-screen items-center flex justify-center">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full">
                    <button onClick={model} className="absolute top-4 right-5 text-gray-500 hover:text-gray-700">
                        <FontAwesomeIcon icon={faClose} />
                    </button>
                    <h3 className="text-2xl font-bold text-gray-700 text-center mb-6">Edit Profile</h3>

                    <Form noValidate onSubmit={handleUpdate} className="space-y-4">
                        <FormGroup>
                            <Label htmlFor="username" className="block text-sm font-semibold text-gray-600">Username</Label>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                                invalid={!!validationError.username}
                                placeholder="Enter username"
                                className="w-full border rounded-lg py-2 px-3 text-sm shadow focus:ring-2 focus:ring-blue-400"
                            />
                            <p className="text-red-500 text-xs">{validationError.username}</p>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="email" className="block text-sm font-semibold text-gray-600">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                invalid={!!validationError.email}
                                placeholder="Enter email"
                                className="w-full border rounded-lg py-2 px-3 text-sm shadow focus:ring-2 focus:ring-blue-400"
                            />
                            <p className="text-red-500 text-xs">{validationError.email}</p>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-600">Phone Number</Label>
                            <Input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={user.phoneNumber}
                                onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                                invalid={!!validationError.phoneNumber}
                                placeholder="Enter 10-digit phone number"
                                className="w-full border rounded-lg py-2 px-3 text-sm shadow focus:ring-2 focus:ring-blue-400"
                            />
                            <p className="text-red-500 text-xs">{validationError.phoneNumber}</p>
                        </FormGroup>

                        <FormGroup>
                            <Label htmlFor="description" className="block text-sm font-semibold text-gray-600">About Yourself</Label>
                            <Input
                                type="textarea"
                                id="description"
                                name="description"
                                value={user.description}
                                onChange={(e) => setUser({ ...user, description: e.target.value })}
                                invalid={!!validationError.description}
                                placeholder="Tell us a little about yourself"
                                className="w-full border rounded-lg py-2 px-3 text-sm shadow focus:ring-2 focus:ring-blue-400"
                            />
                            <p className="text-red-500 text-xs">{validationError.description}</p>
                        </FormGroup>

                        <FormGroup className="relative">
                            <Label htmlFor="image" className="block text-sm font-semibold text-gray-600">Profile Image</Label>
                            <div className="flex items-center space-x-4">
                                {user.image && (
                                    <img src={URL.createObjectURL(user.image)} alt="profile preview" className="h-16 w-16 rounded-full border object-cover" />
                                )}
                                <Input
                                    type="file"
                                    name="image"
                                    id="image"
                                    invalid={!!validationError.image}
                                    onChange={handleFileChange}
                                    className="py-2 px-3 w-full text-sm"
                                />
                            </div>
                            <p className="text-red-500 text-xs">{validationError.image}</p>
                        </FormGroup>

                        <div className="text-center mt-6">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition ease-in-out duration-200"
                            >
                                Update Profile
                            </button>
                        </div>
                    </Form>
                </div>
            </div>

        </div>
    )
}
