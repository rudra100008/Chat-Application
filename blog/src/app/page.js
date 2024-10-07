// pages/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AllPost from './components/AllPost';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      <Navbar/>
     <AllPost/>
    </div>
  );
}
