import { Fragment, useState } from 'react'
import { Disclosure, Menu, Switch, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/solid'
import {
  BellIcon,
  CogIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  KeyIcon,
  MenuIcon,
  UserCircleIcon,
  ViewGridAddIcon,
  XIcon,
} from '@heroicons/react/outline'
import { getEllipsisTxt } from "../../../helpers/formatters"
import Blockie from "../../Blockie"
import logo from '../../../public/logo.png'
import Image from 'next/image';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const HeaderDashboard = ({ memberInfos }) => {

  const navigation = [
    { name: 'Dashboard', href: '#', current: true, redirect: false },
    { name: 'Contact', href: '#', current: false, redirect: false },
    { name: 'Moralis', href: 'https://admin.moralis.io/servers', current: false, redirect: true },
    { name: 'Pinata', href: 'https://admin.moralis.io/servers', current: false, redirect: true },
    { name: 'Home', href: '/', current: false, redirect: true },
  ]

  const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
  ]

  return (
    <div>
      <Disclosure as="div" className="relative bg-sky-700 pb-32 overflow-hidden">
        {({ open }) => (
          <>

            {/* :NAVIGATION */}
            <nav
              className={`${
                open ? 'bg-sky-900' : 'bg-transparent'}
                relative z-10 border-b border-teal-500 border-opacity-25 lg:bg-transparent lg:border-none  
              `}
            >

              {/* Large Devices */}
              <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-sky-800">
                  <div className="px-2 flex items-center lg:px-0">

                    {/* ::Logo */}
                    <div className="flex-shrink-0">
                      <Image
                        src={logo}
                        alt="Tree Logo"
                        width={32}
                        height={32}
                      />
                    </div>

                    {/* ::Top Navigation */}
                    <div className="hidden lg:block lg:ml-6 lg:space-x-4">
                      <div className="flex">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            target={item.redirect ? "_blank" : "_self"}
                            rel="noreferrer"
                            className={`${
                              item.current ? 'bg-black bg-opacity-25' : 'hover:bg-sky-800'}
                              flex items-center rounded-md py-2 px-3 text-sm font-medium text-white  
                            `}
                          >
                            {item.name}
                            {item.redirect &&
                              <ExternalLinkIcon className="ml-0.5 w-3 h-3" />
                            }
                          </a>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* ::Welcome & Address */}
                  <div className="flex-grow lg:ml-6 px-2 w-full flex justify-center lg:justify-end sm:space-x-4">
                    <span className="hidden sm:inline-block text-white font-bold">{`Hi, ${memberInfos.name.split()[0]} !`}</span>
                    <span className="text-sky-300">{getEllipsisTxt(memberInfos.account, 5, 4)}</span>
                  </div>

                  {/* ::Mobile Burger Button */}
                  <div className="flex lg:hidden">
                    <Disclosure.Button className="p-2 rounded-md inline-flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon className="block flex-shrink-0 h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>

                  {/* ::Profile & Notification */}
                  <div className="hidden lg:flex lg:ml-4  items-center">
                      {/* :::notification bell */}
                      <button type="button" className="flex-shrink-0 rounded-full p-1 text-sky-200 hover:bg-sky-800 hover:text-white focus:outline-none focus:bg-sky-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-900 focus:ring-white">
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                      {/* :::profile dropdown */}
                      <Menu as="div" className="relative flex-shrink-0 ml-4">
                        <div>
                          <Menu.Button className="rounded-full flex text-sm text-white focus:outline-none focus:bg-sky-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-900 focus:ring-white">
                            <span className="sr-only">Open user menu</span>
                            <span className="flex-shrink-0 relative w-8 h-8 flex justify-center items-center shadow rounded-full bg-slate-400 overflow-hidden">
                              <Blockie currentWallet scale={5} />
                            </span>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={`${
                                      active ? 'bg-gray-100' : ''}
                                      block py-2 px-4 text-sm text-gray-700  
                                    `}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                  </div>

                </div>
              </div>

              {/* Mobile Devices */}
              <Disclosure.Panel className="bg-sky-900 lg:hidden">
                <div className="pt-2 pb-3 px-2 space-y-1">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={`${
                        item.current ? 'bg-black bg-opacity-25' : 'hover:bg-sky-800'}
                        flex items-center rounded-md py-2 px-3 text-base font-medium text-white  
                      `}
                    >
                      {item.name}
                      {item.redirect &&
                        <ExternalLinkIcon className="ml-0.5 w-3 h-3" />
                      }
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-sky-800">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <span className="flex-shrink-0 relative w-8 h-8 flex justify-center items-center shadow rounded-full bg-slate-400 overflow-hidden">
                        <Blockie currentWallet scale={5} />
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{memberInfos.name}</div>
                      <div className="text-sm font-medium text-sky-200">{memberInfos.email}</div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full p-1 text-sky-200 hover:bg-sky-800 hover:text-white focus:outline-none focus:bg-sky-900 focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-900 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md py-2 px-3 text-base font-medium text-sky-200 hover:text-white hover:bg-sky-800"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>

            </nav>


            {/* :BACKGROUND CONTAINER */}
            <div
              aria-hidden="true"
              className={`${
                open ? 'bottom-0' : 'inset-y-0'}
                absolute inset-x-0 left-1/2 transform -translate-x-1/2 w-full overflow-hidden lg:inset-y-0  
              `}
            >
              {/* ::Background Reflects */}
              <div className="absolute inset-0 flex">
                <div className="h-full w-1/2" style={{ backgroundColor: '#0a527b' }} />
                <div className="h-full w-1/2" style={{ backgroundColor: '#065d8c' }} />
              </div>
              <div className="relative flex justify-center">
                <svg className="flex-shrink-0" width={1750} height={308} viewBox="0 0 1750 308" xmlns="http://www.w3.org/2000/svg"><path d="M284.161 308H1465.84L875.001 182.413 284.161 308z" fill="#0369a1" /><path d="M1465.84 308L16.816 0H1750v308h-284.16z" fill="#065d8c" /><path d="M1733.19 0L284.161 308H0V0h1733.19z" fill="#0a527b" /><path d="M875.001 182.413L1733.19 0H16.816l858.185 182.413z" fill="#0a4f76" /></svg>
              </div>
            </div>


            {/* :HEADER TITLE */}
            <header className="relative py-10">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-baseline">
                <h1 className="text-xl sm:text-3xl font-bold text-white">PubliRare Settings</h1>
                <span className="text-base sm:text-xl font-medium text-sky-400">[ {memberInfos.role} ]</span>
              </div>
            </header>

          </>
        )}
      </Disclosure>
    </div>
  )
}

export default HeaderDashboard
