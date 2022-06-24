import React, { useState } from 'react'
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider"
import { Moralis } from 'moralis'
import Image from 'next/image'
import loader from '../../../public/loader2.gif'
import ErrorMessage from "../../Alerts/ErrorMessage"
import TransactionMessage from "../../Alerts/TransactionMessage"


const FuncWriteMintNewNftBook = ({ children, contractAddr, name, to, amount, maxCopies, uri, royaltyFeesInBips, isDisabled, setLoadingState, updateSteps, setCreationStatus, setIsFatalError, setNftInfos, ...props }) => {
  
  const { contractABIs } = useMoralisDapp()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const sendOptions = {
    abi: contractABIs.nftBook1155,
    contractAddress: contractAddr,
    functionName: name,
  }

  const executeFunction = async () => {
    sendOptions.params = {
      to: to,
      amount: amount,
      maxCopies: maxCopies,
      _uri: uri,
      _royaltyFeesInBips: royaltyFeesInBips
    }
    try {
      setIsFetching(true)
      setError(null)
      setIsModalOpen(false)
      setLoadingState(3.1)
      const transaction = await Moralis.executeFunction(sendOptions)
      console.log(transaction.hash);
      const txHash = await transaction.hash 
      console.log("transaction hash:", txHash)
      setNftInfos(prevState => ({ ...prevState, transactionHash: txHash }))
      setLoadingState(3.2)
      setCreationStatus("Your new contract is being submit to the blockchain. It may take a while before the transaction beeing validated on the blockchain so if you like you can now leave this page. You will be able to see in your profile your new smart contract (collection) and NFT once it will be done.")
      setIsFetching(false)
      const receipt = await transaction.wait()
      setData(receipt)
      setIsModalOpen(true)
      setCreationStatus("Contract successfully created and NFT Book minted! Go to your creator profile to get more details about it!")
      setLoadingState(4)
      updateSteps(4)
    } catch (error) {
      setError(error.message)
      setIsFatalError(true)
      setLoadingState(3)
      setIsFetching(false)
    }
  }


  return (
    <>
      {error && <ErrorMessage error={error} setError={setError}  />}
      {data && <TransactionMessage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={data} />}
      <button
        type="button"
        onClick={executeFunction}
        disabled={isFetching || isDisabled}
        {...props}
      >
        {isFetching
          ? <span>
              <Image
                src={loader}
                alt="loading spinner"
                width={40}
                height={40}
              />
            </span>
          : <span>{children}</span>
        }
      </button>
    </>
  )
}

export default FuncWriteMintNewNftBook
