import * as React from "react"
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../../context/GlobalContextProvider"
import * as styles from "./styles.module.scss"
import { toggle_modal, add_name, add_phone, remove_item, plus_one_item, minus_one_item } from "../../../context/actions"
import Item from "./item"


// markup
const OrderModal = () => {
  const dispatch = React.useContext(GlobalDispatchContext)
  const state = React.useContext(GlobalStateContext)

  const [patternValue, setPatternValue] = React.useState(undefined)
  const [phone, setPhone] = React.useState('+7(___)___-__-__')

  const [targetEmail, setTargetEmail] = React.useState()

  const sendOrder = async () => {
    const body = {
      name: state.name.trim(),
      phone: state.phone.trim(),
      items: JSON.stringify(state.items.map(item => {
        return { id: item.item.id, name: item.item.title, quantity: item.quantity }
      })),
      targetEmail
    };

    let formBody = [];
    for (const property in body) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(body[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch(process.env.GATSBY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    // const data = await response.json();

    // console.log(data)
  }

  React.useEffect(() => {

  }, [phone])


  return (<>
    {/* Overlay for dimming */}
    {state.showModal && <div className={styles.overlay} onClick={() => dispatch(toggle_modal)} />}

    {/* Form */}
    <form className={styles.form}>
      <div className={styles.name}>
        <label htmlFor="name">Имя: </label>
        <input type="text" name="name" id="name" required onChange={e => { dispatch(add_name(e.target.value)) }} />
      </div>
      <div className={styles.email}>
        <label htmlFor="phone">Телефон: </label>
        <input pattern="+[7-8]{1}[0-9]{2}-[0-9]{3}-[0-9]{4}" minLength="11" maxLength="12" type="tel" name="phone" id="phone" required
          value={phone}
          onChange={e => { setPhone(e.target.value) }} />
      </div>

      {/* Items */}
      <ul className={styles.items}>
        {state.items.map((item, idx) => (

          // Item
          <Item item={item} key={idx} />
        ))}
      </ul>

      {/* Close */}
      <span className={styles.close} onClick={() => dispatch(toggle_modal)}>&#10005;</span>

      <div className={styles.target_email}>
        <label htmlFor="email">Электронная почта для отправки результата: </label>
        <input type="email" name="email" id="email" required onChange={e => { setTargetEmail(e.target.value) }} />
      </div>

      {/* Submit */}
      {state.items.length > 0 ? <button type="button" className={styles.submit} onClick={sendOrder}>Отправить</button> : <p>Please add some items</p>}
    </form>
  </>)
}



export default OrderModal
