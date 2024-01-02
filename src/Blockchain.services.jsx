import abi from './abis/src/contracts/DVoting.sol/DVoting.json'
import address from './abis/address.json'
import { getGlobalState, setGlobalState } from './store'
import { ethers } from 'ethers'
import { isAuthenticated, logoutChat } from './Chat.services'


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