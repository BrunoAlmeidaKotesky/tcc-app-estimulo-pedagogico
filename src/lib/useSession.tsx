import { useEffect } from "react";
import ApiClient from "./ApiClient";
import useStore from "@/store";
import { ChildUser, LoggedParent } from "./types";
import { None, NoneType, Option, Some } from "trentim-react-sdk";
import {match} from 'ts-pattern';

export default function useSession(): Option<LoggedParent | ChildUser> {
  const {
    userType,
    parentUser,
    childUser,
    setParentUser,
    setChildUser,
    reset: storeReset,
  } = useStore();

  async function fetchParentUser() {
    const res = await ApiClient.getAuthUser<LoggedParent>('parent');
    if (res.isErr()) return storeReset();
    setParentUser(res.unwrap().data);
  }

  async function fetchChildUser() {
    const res = await ApiClient.getAuthUser<ChildUser>('child');
    if (res.isErr()) return storeReset();
    setChildUser(res.unwrap().data);
  }

  useEffect(() => {
    if (userType === 'parent' && !parentUser) fetchParentUser();
    else if (userType === 'child' && !childUser) fetchChildUser();
  }, [userType, parentUser, childUser]);

  return match(userType)
    .with('parent', () => (!parentUser ? None : Some(parentUser)))
    .with('child', () => (!childUser ? None : Some(childUser)))
    .otherwise(() => None);
}
