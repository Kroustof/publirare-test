import { useEffect, useRef, useState } from "react"
import { useMoralis, useMoralisQuery } from "react-moralis"
import { Moralis } from 'moralis'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import loader from '../../public/loader.gif'
import MemberLogin from "../../components/Team/MemberLogin"
import TeamDashboard from "../../components/Team/TeamDashboard"


export default function TeamSpace() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAllowed, setIsAllowed] = useState(null) // initial state: null
  const [memberId, setMemberId] = useState(null) // initial state: null
  const [isLoggedIn, setIsLoggedIn] = useState(false) // initial state: false
  const [memberInfos, setMemberInfos] = useState({})
  const { isAuthenticated, isAuthUndefined, account } = useMoralis()
  

  const checkAccount = async () => {
    setIsLoading(true)
    const Team = await Moralis.Object.extend("Team")
    const query = new Moralis.Query(Team)
    query.equalTo("account", account)
    const isMember = await query.count() > 0
    
    if (isMember) {
      const member = await query.first()
      const memberId = member.id
      setMemberId(memberId)
      setIsAllowed(true)
    } else {
      setIsAllowed(false)
    }
    setIsLoading(false)
  }

  //! REDIRECT UNAUTHENTICATED USERS TO LOGIN PAGE
  useEffect(() => {
    if (!isAuthenticated && !isAuthUndefined) {
      router.push("/")
    }
  })
  

  //? ====================== CHECK USER ACCESS RIGHT TO MEMBER LOGIN PAGE ==================================================================================
  if (isAuthenticated && !isLoading) {

    //? ====================== USER IS ALLOWED TO THIS LOGIN PAGE ==================================================================================
    if (isAllowed && !isLoggedIn && memberId && memberId.length === 24) {
      return(
        <>
          <MemberLogin 
            account={account}
            memberId={memberId}
            setMemberInfos={setMemberInfos}
            setIsLoggedIn={setIsLoggedIn}
            setIsLoading={setIsLoading}
          />
        </>
      )
    }

    //? ====================== MEMBER DASHBOARD ====================================================================================================
    if (isAllowed && memberId && memberId.length === 24 && isLoggedIn) {
      return(
        <>
          <TeamDashboard 
            memberInfos={memberInfos}
          />
        </>
      )
    }

    //? ====================== CHECK IF USER IS A TEAM MEMBER =======================================================================================
    return (
      <div className="my-10 flex flex-col items-center space-y-5">
        <button
          type="button" 
          className="relative inline-flex items-center px-3.5 py-2 rounded border border-transparent bg-teal-600 text-sm text-white font-medium"
          onClick={checkAccount}
        >
          Continue
        </button>
        <Link href="/">go home</Link>
        {isAllowed === false &&
          <p className="text-red-600">Sorry, this account is not allowed to connect to the login</p>
        }
      </div>
    )
  }

  
  //? ====================== LOADING... ===============================================================================================================
  return (
    <div className="lg:p-20 flex flex-col justify-center items-center space-y-3">
      <Image 
        src={loader}
        alt="loading spinner"
      />
      <Link href="/">
        <a className="mt-10 text-gray-500 underline hover:text-gray-700">Return to Homepage</a>
      </Link>
    </div>
  )
};
