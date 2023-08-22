import { useEffect } from "react";
import ApiClient from "./ApiClient";
import useStore from "@/store";
import { ChildUser, LoggedParent } from "./types";
import { None, NoneType, Option, Some } from "trentim-react-sdk";
import {match} from 'ts-pattern';

export default function useSession<R extends 'parent' | 'child'>(role: R):  
  R extends 'parent' ? Option<LoggedParent> : R extends 'child' ? Option<ChildUser> : NoneType {
  const {parentUser, setParentUser, storeReset, childUser, setChildUser} = useStore(s => ({
    setParentUser: s.setParentUser,
    storeReset: s.reset,
    setChildUser: s.setChildUser,
    parentUser: s.parentUser,
    childUser: s.childUser
  }));

  async function fetchParentUser() {
    const res = await ApiClient.getAuthUser<LoggedParent>('parent');
    if(res.isErr())
      return storeReset();
    setParentUser(res.unwrap().data);
  }

  async function fetchChildUser() {
    const res = await ApiClient.getAuthUser<ChildUser>('child');
    if(res.isErr())
      return storeReset();
    setChildUser(res.unwrap().data);
  }

  useEffect(() => {
    if (!parentUser && role === 'parent')
      fetchParentUser();
    else if(!childUser && role === 'child')
      fetchChildUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //@ts-ignore
  return match(role as 'child' | 'parent')
    .with('parent', () =>  !parentUser ? None : Some(parentUser))
    .with('child', () => !childUser ? None : Some(childUser)).exhaustive();
}
