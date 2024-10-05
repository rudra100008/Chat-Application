"use client"
import { Fragment, useState } from "react";
import Navbar from "../components/Navbar";
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Login() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const newUser = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }
    const postFromServer = () => {
        axios.post(`${base_url}/login`, user).then((response) => {
            setUser({ username: "", password: "" })
            const { token } = response.data
            console.log(token)
        }).catch((err) => {
            console.log(err.response.data)
            const { message } = err.response.data
            if (err.response.status === 500) {
                toast.error(message);
            }
        });
    }
    const handleForm = (e) => {
        e.preventDefault();
        postFromServer();
    }

    return (
        <div>
            <Navbar />
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
                <Form noValidate onSubmit={handleForm} className="max-w-xl px-2 py-4 mx-auto my-20 rounded-lg shadow-lg ">
                    <h3 className="text-center mb-4">Login here</h3>
                    <FormGroup>
                        <Label>Username:</Label>
                        <Input
                            type="text"
                            placeholder="Enter your username"
                            name="username"
                            value={user.username}
                            onChange={newUser} />
                    </FormGroup>
                    <FormGroup>
                        <Label>Password:</Label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={user.password}
                            onChange={newUser} />
                    </FormGroup>
                    <FormGroup>
                        <button type="Submit" className="bg-blue-400 p-2 text-white font-semibold  rounded-xl shadow-lg transition-transform hover:bg-blue-500 hover:scale-110">
                            Submit
                        </button>
                    </FormGroup>
                </Form>
            </Fragment>
        </div>
    )
}