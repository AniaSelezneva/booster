import * as React from "react"
import {
    GlobalDispatchContext,
    GlobalStateContext,
} from "../../../context/GlobalContextProvider"
import * as styles from "./styles.module.scss"
import { toggle_modal, remove_item, plus_one_item, minus_one_item } from "../../../context/actions"


const Item = ({ item }) => {
    const dispatch = React.useContext(GlobalDispatchContext)
    const state = React.useContext(GlobalStateContext)
    const [quantity, setQuantity] = React.useState(item?.quantity || 0)


    return <li>
         { item ? <>
        <img src={item.item.img} alt={item.item.title} />
        <div className={styles.quantity}>
            {/* Arrow left */}
            <span style={{ visibility: quantity > 1 ? 'visible' : 'hidden' }}
                onClick={() => { if (quantity > 1) { dispatch(minus_one_item(item.item.id)); setQuantity(prev => (prev -= 1)) } }}>&#x3c;</span>
            <span> {quantity} </span>
            {/* Arrow right */}
            <span onClick={() => { dispatch(plus_one_item(item.item.id)); setQuantity(prev => (prev += 1)) }}>&#x3e;</span>
        </div>
        <p>{item.item.title}</p>
        <span className={styles.remove_item} onClick={() => dispatch(remove_item(item.item.id))}>&#10005;</span></> : </>}
    </li>
}



export default Item
