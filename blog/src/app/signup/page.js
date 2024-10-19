"use client";
import axios from "axios";
import { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import Link from "next/link";

export default function Signup() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        description: ""
    });

    const [validationError, setValidationError] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: "",
        description: ""
    });

    const postUserToServer = () => {
        axios.post(`${base_url}/register`, user).then(
            (response) => {
                console.log(response.data);
                setUser({ username: "", email: "", password: "", phoneNumber: "", description: "" });
                toast.success(response.data.message);
                setValidationError({});
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }).catch((error) => {
                console.log(error.response.data);
                if (error.response.status === 400) {
                    const { message } = error.response.data;
                    if (typeof message === 'string') {
                        toast.error(message);
                    } else if (typeof message === 'object') {
                        setValidationError(message);
                    }
                    setValidationError(message);
                } else {
                    toast.error("Unexpected error occurred.");
                }
            });
    };

    const handleForm = (e) => {
        e.preventDefault();
        postUserToServer();
    };

    return (
        <div className="min-h-screen items-center flex justify-center bg-gradient-to-r from-blue-300 to-purple-400">
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
                <Form noValidate onSubmit={handleForm} className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
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
                        <Label htmlFor="password">Password:</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            invalid={!!validationError.password}
                            placeholder="Enter password"
                        />
                        <p className="text-red-500">{validationError.password}</p>
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
                        <button type="Submit" className="bg-blue-400 p-2 text-white font-semibold rounded-xl shadow-lg transition-transform hover:bg-blue-500 hover:scale-110">
                            Signup
                        </button>
                    </FormGroup>

                    <p className="mt-4 font-semibold text-sm text-center">
                        <Link className="no-underline text-blue-500 hover:text-blue-300 hover:underline" href="/">Already have an account?</Link>
                    </p>
                </Form>
            </Fragment>
        </div>
    );
}
