import * as React from "react"
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../context/GlobalContextProvider"
import * as styles from "./styles.module.scss"
import Markdown from "markdown-to-jsx"


// markup
const ItemPage = ({ pageContext: { data: { item } } }) => {
  const dispatch = React.useContext(GlobalDispatchContext)
  const state = React.useContext(GlobalStateContext)


  return (<div>
    <img src={item.img} alt={item.title}></img>
    <h3>{item.title}</h3>
    <p>{item.description}</p>
    <Markdown>{item.text}</Markdown>
  </div>)
}



export default ItemPage
