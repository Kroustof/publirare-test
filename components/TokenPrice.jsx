import { useState } from 'react'
import { useTokenPrice } from "react-moralis"


const TokenPrice = (props) => {

  const { data: formattedData } = useTokenPrice(props)
  const [isUSDMode, setIsUSDMode] = useState(true)

  const toggleDisplayStyle = () => setIsUSDMode(!isUSDMode)

  return (
    <>
      <div className="flex items-center space-x-3">
        <span
          className="cursor-pointer"
          onClick={toggleDisplayStyle}
          title={`Show in ${isUSDMode ? "ETH" : "USD"}`}
        >
          {formattedData &&
            (isUSDMode
              ? formattedData.formattedUsd
              : formattedData.formattedNative
            )}
        </span>
      </div>
    </>
  )
}

export default TokenPrice
