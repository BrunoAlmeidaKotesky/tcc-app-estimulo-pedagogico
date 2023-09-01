import { useEffect } from "react";
import ApiClient from "./ApiClient";
import useStore, { useAppStore } from "@/store";
import { ChildUser, LoggedParent } from "./types";
import { None, Some } from "trentim-react-sdk/helpers";
import { Option } from "trentim-react-sdk/models";
import {match} from 'ts-pattern';

export default function useSession(): Option<LoggedParent | ChildUser> {
  const store = useStore(useAppStore, s => s);

  async function fetchParentUser() {
    const res = await ApiClient.getAuthUser<LoggedParent>('parent');
    if (res.isErr()) return store?.reset(false);
    store?.setParentUser(res.unwrap().data);
  }

  async function fetchChildUser() {
    const res = await ApiClient.getAuthUser<ChildUser>('child');
    if (res.isErr()) return store?.reset(false);
    store?.setChildUser(res.unwrap().data);
  }

  useEffect(() => {
    if (store?.userType === 'parent' && !store?.parentUser) fetchParentUser();
    else if (store?.userType === 'child' && !store?.childUser) fetchChildUser();
  }, [store?.userType, store?.parentUser, store?.childUser]);

  return match(store?.userType)
    .with('parent', () => (!store?.parentUser ? None : Some(store?.parentUser)))
    .with('child', () => (!store?.childUser ? None : Some(store?.childUser)))
    .otherwise(() => None);
}
