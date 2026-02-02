import { createContext, FC, ReactNode, useContext } from "react";
import { IntlShape, useIntl } from "react-intl";
import { Locale } from "@i18n/locale.ts";

export type LocaleKey = keyof Locale;
interface GlobalContext {
  intl: IntlShape;
  msg: (id: LocaleKey) => string;
}

const Context = createContext<GlobalContext>({} as GlobalContext);

export const GlobalProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const intl = useIntl();
  // 获取国际化消息
  const msg = (id: LocaleKey): string => {
    return intl.formatMessage({ id: id as string });
  };
  return <Context.Provider value={{ intl, msg }}>{children}</Context.Provider>;
};

export const useGlobal = () => useContext(Context);
