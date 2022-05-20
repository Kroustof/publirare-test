import React, { useRef } from 'react'
import { Moralis } from 'moralis'


const MemberLogin = ({ account, memberId, setIsLoading, setMemberInfos, setIsLoggedIn }) => {

  const memberNameRef = useRef()
  const memberEmailRef = useRef()
  const memberPasswordRef = useRef()

  const memberLogin = async () => {
    const Team = await Moralis.Object.extend("Team")
    const query = new Moralis.Query(Team)
    const member = await query.get(memberId)
    const parentUser = member.get("parentUser")
    await parentUser.fetch()
    
    const checkAccount = member.attributes.account === account
    const checkMemberName = member.attributes.memberName === memberNameRef.current.value
    const checkEmail = parentUser.attributes.email === memberEmailRef.current.value
    const checkPassword = member.attributes.password === memberPasswordRef.current.value
    setIsLoading(true)
    
    if (checkAccount && checkMemberName && checkEmail) {
      setIsLoggedIn(true)
      let memberData = {
        name: member.attributes.memberName,
        account: member.attributes.account,
        role: member.attributes.role, 
        email: parentUser.attributes.email,
        createdAt: member.attributes.createdAt,
        updatedAt: member.attributes.updatedAt
      }
      setMemberInfos(memberData)
    } else {
      alert(`Error while log in attempt: 
        ${!checkAccount ? "Account not allowed" : ""}
        ${!checkUsername ? "Unknown member" : ""}
        ${!checkEmail ? "Wrong email" : ""}
        ${!checkPassword ? "Wrong password" : ""}
      `)
    }
    setIsLoading(false)
  }

  return(
    <div className="flex flex-col items-center space-y-5">
      <h1 className="text-center text-4xl text-gray-700 font-bold">Team Login Page</h1>
      {/* ::Member name input */}
      <span className="col-span-1 inline-block">
        <label htmlFor="member-name" className="text-sm text-gray-700 font-medium">Member Name</label>
        <input 
          type="text" id="member-name" name="member-name"
          ref={memberNameRef}
          placeholder="Enter your member-name"
          className="form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </span>
      {/* ::Member email */}
      <span className="col-span-1 inline-block">
        <label htmlFor="member-email" className="text-sm text-gray-700 font-medium">Member Email</label>
        <input 
          type="email" id="member-email" name="member-email"
          ref={memberEmailRef}
          placeholder="Enter your member-email"
          className="form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </span>
      {/* ::Member password */}
      <span className="col-span-1 inline-block">
        <label htmlFor="member-password" className="text-sm text-gray-700 font-medium">Password</label>
        <input 
          type="password" id="member-password" name="member-password"
          ref={memberPasswordRef}
          placeholder="Enter your member-password"
          className="form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
        />
      </span>
      <button onClick={memberLogin} className="">log in</button>
    </div>
  )
}

export default MemberLogin
