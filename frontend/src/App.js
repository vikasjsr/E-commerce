import './App.css';
import Header from './component/layout/Header/Header.js'
import {BrowserRouter as Router,Route, Routes} from "react-router-dom"
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js'


function App() {
  return (
      <Router>
        <Header />
          <Routes>
            <Route exact path = '/' element={<Home />} />
          </Routes>
        <Footer/>
      </Router> 
  );
}

export default App;
