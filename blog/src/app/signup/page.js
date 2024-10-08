"use client";
import axios from "axios";
import { Fragment, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import Navbar from "../components/Navbar";
import Link from "next/link";


export default function Signup() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: ""
    })
    const [validationError, setValidationError] = useState({
        username: "",
        email: "",
        password: ""
    })
    const postUserToServer = () => {
        axios.post(`${base_url}/register`, user).then(
            (response) => {
                console.log(response.data);
                setUser({ username: "", email: "", password: "" })
                toast.success(response.data.message);
                setValidationError({});
            }).catch((error) => {
                console.log(error.response.data)
                if (error.response.status === 400) {
                    const { message } = error.response.data;
                    if (typeof message === 'string') {
                        toast.error(message);
                    } else if (typeof message === 'object') {
                        setValidationError(message);
                    }
                    setValidationError(message);
                } else {
                    toast.error("Unexcepted error occured.")
                }
            });

    }
    const handleForm = (e) => {
        e.preventDefault();
        postUserToServer();
        setTimeout(()=>{
             window.location.href="/login"
        },2000)
    }

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
                <Form noValidate onSubmit={handleForm}   className="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
                    <h3 className="text-center mb-4">Create your account</h3>
                    <FormGroup className="">
                        <Label htmlFor="username" className="" >Username:</Label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            placeholder="Enter username" />
                        <p className="text-red-500">{validationError.username}</p>
                    </FormGroup>
                    <FormGroup className="">
                        <Label htmlFor="email" className="" >Email:</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                            placeholder="Enter email" />
                        <p className="text-red-500">{validationError.email}</p>
                    </FormGroup>
                    <FormGroup className="">
                        <Label htmlFor="password" className="" >Password:</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder="Enter password" />
                        <p className="text-red-500">{validationError.password}</p>
                    </FormGroup>
                    <FormGroup>
                        <button type="Submit" className="bg-blue-400 p-2 text-white font-semibold  rounded-xl shadow-lg transition-transform hover:bg-blue-500 hover:scale-110" >Signup</button>
                    </FormGroup>
                    <p className="mt-4 font-semibold text-sm text-center ">
                       <Link className="no-underline text-blue-500 hover:text-blue-300 hover:underline" href="/">Already have a account?</Link>
                    </p>
                </Form>

            </Fragment>
        </div>
    )
}