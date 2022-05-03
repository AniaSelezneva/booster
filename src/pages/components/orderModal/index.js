import * as React from "react"
import {
  GlobalDispatchContext,
  GlobalStateContext,
} from "../../../context/GlobalContextProvider"
import * as styles from "./styles.module.scss"
import { toggle_modal, add_name, add_phone, remove_item, plus_one_item, minus_one_item } from "../../../context/actions"
import Item from "./item"

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }

  return this.substring(0, index) + replacement + this.substring(index + 1);
}

const log = console.log

// markup
const OrderModal = () => {
  const dispatch = React.useContext(GlobalDispatchContext)
  const state = React.useContext(GlobalStateContext)
  const phoneInputRef = React.useRef()
  const [caretPosition, setCaretPosition] = React.useState()

  // const [prevPhone, setPrevPhone] = React.useState(`+7(___)___-__-__`)
  const [phone, setPhone] = React.useState(`+7(___)___-__-__`) // 3,4,5; 7,8,9; 11,12; 14,15


  const applyPattern = (editedPhone) => {
    
     if(caretPosition !== 0 && caretPosition !== 1 && caretPosition !== 2 && 
         caretPosition !== 6 && caretPosition !== 10 && caretPosition !== 13){
       
             if(phone.charAt(caretPosition) !== editedPhone.charAt(caretPosition)) {
               
               if  (!isNaN(editedPhone.charAt(caretPosition))){
                 
                 setPhone(prev => (prev.replaceAt(caretPosition, editedPhone.charAt(caretPosition))))
                 
                 setCaretPosition(prev => {let newPos = prev + 1;
                                          if(newPos === 6 || newPos === 10 || newPos === 13)
                                           newPos+=1
                                          
                                           else if(newPos === 16)
                                             newPos = 3
                                           
                                           return newPos
                                          })
         }
       }
    }
  }

    
    
   


   
     
       

   

   
        
            
     
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

  //React.useEffect(() => {
 //   applyPattern(phone, prevPhone)
 // }, [phone])

  React.useEffect(() => {
    phoneInputRef.current.selectionStart = caretPosition; 
    phoneInputRef.current.selectionEnd = caretPosition;
  }, [phone])


  return (<>
    {/* Overlay for dimming */}
    {state.showModal && <div className={styles.overlay} onClick={() => dispatch(toggle_modal)} />}

    {/* Form */}
    <form className={styles.form}>
      <p> {caretPosition ? caretPosition : 'x'}</p>
      <div className={styles.name}>
        <label htmlFor="name">Имя: </label>
        <input type="text" name="name" id="name" required onChange={e => { dispatch(add_name(e.target.value)) }} />
      </div>
      <div className={styles.email}>
        <label htmlFor="phone">Телефон: </label>
        <input ref={phoneInputRef} placeholder="+7(___)___-__-__" minLength="11" maxLength="200" type="tel" name="phone" id="phone" required
          value={phone}
          onChange={e => { setCaretPosition(e.target.selectionStart); applyPattern(e.target.value) }} 
          />
      </div>

      {/* Items */}
      <ul className={styles.items}>
        {state.items && state.items.map((item, idx) => (

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
