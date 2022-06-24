import React, { useState } from 'react'
import { LightBulbIcon } from "@heroicons/react/outline"
import Link from 'next/link'


const FactoryChoices = ({ user }) => {
  return (
    <div className="pb-28 w-full flex flex-col">
      
      <h2 className="mx-auto max-w-2xl text-center text-gray-700 font-bold">
        <span className="block text-lg">
          <span>Hi</span>
          <span className="text-teal-500">{` ${user.get("username").split(" ")[0]},`}</span>  
        </span>
        <span className="block text-2xl">Welcome to PubliRare Factory</span>
      </h2>

      <p className="mt-10 text-base text-gray-500">Here you&apos;ll be able to create new NFT books that you will really own. You will not only own the new minted tokens but also the smart contract that store these tokens which means that you will be the true owner of your NFT books. Awesome, right ? So what are we waiting for!</p>
      

      {/* :CREATE OPTIONS */}
      <div className="mt-16">
        <p className="text-xl text-gray-700 font-extrabold uppercase">Here are your choices:</p>
        <div className="mt-10 mx-auto max-w-4xl grid grid-cols-2 gap-10">
          {/* ::Create a New Contract  */}
          <Link href="/creation/factory/new-collection" >
            <a className="col-span-1 p-5 max-w-sm flex flex-col border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50">
              <h4 className=" text-center text-lg text-gray-700 font-bold">Create a New collection</h4>
              <div className="flex">
                <span className="my-3 text-teal-500">
                  <svg className="w-24 h-24 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 9h2v6h-2v-6zm9.362-7c4.156 0 2.638 6 2.638 6s6-1.65 6 2.457v4.543h2v-5.386c0-2.391-6.648-9.614-9.811-9.614h-3.189v2h2.362zm-7.362 5v-5h3v-2h-5v7h2zm0 15v-5h-2v7h5v-2h-3zm16-5v5h-3v2h5v-7h-2zm-11 5v2h6v-2h-6z"/></svg>
                </span>
                <ul className="mt-4 ml-3 list-inside list-disc text-left text-sm text-gray-500 disc">
                  <li>Create a new smart contract.</li>
                  <li>Transfer contract ownership to you.</li>
                  <li>Mint NFT book on the contract</li>
                </ul>
              </div>
            </a>
          </Link>
          {/* ::Mint a New Token  */}
          <Link href="/creation/factory/new-token">
            <a className="col-span-1 p-5 max-w-sm flex flex-col border-2 border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50">
              <h4 className="text-center text-lg text-gray-700 font-bold">Mint a New Token</h4>
              <div className="flex">
                <span className="my-3 text-teal-500">
                  <svg className="w-24 h-24 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 12h10v1h-10v-1zm7.816-3h-7.816v1h9.047c-.45-.283-.863-.618-1.231-1zm5.184 1.975v2.569c0 4.106-6 2.456-6 2.456s1.518 6-2.638 6h-7.362v-20h9.5c.312-.749.763-1.424 1.316-2h-12.816v24h10.189c3.163 0 9.811-7.223 9.811-9.614v-3.886c-.623.26-1.297.421-2 .475zm-13-3.975h6.5c-.134-.32-.237-.656-.319-1h-6.181v1zm17-2.5c0 2.485-2.017 4.5-4.5 4.5s-4.5-2.015-4.5-4.5 2.017-4.5 4.5-4.5 4.5 2.015 4.5 4.5zm-2-.5h-2v-2h-1v2h-2v1h2v2h1v-2h2v-1z"/></svg>
                </span>
                <ul className="mt-4 ml-3 list-inside list-disc text-left text-sm text-gray-500">
                  <li>Select an existing collection</li>
                  <li>Mint a new NFT Book on your smart contract</li>
                  <li>Cheaper</li>
                </ul>
              </div>
            </a>
          </Link>
        </div>
      </div>


      {/* :CONSEIL */}
      <div className="mt-10 mx-auto p-5 max-w-2xl border border-yellow-500 rounded-lg bg-yellow-50 text-sm text-yellow-800">
        <h3 className="mb-2 mr-5 float-left inline-flex items-center text-lg font-bold">
          <LightBulbIcon className="mr-2 w-8 h-8 text-yellow-800" />
          Conseil:
        </h3>
        <p className="text-sm text-gray-500">Nous conseillons aux auteurs de regrouper leurs ouvrages (NFT books) par série et ainsi de créer une nouvelle collection (smart contract) pour les livres d&apos;une même série. Par exemple, les 7 livres de la série Harry Potter appartiendront à la même collection &ldquo;Harry Potter&ldquo; et seront donc minter sur le même smart contract.</p>
        <p className="mt-3 text-sm text-gray-500">Si vous êtes un éditeur vous pouvez reprendre le schéma précédent ou créer une nouvelle collection (smart contract) pour chacun de vos auteurs.</p>
        <p className="my-3">Il est à noter que créer un nouveau smart contract sera plus coûteux que de minter un nouveau token sur un smart contract existant.</p>
      </div>

    </div>
  )
}


export default FactoryChoices
