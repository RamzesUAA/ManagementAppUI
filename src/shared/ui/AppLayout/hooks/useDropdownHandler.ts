import React, { useEffect, useState } from "react";
import { useOutsideHandler } from "src/shared/hooks/useOutsideHandler";

export const useDropdownHandler = ({ menuRef }: any) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useOutsideHandler({
    ref: menuRef,
    action: () => !isMenuVisible && setIsMenuVisible(false),
  });

  return { isMenuVisible, setIsMenuVisible };
};
