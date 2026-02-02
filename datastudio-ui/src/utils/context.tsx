import { createContext, FC, ReactNode, useContext } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Locale } from "@i18n/locale.ts";
import {
  Location,
  NavigateFunction,
  useLocation,
  useNavigate,
} from "react-router";

export type LocaleKey = keyof Locale;
interface GlobalContext {
  intl: IntlShape;
  msg: (id: LocaleKey) => string;
  navigate: NavigateFunction;
  location: Location;
}

const Context = createContext<GlobalContext>({} as GlobalContext);

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const location = useLocation();
  // 获取国际化消息
  const msg = (id: LocaleKey): string => {
    return intl.formatMessage({ id: id as string });
  };
  return (
    <Context.Provider value={{ intl, msg, navigate, location }}>
      {children}
    </Context.Provider>
  );
};

export const useGlobal = () => useContext(Context);
