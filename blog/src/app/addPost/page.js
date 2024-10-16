"use client";
import axios from "axios";
import { Fragment, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import { toast } from "react-toastify";

export default function AddPost() {
    const [postData, setPostData] = useState({
        postTitle: "",
        content: "",
        image: null,
        categoryId: ""
    });

    const [validationError, setValidationError] = useState({
        postTitle: "",
        content: "",
        image: null,
        categoryId: ""
    });

    // Handle text inputs
    const handleChange = (e) => {
        setPostData({ ...postData, [e.target.name]: e.target.value });
    };

    // Handle file input (image)
    const handleFileChange = (e) => {
        setPostData({ ...postData, image: e.target.files[0] });
    };

    const postDataToServer = () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        const formData = new FormData();
        formData.append("postDTO", new Blob([JSON.stringify({
            postTitle: postData.postTitle,
            content: postData.content,
        })], { type: "application/json" }));
        formData.append("image", postData.image); 
        const categoryId=postData.categoryId ? parseInt(postData.categoryId):'' ;
        axios.post(`${base_url}/posts?userId=${userId}&categoryId=${postData.categoryId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        .then((response) => {
            toast.success("Post created successfully!");
            console.log(response.data)
            setPostData({
                postTitle: "",
                content: "",
                image: null,
                categoryId: ""
            });
            setValidationError({
                postTitle:"",
                content:"",
                image:null,
                categoryId:""
            })
        })
        .catch((error) => {
            console.error(error.response.data);
            if(error.response.status===400){
                const {message}=error.response.data;
                setValidationError(message);
            }else{
                toast.error("Unexcepted error occured")
            }
           
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postDataToServer();
    };

    return (
        <div className="flex justify-center items-center">
            <Fragment>
                <Form noValidate onSubmit={handleSubmit} className="max-w-xl p-8 w-full rounded-lg shadow-lg mt-5">
                    <h1 className="text-center">Post</h1>
                    <FormGroup>
                        <Label htmlFor="postTitle">Title</Label>
                        <Input 
                            type="text"
                            name="postTitle"
                            id="postTitle"
                            value={postData.postTitle}
                            onChange={handleChange}
                            placeholder="Enter your post Title"
                            required
                        />
                        <p className="text-red-500">{validationError.postTitle}</p>
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="content">Content</Label>
                        <Input
                            type="textarea"
                            name="content"
                            id="content"
                            value={postData.content}
                            onChange={handleChange}
                            placeholder="Enter your content"
                            required
                        />
                        <p className="text-red-500">{validationError.content}</p>

                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="image">Image</Label>
                        <Input 
                            type="file"
                            name="image"
                            id="image"
                            onChange={handleFileChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label htmlFor="category">Category</Label>
                        <Input
                            type="select"
                            id="category"
                            name="categoryId"
                            value={postData.categoryId}
                            onChange={handleChange}
                            required
                        >
                            <option  value="" disabled>Choose a category</option>
                            <option value="1">Music</option>
                            <option value="2">Movie</option>
                            <option value="3">Food</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className="mt-3">
                        <button
                            type="submit"
                            className="bg-blue-400 p-2 text-white font-semibold rounded-xl shadow-lg transition-transform hover:bg-blue-500 hover:scale-110"
                        >
                            Post
                        </button>
                    </FormGroup>
                </Form>
            </Fragment>
        </div>
    );
}