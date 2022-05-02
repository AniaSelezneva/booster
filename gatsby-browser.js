import React from "react"
import GlobalContextProvider, {
    initialState,
} from "./src/context/GlobalContextProvider.js"

export const wrapRootElement = ({ element }) => {
    return (
        <GlobalContextProvider value={initialState}>
            {element}
        </GlobalContextProvider>
    )
}