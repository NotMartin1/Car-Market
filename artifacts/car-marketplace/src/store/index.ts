import { configureStore } from "@reduxjs/toolkit";
import authReducer       from "./slices/authSlice";
import filtersReducer    from "./slices/filtersSlice";
import savedReducer      from "./slices/savedSlice";
import chatReducer       from "./slices/chatSlice";
import languageReducer   from "./slices/languageSlice";
import notificationsReducer from "./slices/notificationsSlice";
import compareReducer    from "./slices/compareSlice";

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    filters:       filtersReducer,
    saved:         savedReducer,
    chat:          chatReducer,
    language:      languageReducer,
    notifications: notificationsReducer,
    compare:       compareReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
