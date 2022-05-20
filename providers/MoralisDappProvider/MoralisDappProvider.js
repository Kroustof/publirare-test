import React, { useEffect, useState } from 'react'
import { useMoralis } from "react-moralis"
import MoralisDappContext from "./context"
import { useTranslation } from "next-i18next"
import factory1155 from '../../contracts/abi/FactoryERC1155.json'
import store from '../../contracts/abi/PubliRareStore.json'
import marketplace1155 from '../../contracts/abi/Marketplace1155.json';


function MoralisDappProvider({ children }) {

  const { t } = useTranslation('common')
  
  const { web3, enableWeb3, isWeb3Enabled, isAuthenticated, isWeb3EnableLoading, Moralis, user, refetchUserData } = useMoralis()
  const [userId, setUserId] = useState()
  const [isCreator, setIsCreator] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [walletAddress, setWalletAddress] = useState()
  const [networkId, setNetworkId] = useState()
  const [contractABIs, setContractABIs] = useState({
    marketplace1155: marketplace1155.abi,
    store: store.abi,
    factory1155: factory1155.abi
  }) // Smart contract ABIs here 
  const [contractAddrs, setContractAddrs] = useState({
    marketplace1155: process.env.NEXT_PUBLIC_MARKETPLACE1155_ADDRESS,
    store: process.env.NEXT_PUBLIC_STORE_ADDRESS,
    factory1155: process.env.NEXT_PUBLIC_FACTORY1155_ADDRESS
  }) // Smart contracts proxy addresses here


  useEffect(() => {
    const connectorId = window.localStorage.getItem("connectorId");
    if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
      enableWeb3({ provider: connectorId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled]);

  
  useEffect(() => {
    // Listening chain change and update app state
    Moralis.onChainChanged(function (chain) {
      setNetworkId(chain)
    })
    
    // Listening accounts change and update app state
    Moralis.onAccountChanged(async function (address) {
      const confirmed = confirm(t('confirmLinkAddress'))
      if (confirmed) {
        await Moralis.link(address)
      }
      setWalletAddress(address)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    async function fetchnetworkId() {
      if (isWeb3Enabled) {
        // Listen the default chain provided by the given provider of the browser environment
        const network = await web3.getNetwork()
        console.log("network id:", network.chainId);
        setNetworkId(network.chainId)
      }
    }
    fetchnetworkId()
  })

  useEffect(() => {
    async function fetchWalletAddress() {
      if (isWeb3Enabled) {
        const selectedAddress = await web3.provider.selectedAddress
        console.log("wallet address:", selectedAddress);
        setWalletAddress(selectedAddress || user?.get("ethAddress"))
      }
    }
    fetchWalletAddress()
  }, [web3, isWeb3Enabled, user])

  useEffect(() => {
    if (isAuthenticated) {
      const id = user.id
      setUserId(id)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    if (user) {
      setIsCreator(null)
      refetchUserData()
      .then(() => {
        setIsCreator(user.get("isCreator"))
      })
    } 
    setIsLoading(false)
  }, [user, refetchUserData])

  return (
    <MoralisDappContext.Provider value={{ 
      walletAddress, 
      networkId, 
      contractAddrs, 
      setContractAddrs, 
      contractABIs, 
      setContractABIs,
      userId, 
      isCreator,
      isLoading,
      setIsLoading
    }}>
      {children}
    </MoralisDappContext.Provider>
  )
}



function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext)
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider")
  }
  return context
}


export { MoralisDappProvider, useMoralisDapp }