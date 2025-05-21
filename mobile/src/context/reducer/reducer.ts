import { AppState } from "../state/state";

export enum ActionTypes {
  LOGIN = "LOGIN",

  LOGOUT = "LOGOUT",
}

interface Action {
  type: ActionTypes;
  payload?: any;
}

export const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.payload.token,
          isAuthenticated: true,
          user: action.payload.user,
        },
      };

    case ActionTypes.LOGOUT:
      return {
        ...state,

        auth: {
          ...state.auth,

          token: "",

          isAuthenticated: false,

          user: null,
        },
      };
    default:
      return state;
  }
};
