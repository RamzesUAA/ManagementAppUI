import React, {
  useContext,
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";

type UserInfo = {
  permissions: [];
  email: string;
  id: string;
  accessToken: string;
};

export type AccountContextType = {
  loading: boolean;
  userInfo?: UserInfo;
};

export const useAccountContext = () => useContext(AccountContext);

const AccountContext = React.createContext<AccountContextType>({
  loading: false,
  userInfo: undefined,
});

const AccountProvider = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getAccount();
  }, []);

  const getAccount = () => {};
};
