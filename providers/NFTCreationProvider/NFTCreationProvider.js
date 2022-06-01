import React, { useEffect, useState } from 'react'
import NFTCreationContext from "./context"
import { useMoralisDapp } from "../MoralisDappProvider/MoralisDappProvider"
import { useMoralis } from "react-moralis"



function NFTCreationProvider({ children }) {

  const { isCreator, creatorInfos } = useMoralisDapp()
  const { isAuthenticated, user, refetchUserData } = useMoralis()


  const [isLoading, setIsLoading] = useState(false)
  const [isNewContract, setIsNewContract] = useState(null)
  const [creationSteps, setCreationSteps] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false
  })

  const reseCreation = () => {
    setIsLoading(true)
    setCreationSteps({
      step1: false,
      step2: false,
      step3: false,
      step4: false
    })
  }

  useEffect(() => {
    if (isAuthenticated && isCreator) {
      reseCreation()
    }
  }, [isAuthenticated, isCreator])

  return (
    <NFTCreationContext.Provider value={{ 
      isNewContract,
      setIsNewContract,
      creationSteps,
      setCreationSteps,
      isLoading,
      setIsLoading
    }}>
      {children}
    </NFTCreationContext.Provider>
  )
}



function useNFTCreation() {
  const context = React.useContext(NFTCreationContext)
  if (context === undefined) {
    throw new Error("useNFTCreation must be used within a NFTCreationProvider")
  }
  return context
}


export { NFTCreationProvider, useNFTCreation }