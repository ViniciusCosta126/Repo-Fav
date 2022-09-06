import {BrowserRouter,Route,Routes} from 'react-router-dom'
import React from 'react'
import Home from './pages/Main/index'
import Repositorios from './pages/Repositorio/index'

const Rotas = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path='/' element={<Home/>}  />
            <Route path='/repositorio/:repositorio' element={<Repositorios/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default Rotas