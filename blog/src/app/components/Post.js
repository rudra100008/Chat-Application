"use client"
import { Card } from "reactstrap";

export default function Post({ post }) {
    return (
        <div className="max-w-sm mx-auto mb-6">
            <header className="mt-4 text-gray-500">{post?.postDate || "No date available"}</header>
            <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* <img src={post?.image || "default-image.jpg"} alt="post image" className="w-full h-48 object-cover" /> */}
                <h1>{post?.image || "default-image.jpg"}</h1>
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800">{post?.postTitle || "Untitled Post"}</h2>
                    <p className="text-gray-600 mt-2">{post?.content || "No content available"}</p>
                </div>
            </Card>
        </div>
    );
}
