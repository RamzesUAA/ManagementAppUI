import React, {
  useState,
  createContext,
  useMemo,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

interface AppValues {
  customFormTypes: FormType[];
  setCustomFormTypes: Dispatch<SetStateAction<FormType[]>>;
}

const GetAppContextState = (): AppValues => {
  const [customFormTypes, setCustomFormTypes] = useState<FormType[]>([]);

  return useMemo((): AppValues => {
    return { customFormTypes, setCustomFormTypes };
  }, [customFormTypes, setCustomFormTypes]);
};

const AppStateContext = createContext<AppValues>({
  customFormTypes: [],
  setCustomFormTypes: () => {},
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
