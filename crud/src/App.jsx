import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <BrowserRouter>
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
      />
    </BrowserRouter>
  );
}

export default App;
