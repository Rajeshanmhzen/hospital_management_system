import { Outlet } from "react-router-dom"

function App() {

  return (
    <>
      <div className='min-h-screen theme-bg'>
        <Outlet />
      </div>
    </>
  )
}

export default App
