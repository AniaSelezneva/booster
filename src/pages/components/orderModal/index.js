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
    
    
  

    let changedIdx;
    const numArr = phone.split('')
    const editedNumArr = editedPhone.split('')


    for (let i = 0; i < numArr.length; i++) {
      for (let j = 0; j < editedNumArr.length && !changedIdx; j++) {
        if (i!==0 && i!==1 && i!== 2 && i !== 6 && i!== 10 && i !== 13 && 
            i === j && numArr[i] !== editedNumArr[j]) {
          if (!isNaN(editedNumArr[i])) {
            changedIdx = i
            break
          }

        }

      }
    }

    

   
        
            
     function setCaretPosition(ctrl, start, end) {
    // IE >= 9 and other browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(start, end);
    }
    // IE < 9 
    else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        range.select();
    }
}   

    if (changedIdx) {
      setPhone(prev=> (prev.replaceAt(changedIdx, editedNumArr[changedIdx])))
//phoneInputRef.current.focus()
      //log(phoneInputRef.selectionStart)
       //phoneInputRef.current.setSelectionRange(changedIdx,  changedIdx+1);
      //setCaretPosition(phoneInputRef.current, 3, 3)
       
     // setTimeout(()=> {phoneInputRef.current.selectionStart = 3; 
      // phoneInputRef.current.selectionEnd = 3; }
      // ,2000 ) 
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
    let editedPos
    if(phone.charAt(caretPosition) === ')') editedPos= caretPosition+1 
    if(phone.charAt(caretPosition) === '-') editedPos = caretPosition +1
    else editedPos = caretPosition 
    if(caretPosition){
    phoneInputRef.current.selectionStart = editedPos; 
    phoneInputRef.current.selectionEnd = editedPos;}
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
