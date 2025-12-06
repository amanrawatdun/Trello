import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Board from './pages/Board';


const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/login' element={<Login/>} />
            <Route path='/register'  element={<Register/>}/>
            <Route path='/board/:id'  element={<Board/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default App;