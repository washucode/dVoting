import abi from './abis/src/contracts/DVoting.sol/DVoting.json'
import address from './abis/address.json'
import { getGlobalState, setGlobalState } from './store'
import { ethers } from 'ethers'
import { isAuthenticated, logoutChat } from './Chat.services'
import { list } from 'postcss'


const { ethereum } = window 
const  {contractAddress} = address
const { contractAbi } = abi.abi


// get contract
const getContract = () => {
    const connectedAccount = getGlobalState('connectedAccount')

    if (connectedAccount) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, contractAbi, signer)
        return contract
    } else {
        return getGlobalState('contract')
    }
}

// check wallet connection

const isWalletConnected = async () => {
    try {
        if (!ethereum) { return alert('Please install MetaMask') }
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        setGlobalState('connectedAccount', accounts[0]?.toLowerCase())

        window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload()
        })

        window.ethereum.on('accountsChanged', async() => {
            setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
            await logoutChat()
            window.location.reload()
    })

    if (accounts.length) {
        setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } else {
        alert('Please connect your wallet')

        console.log('No accounts found')
     }
    } catch (error){
        console.log(error)
        reportError(error)
    }
}


// connect wallet

const connectWallet = async () => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
       const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
       setGlobalState('connectedAccount', accounts[0]?.toLowerCase())
    } catch (error){
        console.log(error)
        reportError(error)

    }

}

// get poll

const getPoll = async (id) => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const contract = getContract()
        const poll = await contract.getPoll(id)
        setGlobalState('poll', structuredPolls(poll)[0])
    } catch (error){
        console.log(error)
        reportError(error)
    }
}

// get polls

const getAllPolls = async () => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const contract = getContract()
        const polls = await contract.getAllPolls()
        setGlobalState('polls', structuredPolls(polls))
    } catch (error){
        console.log(error)
        reportError(error)
    }
}

// structured polls

const structuredPolls = (polls) => {
    polls.map((poll) => ({
        id: poll.id.toNumber(),
        title: poll.title,
        image: poll.image,
        description: poll.description,
        startsAt: poll.startsAt,
        endsAt: poll.endsAt,
        timestamp: new Date(poll.timestamp.toNumber()).getTime(),
        votes: poll.totalVotes.toNumber(),
        director: poll.director?.toLowerCase(),
        contestants: poll.contestants.toNumber(),
        deleted: poll.deleted
    }))   
}

// create poll

const createPoll = async ({title,image,description,startsAt,endsAt}) => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }

        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        await contract.createPoll(title,image,description,startsAt,endsAt, {
            from: connectedAccount,
        })
        await getAllPolls()
        }  catch (error){
            console.log(error)
            reportError(error)
        }

}

// update poll

const updatePoll = async ({id,title,image,description,startsAt,endsAt}) => 
{
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        await contract.updatePoll(id,title,image,description,startsAt,endsAt, {
            from: connectedAccount,
        })
        await getAllPolls()
        } catch (error){
            console.log(error)
            reportError(error)
        }
}

// delete poll

const deletePoll = async (id) => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        await contract.deletePoll(id, {
            from: connectedAccount,
        })
        await getAllPolls()
        } catch (error){
            console.log(error)
            reportError(error)
        }
}

// structured contestants

const structuredContestants = (contestants, connectedAccount) => 
    contestants.map((contestant) => ({
        id: contestant.id.toNumber(),
        name: contestant.name,
        image: contestant.image,
        voter: contestant.voter?.toLowerCase(),
        voters: contestant.votes.map((vote) => vote.toLowerCase()),
        votes: contestant.votes.toNumber(),
    })).sort((x,y) => y.votes - x.votes)


// report error

const reportError = (error) => {
    console.log(error.message)
    throw new Error("No ethereum object")
}

// register user

const registerUser = async ({fullname, image}) => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        await contract.registerUser(fullname, image, {
            from: connectedAccount,
        })
        await getUser()
    } catch (error){
        console.log(error)
        reportError(error)
    }
}


// get user

const getUser = async () => {
    try{
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        const user = await contract.users(connectedAccount)
        setGlobalState('user', structuredUser(user))
    } catch (error){
        console.log(error)
        reportError(error)
    }
}


// contest

const contest = async (id) => {
    try {
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        await contract.contest(id, {
            from: connectedAccount,
        })
        await getPoll(id)
    } catch (error){
        console.log(error)
        reportError(error)
    }
}


// vote

const vote = async (id, cid) => {
    try {
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const connectedAccount = getGlobalState('connectedAccount')
        const contract = getContract()
        await contract.vote(id, cid, {
            from: connectedAccount,
        })
        await getPoll(id)
        await listContestants(id)
    } catch (error){
        console.log(error)
        reportError(error)
    }
}



// list contestants

const listContestants = async (id) => {
    try {
        if(!ethereum){
            alert('Please install MetaMask')
            return
        }
        const contract = getContract()
        const contestants = await contract.listContestants(id)
        setGlobalState('contestants', structuredContestants(contestants))
    } catch (error){
        console.log(error)
        reportError(error)
    }
}


export{
    isWalletConnected,
    connectWallet,
    getPoll,
    getAllPolls,
    createPoll,
    updatePoll,
    deletePoll,
    registerUser,
    getUser,
    contest,
    vote,
    listContestants,
}