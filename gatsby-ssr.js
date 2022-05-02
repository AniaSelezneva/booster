const React = require("react")
const GlobalContextProvider = require("./src/context/GlobalContextProvider.js")
    .default
const initialState = require("./src/context/GlobalContextProvider.js")

exports.wrapRootElement = ({ element }) => {
    return (
        <GlobalContextProvider value={initialState}>
            {element}
        </GlobalContextProvider>
    )
}