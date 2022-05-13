import { useMoralis, useNativeBalance } from "react-moralis"


const NativeBalance = (props) => {

  const { data: balance } = useNativeBalance()
  const { account, isAuthenticated } = useMoralis()

  if (!account || !isAuthenticated) return null

  return (
    <div className="whitespace-nowrap">
      {balance.formatted}
    </div>
  )
}

export default NativeBalance
