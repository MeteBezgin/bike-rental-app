import { useRouter } from "next/router";
import { useEffect } from "react";
import { User } from "../types";

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [router, to]);

  return <></>;
};

export default Redirect;
