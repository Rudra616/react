import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
}

export default App;
