import React, {
  useState,
  createContext,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import useApi from "../agent";

interface AppValues {
  customFormTypes: FormType[];
  setCustomFormTypes: Dispatch<SetStateAction<FormType[]>>;
  currentUser: any;
  setCurrentUser: Dispatch<SetStateAction<any>>;
}

const GetAppContextState = (): AppValues => {
  const [customFormTypes, setCustomFormTypes] = useState<FormType[]>([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { get } = useApi();
  useEffect(() => {
    get("/accounts/current").then((r) => {
      setCurrentUser(r?.data);
    });
  }, []);

  return useMemo((): AppValues => {
    return { customFormTypes, setCustomFormTypes, currentUser, setCurrentUser };
  }, [customFormTypes, setCustomFormTypes, currentUser, setCurrentUser]);
};

const AppStateContext = createContext<AppValues>({
  customFormTypes: [],
  setCustomFormTypes: () => {},
  currentUser: {},
  setCurrentUser: () => {},
});
const useAppState = () => useContext(AppStateContext);
const AppStateProvider = ({ children }: any) => {
  return (
    <AppStateContext.Provider value={GetAppContextState()}>
      {children}
    </AppStateContext.Provider>
  );
};
export { AppStateProvider, useAppState };
