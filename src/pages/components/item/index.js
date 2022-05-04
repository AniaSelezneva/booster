import * as React from "react";
import {
  GlobalDispatchContext,
  GlobalItemsCounterContext,
} from "../../../context/GlobalContextProvider";
import * as styles from "./styles.module.scss";
import { Link } from "gatsby";
import { add_item } from "../../../context/actions";

const Item = ({ data }) => {
  const dispatch = React.useContext(GlobalDispatchContext);
  const setItemsTotal = React.useContext(GlobalItemsCounterContext);

  let item = undefined;
  if (data) item = data.item;

  return (
    <li className={styles.item}>
      {item ? (
        <>
          <img src={item.img} alt={item.title}></img>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <button
            onClick={() => {
              dispatch(add_item(item));
              setItemsTotal((prev) => prev + 1);
            }}
          >
            В корзину
          </button>
          <Link to={`/items/${item.slug}`}>Подробнее</Link>{" "}
        </>
      ) : (
        <span />
      )}
    </li>
  );
};

export default Item;
