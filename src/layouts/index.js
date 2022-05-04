import * as React from "react";
import { useEffect, useRef } from "react";
import { Link } from "gatsby";
import * as styles from "./styles.module.scss";
import {
  GlobalDispatchContext,
  GlobalStateContext,
  GlobalItemsCountContext,
} from "../context/GlobalContextProvider";
import { toggle_modal } from "../context/actions";
import OrderModal from "../pages/components/orderModal";
import BasketSvg from "../../static/icons/basket.svg";
import HomeSvg from "../../static/icons/home.svg";
import { YMInitializer } from "react-yandex-metrika";

const Layout = ({ children, location }) => {
  const dispatch = React.useContext(GlobalDispatchContext);
  const state = React.useContext(GlobalStateContext);
  const itemsTotal = React.useContext(GlobalItemsCountContext);
  const homeLinkRef = useRef();
  const basketRef = useRef();

  useEffect(() => {
    toggleActiveHome();
  }, [location]);

  useEffect(() => {
    toggleActiveBasket();
  }, [itemsTotal]);

  const toggleActiveHome = () => {
    if (location.pathname === "/") {
      homeLinkRef.current.classList.add(styles.active);
    } else {
      homeLinkRef.current.classList.remove(styles.active);
    }
  };

  const toggleActiveBasket = () => {
    if (state.items.length > 0) {
      basketRef.current.classList.add(styles.active);
    } else {
      basketRef.current.classList.remove(styles.active);
    }
  };

  return (
    <div className={styles.container}>
      <header>
        <YMInitializer accounts={[88691771]} options={{ webvisor: true }} />
        <nav>
          <ul className={styles.list}>
            <li ref={homeLinkRef}>
              <Link to="/">
                <img src={HomeSvg} alt="Home" />
              </Link>
            </li>
            <li
              ref={basketRef}
              className={styles.basket}
              onClick={() => dispatch(toggle_modal)}
            >
              <img src={BasketSvg} alt="Basket" />
              {state.items.length > 0 && <small>{state.items.length}</small>}
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      {state.showModal && <OrderModal />}

      <footer className={styles.footer}>
        © {new Date().getFullYear()}
        <span
          dangerouslySetInnerHTML={{
            __html: `<a href="https://metrika.yandex.ru/stat/?id=88691771&amp;from=informer"
target="_blank" rel="nofollow"><img src="https://informer.yandex.ru/informer/88691771/3_1_FFFFFFFF_EFEFEFFF_0_pageviews"
style="width:88px; height:31px; border:0;" alt="Яндекс.Метрика" title="Яндекс.Метрика: данные за сегодня (просмотры, визиты и уникальные посетители)" class="ym-advanced-informer" data-cid="88691771" data-lang="ru" /></a>`,
          }}
        />
      </footer>
    </div>
  );
};

export default Layout;
