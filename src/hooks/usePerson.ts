import {
  useState,
  useEffect,
  useCallback,
  useDebugValue,
  SetStateAction,
  useReducer,
} from "react"
import localforage from "localforage"

import type { Person } from "../types/person"
// import { sleep } from "../utils";
import { useIsMounted } from "./useIsMounted"
// import { useDebounce } from "./useDebounce";
import { useThrottle } from "./useThrottle"
import { useWillUnmount } from "./useWillUnmount"
import {
  personEditorReducer,
  MetaData,
} from "../person-editor/personEditorReducer"

export const usePerson = (initialPerson: Person) => {
  // const [person, setPerson] = useState<Person | null>(null);
  const isMounted = useIsMounted()

  const [{ person, metaData }, dispatch] = useReducer(personEditorReducer, {
    person: null,
    metaData: { isDirty: false, isValid: true },
  })

  const savePerson = (person: Person | null): void => {
    console.log("Saving", person)
    // noinspection JSIgnoredPromiseFromCall
    localforage.setItem("person", person)
  }

  useDebugValue(person, (p) => `${p?.firstname} ${p?.surname}`)

  useEffect(() => {
    const getPerson = async () => {
      const person = await localforage.getItem<Person>("person")
      // await sleep(3500);
      if (isMounted.current) {
        //setPerson(person ?? initialPerson);
        dispatch({
          type: "set-initial-person",
          payload: person ?? initialPerson,
        })
      }
    }
    // noinspection JSIgnoredPromiseFromCall
    getPerson()
  }, [initialPerson, isMounted])

  const saveFn = useCallback(() => {
    savePerson(person)
  }, [person])

  useThrottle(saveFn, 1000)

  useWillUnmount(saveFn)

  const setPersonAndMeta = (value: SetStateAction<Person | null>) => {
    // setPerson(value);
    // setMetaData((m) => ({...m, isDirty: true}));
    // todo set validate
  }

  const setProperty = (name: keyof Person, value: unknown) => {
    dispatch({ type: "set-property", payload: { name, value } })
  }

  return [person, setProperty, metaData] as const
}
