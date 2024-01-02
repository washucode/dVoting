import { createGlobalState } from "react-hooks-global-state";
import moment from "moment";

//initial state

const initialState = {
    contestModal: 'scale-0',
    createPollModal: 'scale-0',
    updatePollModal: 'scale-0',
    deletePollModal: 'scale-0',
    connectedAccount: '',
    currentUser: null,
    contract: null,
    user: null,
    polls: [],
    poll: null,
    contestants: [],
    group: null,
}
// Global state
const {useGlobalState,setGlobalState, getGlobalState} = createGlobalState(initialState);

// convert timestamp to date
const toDate = (timestamp) => {
    const date = new Date(timestamp)
    const dd = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
    const mm = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    const yyyy = date.getFullYear()
    return `${dd}/${mm}/${yyyy}`
}

// truncate string
const truncate = (str, startChar, endChar, max) => {
    if (str.length > max) {
        let start = str.substring(0, startChar)
        let end = str.substring(str.length - endChar, str.length)
        while (start.length + end.length < max) {
            start = start + '.'
        }
        return start + end
    }
    return str
}

// convert str to hex
const toHex = (str) => {
    let hex = ''
    for (let i = 0; i < str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16)
    }
    return hex
}

export {
    toDate,
    truncate,
    toHex,
    useGlobalState,
    setGlobalState,
    getGlobalState,
}