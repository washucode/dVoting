import { CometChat } from "@cometchat/chat-sdk-react-native";
import { getGlobalState, setGlobalState } from "./store";
import { connect } from "react-redux";
import { connected } from "process";


const KEYS ={
    APP_ID: process.env.REACT_APP_COMETCHAT_APP_ID,
    REGION: process.env.REACT_APP_COMETCHAT_REGION,
    AUTH_KEY: process.env.REACT_APP_COMETCHAT_AUTH_KEY,
}


// initialize CometChat
const initiateChat = async () => { 
    const appID = KEYS.APP_ID;
    const region = KEYS.REGION;

    const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();

    await CometChat.init(appID, appSetting).then(() => {
        console.log("Initialization completed successfully").catch((error) => console.log("Initialization failed with error:", error));
       
    });
}

// login with CometChat
const loginChat = async () => {
    const authKey = KEYS.AUTH_KEY;
    const uid = getGlobalState(connectedAccount);
    await CometChat.login(uid, authKey).then(
        (user) => {
            console.log("Login Successful:", { user });
            setGlobalState('currentUser', user)
        },
        (error) => {
            console.log("Login failed with exception:", {error});
        }
    );
}

// signup with CometChat

const signupChat = async (name) => {
    const authKey = KEYS.AUTH_KEY;
    const uid = getGlobalState(connectedAccount);
    const user = new CometChat.User(uid);

    user.setName(name);

    return await CometChat.createUser(user, authKey).then(
        (user) => {
            console.log("user created", user);
            setGlobalState('currentUser', user)
        },
        (error) => {
            console.log("error", error);
        }
    );
}


// logout with CometChat

const logoutChat = async () => {
    await CometChat.logout().then(
        () => {
            console.log("Logout completed successfully");
        },
        (error) => {
            console.log("Logout failed with exception:", { error });
        }
    );
}

// check if user is authenticated

const isAuthenticated = async () => {
    await CometChat.getLoggedinUser()
    .then((user) => {
        console.log("user", { user });
        setGlobalState('currentUser', user)
    }),
    (error) => {
        console.log("error", { error });
    }
}


// create a group

const createGroup = async (group) => {
    const GUID = group;
    const groupName = group;
    const groupType = CometChat.GROUP_TYPE.PUBLIC;
    const password = "";

    const group = new CometChat.Group(GUID, groupName, groupType, password);

    await CometChat.createGroup(group).then(
        (group) => {
            console.log("Group created successfully:", group);
            setGlobalState('group', group)
        },
        (error) => {
            console.log("Group creation failed with exception:", error);
        }
    );
}

// join a group

const joinGroup = async (GUID) => {
    const password = "";

    await CometChat.joinGroup(GUID, CometChat.GROUP_TYPE.PUBLIC, password).then(
        (group) => {
            console.log("Group joined successfully:", group);
            setGlobalState('group', group)
        },
        (error) => {
            console.log("Group joining failed with exception:", error);
        }
    );
}


// get a group

const getGroup = async (GUID) => {
    await CometChat.getGroup(GUID).then(
        (group) => {
            console.log("Group details fetched successfully:", group);
            setGlobalState('group', group)
        },
        (error) => {
            console.log("Group details fetching failed with exception:", error);
        }
    );
}

// get messages

const getMessages = async (GUID) => {
    const limit = 30;

    const messagesRequest = new CometChat.MessagesRequestBuilder()
    .setGUID(GUID)
    .setLimit(limit)
    .build();

    return await messagesRequest.fetchPrevious().then(
        (messages) => {
            console.log("Message list fetched successfully:", messages);
        },
        (error) => {
            console.log("Message fetching failed with error:", error);
        }
    );
}

// send message

const sendMessage = async (GUID, message) => {
    const receiverID = GUID;
    const messageText = message;
    const receiverType = CometChat.RECEIVER_TYPE.GROUP;

    const textMessage = new CometChat.TextMessage(receiverID, messageText, receiverType);

    return await CometChat.sendMessage(textMessage).then(
        (message) => {
            console.log("Message sent successfully:", message);
        },
        (error) => {
            console.log("Message sending failed with error:", error);
        }
    );
}

export {
    initiateChat,
    loginChat,
    signupChat,
    logoutChat,
    isAuthenticated,
    createGroup,
    joinGroup,
    getGroup,
    getMessages,
    sendMessage,
    CometChat
}