import * as React from "react";
import {
  GlobalDispatchContext,
  GlobalItemsCounterContext,
} from "../../context/GlobalContextProvider";
import * as styles from "./styles.module.scss";
import Markdown from "markdown-to-jsx";
import { add_item } from "../../context/actions";

const ItemPage = ({
  pageContext: {
    data: { item },
  },
}) => {
  const dispatch = React.useContext(GlobalDispatchContext);
  const setItemsTotal = React.useContext(GlobalItemsCounterContext);

  return (
    <div className={styles.item}>
      <div>
        <img src={item.img} alt={item.title}></img>
        <div>
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
        </div>
      </div>
      <Markdown>{item.text}</Markdown>
    </div>
  );
};

export default ItemPage;
