"use client";
import axios from "axios";
import { Fragment, useState } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import base_url from "../api/base_url";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function AddPost() {
    const router =useRouter()
    const [postData, setPostData] = useState({
        postTitle: "",
        content: "",
        image: null,
        categoryId: ""
    });

    const [validationError, setValidationError] = useState({
        postTitle: "",
        content: "",
        image: "",
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
            content: postData.content
        })], { type: "application/json" }));
        formData.append("image", postData.image); 
        formData.append("userId", userId); // Add userId
        formData.append("categoryId", postData.categoryId); 
        
        axios.post(`${base_url}/posts`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            }
        })
        .then((response) => {
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
                image:"",
                categoryId:""
            })
            toast.success("Post created successfully!");
            
        })
        .catch((error) => {
            console.error(error.response.data);
            if(error.response.status===400){
                const {message}=error.response.data;
                if(typeof message === 'object'){
                    setValidationError({
                        postTitle:message.postTitle,
                        content:message.content,
                        image:message.image
                    })
                }
            }else{
                toast.error("Unexcepted error occured")
            }
           
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!postData.categoryId) {
            setValidationError({ ...validationError, categoryId: "Please select a category" });
            return;  
        }
        postDataToServer();
    };
    const handleCancel=()=>{
        router.back()
    }

    return (
        <div className="flex justify-center items-center">
            <Fragment>
                <Form noValidate onSubmit={handleSubmit} className="max-w-xl p-8 w-full rounded-lg shadow-lg mt-5">
                    <h1 className="text-center mb-3 text-3xl font-bold">What do you want to post ?</h1>
                    <FormGroup>
                        <Label htmlFor="postTitle" className="text-sm text-gray-500">Title</Label>
                        <Input 
                            type="text"
                            name="postTitle"
                            id="postTitle"
                            value={postData.postTitle}
                            onChange={handleChange}
                            placeholder="Enter your post Title"
                            invalid={validationError.postTitle}
                            required
                        />
                        <p className="text-red-300  text-sm">{validationError.postTitle}</p>
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
                            className="h-48"
                            required
                            invalid={validationError.content}
                            valid={validationError.content}
                        />
                        <p className="text-red-300 text-sm ">{validationError.content}</p>

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
                        <Label htmlFor="category">Category</Label>
                        <Input
                            type="select"
                            id="category"
                            name="categoryId"
                            value={postData.categoryId}
                            onChange={handleChange}
                            invalid={validationError.categoryId}
                            required
                            
                        >
                            <option value="" disabled>Choose a category</option>
                            <option value="1">Music</option>
                            <option value="2">Movie</option>
                            <option value="3">Food</option>
                            <option value="4">Others</option>
                        </Input>
                        <p className="text-red-300  text-sm ">{validationError.categoryId}</p>
                    </FormGroup>
                    <FormGroup className="mt-3 flex flex-row justify-between">
                        <button
                            type="submit"
                            className="bg-blue-400 px-3 py-2 text-white font-semibold rounded-xl shadow-lg transition-transform hover:bg-blue-500 hover:scale-110"
                        >
                            Post
                        </button>
                        <button 
                        type="button"
                        onClick={handleCancel}
                        className="bg-red-400 px-3 py-2 text-white font-semibold rounded-xl shadow-lg transition-transform hover:bg-red-500 hover:scale-110">
                            Cancel
                        </button>
                    </FormGroup>
                </Form>
            </Fragment>
        </div>
    );
}
