import React, { Fragment, useState } from 'react'
import { useChain, useMoralis } from "react-moralis"
import { connectors } from './config'
import { getEllipsisTxt } from '../../helpers/formatters'
import { getExplorer } from '../../helpers/networks'
import Blockie from "../Blockie"
import { useTranslation } from 'next-i18next'
import Link from "next/link"
import Address from "../Address/Address"
import { Dialog, Transition } from "@headlessui/react"
import { chains } from "../Chains/config"
import NativeBalance from "../NativeBalance"
import TokenPrice from "../TokenPrice"
import { useRouter } from 'next/router' 


const Account = () => {

  const router = useRouter()
  const { t } = useTranslation('navigation')
  const { isAuthenticated, user, account, chainId, logout } = useMoralis()
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // User is not authenticated yet
  if (!isAuthenticated || !account) {
    return (
      <>
        <Link href="/login" className="text-gray-500 hover:text-gray-800">
          <a>{t('signin')}</a>
        </Link>
      </>
    )
  }

  // Logout and redirect
  const signOut = async () => {
    await logout().then(() => router.push('/'))
  } 

  return (
    <>
      <button 
        type="button" 
        className="relative w-10 h-10 flex justify-center items-center shadow rounded-full bg-slate-400 overflow-hidden"
        onClick={() => setIsModalVisible(!isModalVisible)}
      >
        <span className="transition duration-200 ease-in transform hover:scale-105">
          <Blockie currentWallet scale={5} />
        </span>
      </button>


      {/* :ACCOUNT MODAL */}
      <Transition appear show={isModalVisible} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModalVisible(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="delay-200 ease-in-out duration-300"
                enterFrom="-right-20 opacity-0 scale-95"
                enterTo="sm:right-2 md:right-10 opacity-100 scale-100"
                leave="delay-200 ease-in duration-200"
                leaveFrom="sm:right-2 md:right-10 opacity-100 scale-100"
                leaveTo="-right-80 opacity-0 scale-95"
              >
                <Dialog.Panel className="absolute top-5 pt-3 pb-5 px-6 w-full max-w-sm flex flex-col transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="sr-only">Account Menu</Dialog.Title>
                  {/* ::Title */}
                  <h4 className="self-center text-base text-gray-400 font-bold uppercase tracking-wide">My Wallet</h4>
                  {/* ::Account */}
                  <div className="self-center mt-5 text-xl text-gray-600 font-bold">
                    <Address 
                      avatar="left"
                      sizeLeft={10}
                      sizeRight={4}
                      copyable
                    />
                  </div>
                  {/* ::Status & Manage wallets */}
                  <div className="mt-5 flex justify-around">
                    {/* :::status */}
                    <p className="text-base text-gray-700 font-bold tracking-wide animate-pulse">
                      {isAuthenticated ? "Connected" : "Disconnected"}
                    </p>
                    {/* ::manage wallets */}
                    <Link href="/manage-wallets">
                      <a className="text-base text-teal-500 font-bold tracking-wide hover:text-gray-700">Manage wallets</a>
                    </Link>
                  </div>
                  {/* ::Current wallet */}
                  <div className="mt-8 p-5 border border-gray-200 rounded-md">
                    <div className="flex items-center">
                      {/* :::current chain logo */}
                      <span className="flex-shrink-0 relative mr-4 w-9 h-9 flex justify-center items-center shadow rounded-full bg-slate-400 overflow-hidden">
                        {chainId &&
                          <span className="transform scale-150">{chains[chains.findIndex(chain => chain.key === chainId)].icon}</span>
                        }
                      </span>
                      {/* :::details */}
                      <div className="">
                        <p className="text-base text-gray-400 font-semibold">
                          {isAuthenticated && account
                            ? getEllipsisTxt(account, 20, 4)
                            : "No Ethereum wallet associated"
                          }
                        </p>
                        <p className="text-lg text-gray-700 font-semibold">{chains[chains.findIndex(chain => chain.key === chainId)].value}</p>
                      </div>
                    </div>
                    {/* ::Total balance */}
                    <div className="mt-3 text-center">
                      <p className="text-lg text-gray-500 font-bold">Total balance:</p>
                      <div className="flex justify-center space-x-5">
                        <NativeBalance />
                        <span className="text-lg text-gray-200">|</span>
                        <TokenPrice
                          address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
                          chain="eth"
                          image="https://cloudflare-ipfs.com/ipfs/QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg/"
                          size="40px"
                        />
                      </div>
                    </div>
                    {/* ::Add funds with card */}
                    <div className="mt-6">
                      <Link href="/buy-cryptos">
                        <a className="relative px-3.5 py-2 w-full inline-flex justify-center items-center rounded-full border-2 border-gray-400 bg-gray-400 text-center text-sm text-white font-medium hover:border-gray-500 hover:bg-gray-500">Add funds with card</a>
                      </Link>
                    </div>
                    {/* ::Add funds with card */}
                    <div className="mt-3">
                      <Link href="/swap-cryptos">
                        <a className="relative px-3.5 py-2 w-full inline-flex justify-center items-center rounded-full border-2 border-gray-400 bg-transparent text-center text-sm text-gray-500 font-medium hover:border-gray-600 hover:text-gray-700">Swap/Exchange crypto currency</a>
                      </Link>
                    </div>
                  </div>
                  {/* ::User Section */}
                  <div className="mt-5 py-5 grid grid-cols-2 gap-3 border-t-2 border-gray-100 text-center">
                    {/* :::my profile */}
                    <Link href={`/user-profile/${user.id}`} className="col-span-1">
                      <a className="text-base text-gray-500 font-semibold uppercase hover:text-gray-700">My Profile</a>
                    </Link>
                    {/* :::my nfts */}
                    <Link href={`/user-profile/${user.id}`} className="col-span-1">
                      <a className="text-base text-gray-500 font-semibold uppercase hover:text-gray-700">My NFTs</a>
                    </Link>
                    {/* :::favorites */}
                    <Link href={`/user-profile/${user.id}`} className="col-span-1">
                      <a className="text-base text-gray-500 font-semibold uppercase hover:text-gray-700">My Favorites</a>
                    </Link>
                    {/* :::watchlist */}
                    <Link href={`/user-profile/${user.id}`} className="col-span-1">
                      <a className="text-base text-gray-500 font-semibold uppercase hover:text-gray-700">My Watchlist</a>
                    </Link>
                  </div>
                  {/* ::Add funds with card */}
                  <div className="mt-3">
                    <button 
                      type="button"
                      aria-label="logout"
                      className="relative px-3.5 py-2 w-full inline-flex justify-center items-center rounded-full border-2 border-gray-400 bg-transparent text-center text-sm text-gray-500 font-medium hover:border-gray-600 hover:text-gray-700"
                      onClick={signOut}
                      >
                      Sign out
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Account
