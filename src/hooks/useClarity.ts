import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

const CLARITY_PROJECT_ID = "umdgbp66rq";

export function useClarity() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Clarity.init(CLARITY_PROJECT_ID);
    }
  }, []);
}
