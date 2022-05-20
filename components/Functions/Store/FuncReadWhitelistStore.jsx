import React, { useState } from 'react'
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider"
import { Moralis } from 'moralis'
import Image from 'next/image'
import loader from '../../../public/loader2.gif'
import ErrorMessage from "../../Alerts/ErrorMessage"
import TransactionMessage from "../../Alerts/TransactionMessage"


const FuncReadWhitelistStore = ({ children, name, userAddress, ...props }) => {

  const { contractAddrs, contractABIs } = useMoralisDapp()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const sendOptions = {
    abi: contractABIs.store,
    contractAddress: contractAddrs.store,
    functionName: name,
  }

  const executeFunction = async () => {
    sendOptions.params = {
      userAddress: userAddress.current.value
    }
    try {
      setIsFetching(true)
      setIsModalOpen(false)
      const response = await Moralis.executeFunction(sendOptions)
      console.log("Response:", response);
      setData(response)
      setIsModalOpen(true)
      setIsFetching(false)
    } catch (error) {
      setError(error)
      setIsFetching(false)
    }
  }

  return (
    <>
      {error && <ErrorMessage error={error} />}
      {data !== null && <TransactionMessage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} data={data} />}
      <button
        type="button"
        onClick={executeFunction}
        disabled={isFetching}
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

export default FuncReadWhitelistStore
