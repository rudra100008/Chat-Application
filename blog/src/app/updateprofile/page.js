"use client"
import React, { Fragment, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import Link from "next/link";
import axios from 'axios';

export default function UpdateProfile() {
    const getToken = () => {
        return localStorage.getItem('token')
    }
    const getUserId = () => {
        return localStorage.getItem('userId')
    }
    const handleFileChange=(e)=>{
        setUser({...user,image:e.target.files[0]})
    }
    const [user, setUser] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        description: "",
        image : null
    })
    const [validationError, setValidationError] = useState({
        username: "",
        email: "",
        phoneNumber: "",
        description: "",
        image:""
    })
    const updateProfile = () => {
        const formData =new FormData();
        formData.append("user", new Blob([JSON.stringify({
            username : user.username,
            email:user.email,
            phoneNumber: user.phoneNumber,
            description: user.description
        })],{type : "application/json"}))
        formData.append("image",user.image)
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
            <Fragment>
                <Form noValidate onSubmit={handleUpdate} className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
                    <h3 className="text-center mb-4">Create your account</h3>

                    <FormGroup>
                        <Label htmlFor="username">Username:</Label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            invalid={!!validationError.username}
                            placeholder="Enter username"
                        />
                        <p className="text-red-500">{validationError.username}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="email">Email:</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            invalid={!!validationError.email}
                            placeholder="Enter email"
                        />
                        <p className="text-red-500">{validationError.email}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="phoneNumber">Phone Number:</Label>
                        <Input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                            invalid={!!validationError.phoneNumber}
                            placeholder="Enter 10-digit phone number"
                        />
                        <p className="text-red-500">{validationError.phoneNumber}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="description">About Yourself:</Label>
                        <Input
                            type="textarea"
                            id="description"
                            name="description"
                            value={user.description}
                            onChange={(e) => setUser({ ...user, description: e.target.value })}
                            invalid={!!validationError.description}
                            placeholder="Tell us a little about yourself"
                        />
                        <p className="text-red-500">{validationError.description}</p>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="image">Image</Label>
                        <Input
                            type="file"
                            name="image"
                            id="image"
                            invalid={validationError.image}
                            onChange={handleFileChange}

                        />
                        <p className="text-red-300  text-sm ">{validationError.image}</p>
                    </FormGroup>

                    <FormGroup>
                        <button type="Submit" className="bg-blue-400 p-2 text-white font-semibold rounded-xl shadow-lg transition-transform hover:bg-blue-500 hover:scale-110">
                            Update
                        </button>
                    </FormGroup>

                    <p className="mt-4 font-semibold text-sm text-center">
                        <Link className="no-underline text-blue-500 hover:text-blue-300 hover:underline" href="/">Already have an account?</Link>
                    </p>
                </Form>
            </Fragment>
        </div>
    )
}
