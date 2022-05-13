import React, { useEffect, useState } from 'react'
import { useMoralis } from "react-moralis"
import OKSDappContext from "./context"
import { useTranslation } from "next-i18next"


function OKSDappProvider({ children }) {

  const { t } = useTranslation('common')
  
  const { web3, enableWeb3, isWeb3Enabled, isAuthenticated, isWeb3EnableLoading, Moralis, user, account } = useMoralis()
  const [userId, setUserId] = useState()
  const [walletAddress, setWalletAddress] = useState()
  const [networkId, setNetworkId] = useState()
  const [contractABIs, setContractABIs] = useState({
    marketplace: null,
    store: null,
    factory: null
  }) // Smart contract ABIs here 
  const [contractAddrs, setContractAddrs] = useState({
    marketplace: null,
    store: null,
    factory: null
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

  return (
    <OKSDappContext.Provider value={{ walletAddress, networkId, contractAddrs, setContractAddrs, contractABIs, setContractABIs, userId }}>
      {children}
    </OKSDappContext.Provider>
  )
}



function useOKSDapp() {
  const context = React.useContext(OKSDappContext)
  if (context === undefined) {
    throw new Error("useOKSDapp must be used within a OKSDappProvider")
  }
  return context
}


export { OKSDappProvider, useOKSDapp }