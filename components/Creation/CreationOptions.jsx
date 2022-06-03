import React from 'react'
import Link from 'next/link'


const CreationOptions = ({ isPremium }) => {

  const storeOptions = [
    { name: "NFT", description: "NFT book models limited (PNG model)." },
    { name: "Contract Owner", description: "PubliRare OWN the smart contract (same as OpenSea or Rarible)." },
    { name: "Token Owner", description: "YOU OWN the tokens created on PubliRare smart contract (same as OpenSea or Rarible)." },
    { name: "Cost", description: "Free creation for individual authors." },
    { name: "Limitation", description: "Limited to 3 NFT books." },
    { name: "Copies", description: "Max 10 000 copies minted per NFT" },
    { name: "Cut", description: "Minter cut at 10% (if 100 copies are minted, 10 copies will be transfered to PUREditions" },
    { name: "Royalty", description: "Available" },
    { name: "Metadata", description: "Modification not available*" },
  ]

  const factoryOptions = [
    { name: "NFT", description: "All NFT book models available." },
    { name: "Contract Owner", description: "YOU OWN the smart contract. You really own your NFTs!" },
    { name: "Token Owner", description: "YOU OWN the tokens created on YOUR smart contract." },
    { name: "Cost", description: "Premium account required (from 9,99€/mo)." },
    { name: "Limitation", description: "Unlimited NFT books." },
    { name: "Copies", description: "Unlimited copies." },
    { name: "Cut", description: "Minter cut at 1% (if 100 copies are minted, 1 copy will be transfered to PUREditions)." },
    { name: "Royalty", description: "Available" },
    { name: "Metadata", description: "Modification possible" },
  ]

  return (
    <div className="">

      <div className="mx-auto w-full max-w-5xl flex justify-around">

        {/* ::Option 1 - Store */}
        <div className="m-4 max-w-xs flex flex-col">
          <Link href="/creation/store">
            <a className="group p-5 relative flex flex-col justify-center items-center border-2 border-gray-200 rounded-md bg-gray-50 text-center text-gray-400 hover:text-teal-600 hover:bg-teal-50">
              <svg className="w-20 h-20 fill-current" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 24 24"><path d="M12.5 17.52c1.415-1.054 3.624-1.846 5.5-2v6.479c-1.739.263-3.755 1.104-5.5 2v-6.479zm-1 0c-1.415-1.054-3.624-1.846-5.5-2v6.479c1.739.263 3.755 1.104 5.5 2v-6.479zm-6.5 2.917c-2.049-.674-2.996-1.437-2.996-1.437l-.004-2.025c-.008-2.127.088-3.344 2.648-3.909 2.805-.619 5.799-1.317 4.241-3.521-3.901-5.523-.809-9.545 3.111-9.545 3.921 0 6.996 3.991 3.11 9.545-1.529 2.185 1.376 2.888 4.242 3.521 2.57.568 2.657 1.791 2.647 3.934l-.003 2s-.947.763-2.996 1.437v-6.003l-1.082.089c-2.054.169-4.36 1.002-5.918 2.128-1.559-1.126-3.863-1.959-5.918-2.128l-1.082-.089v6.003z"/></svg>
              <h3 className="text-lg font-semibold">Create on PUREditions</h3>
              <p className="text-sm font-normal uppercase">(Free and Limited)</p>
            </a>
          </Link>
          <div className="mt-4">
            <ul className="flex flex-col list-inside list-disc text-gray-400">
              {storeOptions.map(option => (
                <li key={option.name} className="text-sm">
                  <span className="text-xs text-gray-400 font-bold">{`${option.name}: `}</span>
                  <span className="text-gray-500 font-medium">{option.description}</span>
                </li>
              ))
              }
            </ul>
          </div>       
        </div>


        {/* ::Option 2 - Factory */}
        <div className="m-4 max-w-xs flex flex-col">
          <Link href={isPremium ? "/creation/factory" : "/"}>
            <a className="group p-5 relative flex flex-col justify-center items-center border-2 border-gray-200 rounded-md bg-gray-50 text-center text-gray-400 hover:text-teal-600 hover:bg-teal-50">
              <svg className="w-20 h-20 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 5.173l2.335 4.817 5.305.732-3.861 3.71.942 5.27-4.721-2.524-4.721 2.525.942-5.27-3.861-3.71 5.305-.733 2.335-4.817zm0-4.586l-3.668 7.568-8.332 1.151 6.064 5.828-1.48 8.279 7.416-3.967 7.416 3.966-1.48-8.279 6.064-5.827-8.332-1.15-3.668-7.569z"/></svg>
              <h3 className="text-lg font-semibold">Create on Factory</h3>
              <p className="text-sm font-normal uppercase">(Premium)</p>
            </a>
          </Link>
          <div className="mt-4">
            <ul className="flex flex-col list-inside list-disc text-gray-400">
              {factoryOptions.map(option => (
                <li key={option.name} className="text-sm">
                  <span className="text-xs text-gray-400 font-bold">{`${option.name}: `}</span>
                  <span className="text-gray-500 font-medium">{option.description}</span>
                </li>
              ))
              }
            </ul>
          </div>       
        </div>

      </div>

    </div>
  )
}

export default CreationOptions
