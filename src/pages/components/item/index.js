import * as React from "react"
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../../context/GlobalContextProvider"
import * as styles from "./styles.module.scss"
import { Link } from "gatsby"
import { add_item } from "../../../context/actions"


// markup
const Item = ({ data: { item } }) => {
  const dispatch = React.useContext(GlobalDispatchContext)
  const state = React.useContext(GlobalStateContext)


  return (<li className={styles.item}>
    <img src={item.img} alt={item.title}></img>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    <button onClick={() => { dispatch(add_item(item)) }}>add</button>
    <Link to={`/items/${item.slug}`}>More info</Link>
  </li>)
}



export default Item
