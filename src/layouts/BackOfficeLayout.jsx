import { Outlet } from 'react-router-dom'
import Header from '../components/layout/Header'
import SideMenu from '../components/layout/SideMenu'
import './BackOfficeLayout.css'

export default function BackOfficeLayout() {
  return (
    <>
      <Header />
      <div className="conteneur back-office">
        <SideMenu />
        <Outlet />
      </div>
    </>
  )
}
