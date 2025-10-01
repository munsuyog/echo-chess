import Layout from './components/layouts'
import { BrowserRouter, Route, Routes } from 'react-router'
import PlayPage from './pages/Play'
import './styles/main.scss'
import FriendsPage from './pages/Friends'
import ExpertPage from './pages/Expert'
import Solution from './pages/Solution'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<PlayPage />} path='/play' />
          <Route element={<FriendsPage />} path='/friends' />
          <Route element={<ExpertPage />} path='/expert' />
          <Route element={<Solution />} path='/solution' />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
