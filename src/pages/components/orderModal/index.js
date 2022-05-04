import * as React from "react";
import { useContext, useRef, useState, useEffect } from "react";
import {
  GlobalDispatchContext,
  GlobalStateContext,
  GlobalItemsCounterContext,
} from "../../../context/GlobalContextProvider";
import * as styles from "./styles.module.scss";
import { toggle_modal, clear_items } from "../../../context/actions";
import Item from "./item";

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
};

const OrderModal = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const state = useContext(GlobalStateContext);
  const setItemsTotal = React.useContext(GlobalItemsCounterContext);

  const phoneInputRef = useRef();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(`+7(___)___-__-__`);
  const [caretPosition, setCaretPosition] = useState();

  const [errors, setErrors] = useState({
    name: undefined,
    phone: undefined,
    email: undefined,
  });

  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);

  const applyPattern = (editedPhone, caretPosition) => {
    // exclude +, 7, (, ), -
    if (
      caretPosition !== 0 &&
      caretPosition !== 1 &&
      caretPosition !== 2 &&
      caretPosition !== 6 &&
      caretPosition !== 10 &&
      caretPosition !== 13
    ) {
      // If a char changed
      if (phone.charAt(caretPosition) !== editedPhone.charAt(caretPosition)) {
        if (!isNaN(editedPhone.charAt(caretPosition))) {
          // if it's a number
          // phone = new phone with this new char
          setPhone((prev) =>
            prev.replaceAt(caretPosition, editedPhone.charAt(caretPosition))
          );

          // Change caret position (or it will go to the end)
          setCaretPosition((prev) => {
            if (prev === 6 || prev === 10 || prev === 13) {
              // skip ), -
              prev += 1;
            } else if (prev === 16) {
              // if it's the last one
              prev = 3;
            }
            return prev;
          });
        }
      }
    }
  };

  const areFieldsValid = () => {
    const isPhoneCorrect = () => {
      for (let i = 0; i < phone.length; i++) {
        // If there is a number missing
        if (phone.charAt(i) === "_") {
          return false;
        }
      }

      return true;
    };

    const isEmailCorrect = () => {
      const regex =
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (regex.test(email)) {
        return true;
      } else {
        return false;
      }
    };

    if (name.trim() === "") {
      setErrors((prev) => ({ ...prev, name: "поле не должно быть пустым" }));
      return false;
    } else if (!isPhoneCorrect()) {
      setErrors((prev) => ({ ...prev, phone: "некорректный номер телефона" }));
      return false;
    } else if (email.trim() === "") {
      setErrors((prev) => ({ ...prev, email: "поле не должно быть пустым" }));
      return false;
    } else if (!isEmailCorrect()) {
      setErrors((prev) => ({
        ...prev,
        email: "некорректный адрес электронной почты",
      }));
      return false;
    }
    return true;
  };

  const resetErrors = () => {
    setErrors({ name: undefined, phone: undefined, email: undefined });
  };

  const sendOrder = async (e) => {
    e.preventDefault()
    
    if (areFieldsValid()) {
      const body = {
        name: name.trim(),
        phone,
        items: JSON.stringify(
          state.items.map((item) => {
            return {
              id: item.item.id,
              name: item.item.title,
              quantity: item.quantity,
            };
          })
        ),
        targetEmail: email.trim(),
      };

      let formBody = [];
      for (const property in body) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");

      const response = await fetch(`${process.env.GATSBY_API_URL}api/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formBody,
      });

      if (response.status === 200) {
        setIsSent(true);
        dispatch(clear_items);
        setItemsTotal(0);
      } else if (response.status === 500) {
        setIsError(true);
      }
    }
  };

  useEffect(() => {
    if (caretPosition) {
      phoneInputRef.current.selectionStart = caretPosition;
      phoneInputRef.current.selectionEnd = caretPosition;
    }
  }, [caretPosition]);

  return (
    <>
      {/* Overlay for dimming */}
      {state.showModal && (
        <div
          className={styles.overlay}
          onClick={() => dispatch(toggle_modal)}
        />
      )}

      {isError ? (
        <p className={styles.info_error}>
          Произошла ошибка, повторите попытку позже
        </p>
      ) : isSent ? (
        <p className={styles.info}>Заказ успешно добавлен</p>
      ) : (
        /* Form */
        <form className={styles.form} onSubmit={sendOrder} >
          <div className={styles.name}>
            <label htmlFor="name">Имя: </label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={(e) => {
                resetErrors();
                setName(e.target.value);
              }}
            />
            <small className={styles.error}>{errors.name}</small>
          </div>
          <div className={styles.phone}>
            <label htmlFor="phone">Телефон: </label>
            <input
              ref={phoneInputRef}
              type="tel"
              name="phone"
              id="phone"
              value={phone}
              onChange={(e) => {
                resetErrors();
                setCaretPosition(e.target.selectionStart);
                applyPattern(e.target.value, e.target.selectionStart - 1);
              }}
            />
            <small className={styles.error}>{errors.phone}</small>
          </div>

          {/* Items */}
          <ul className={styles.items}>
            {state.items &&
              state.items.map((item, idx) => (
                // Item
                <Item item={item} key={idx} />
              ))}
          </ul>

          {/* Close */}
          <span className={styles.close} onClick={() => dispatch(toggle_modal)}>
            &#10005;
          </span>

          <div className={styles.target_email}>
            <label htmlFor="email">
              Электронная почта для отправки результата:{" "}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              onChange={(e) => {
                resetErrors();
                setEmail(e.target.value);
              }}
            />
            <small className={styles.error}>{errors.email}</small>
          </div>

          {/* Submit */}
          {state.items.length > 0 ? (
            <input type="submit" className={styles.submit} onClick="ym(88691771,'reachGoal','target'); return true;" value="Отправить"/>
          ) : (
            <p className={styles.add_items_info}>
              Пожалуйста, добавьте товары для заказа
            </p>
          )}
        </form>
      )}
    </>
  );
};

export default OrderModal;
