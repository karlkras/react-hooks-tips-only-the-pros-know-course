import { Person } from "../types/person"

export interface MetaData {
  isDirty: boolean
  isValid: boolean
}

interface ReducerState {
  person: Person | null
  metaData: MetaData
}

interface SetPersonAction {
  type: "set-initial-person"
  payload: Person
}

interface SetProperty {
  type: "set-property"
  payload: { name: string; value: unknown }
}
type SomeAction = SetPersonAction | SetProperty

export const personEditorReducer = (
  state: ReducerState,
  action: SomeAction
): ReducerState => {
  switch (action.type) {
    case "set-initial-person":
      return { ...state, person: action.payload }
    case "set-property":
      return {
        ...state,
        metaData: { ...state.metaData, isDirty: true },
        person: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...state.person!,
          [action.payload.name]: action.payload.value,
        },
      }
    default:
      return state
  }
}
