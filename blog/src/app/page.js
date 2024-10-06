// pages/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import Navbar from './components/Navbar'; // Ensure the path is correct
import 'react-toastify/dist/ReactToastify.css';
import AllPost from './components/AllPost';

export default function Home() {
  return (
    <div>
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
      <Navbar />
      <AllPost/>
     
    </div>
  );
}
