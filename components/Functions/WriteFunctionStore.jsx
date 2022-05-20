import React, { useState } from 'react'
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider"
import { Moralis } from 'moralis'
import ErrorMessage from "../Alerts/ErrorMessage"
import Image from 'next/image'
import loader from '../../public/loader2.gif'


const WriteFunctionStore = ({ children, name, params, setData, ...props }) => {

  const { contractAddrs, contractABIs } = useMoralisDapp()
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState()

  const sendOptions = {
    abi: contractABIs.store,
    contractAddress: contractAddrs.store,
    functionName: name,
    params: params
  }

  const executeFunction = async () => {
    try {
      setIsFetching(true)
      const transaction = await Moralis.executeFunction(sendOptions)
      console.log(transaction.hash)
      const receipt = await transaction.wait()
      setData(receipt)
      console.log(receipt);
      setIsFetching(false)
    } catch (error) {
      setError(error)
      setIsFetching(false)
    }
  }

  return (
    <>
      {error && <ErrorMessage error={error} />}
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

export default WriteFunctionStore
