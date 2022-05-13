import React from 'react'
import Blockies from "react-blockies";
import { useMoralis } from "react-moralis";

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

const Blockie = (props) => {

  const { account, isAuthenticated } = useMoralis()
  if (!props.address && (!account || !isAuthenticated))
    return (
      <span className="inline-block w-10 h-10 rounded-full bg-slate-300 animate-pulse" />
    );

  return (
    <Blockies 
      seed={
        props.currentWallet 
          ? account.toLocaleLowerCase() 
          : props.address.toLocaleLowerCase()
      }
      className="identicon"
      {...props}
    />
  )
}

export default Blockie
