import * as React from "react"
import { Link } from "gatsby"
import * as style from "./styles.module.scss"
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../context/GlobalContextProvider"
import { toggle_modal } from "../context/actions"
import OrderModal from "../pages/components/orderModal"


const Layout = ({ children }) => {
  const dispatch = React.useContext(GlobalDispatchContext)
  const state = React.useContext(GlobalStateContext)

  return (
    <div className={style.container}>
      <header>
        <nav>
          <ul className={style.list}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li onClick={() => dispatch(toggle_modal)}>Basket</li>
          </ul>
        </nav>
      </header>

      <main className={style.main}>
        {children}
      </main>

      {state.showModal && <OrderModal />}

      <footer>
        © {new Date().getFullYear()}
      </footer>

    </div>
  )
}


export default Layout
