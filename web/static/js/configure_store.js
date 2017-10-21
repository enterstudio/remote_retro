/* eslint-disable global-require */
import { createStore } from "redux"

import rootReducer from "./reducers"

export default () => {
  const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  // ensures that updates to reducers are hot reloaded
  if (module.hot) {
    const oldError = console.error
    console.error = (text) => {
      if (/<Provider> does not support/.test(text)) { return }
      oldError(text)
    }
    module.hot.accept("./reducers/index", () => {
      const nextRootReducer = require("./reducers/index").default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
