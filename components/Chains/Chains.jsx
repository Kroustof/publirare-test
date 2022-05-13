import React, { Fragment, useEffect, useState } from 'react'
import { useChain, useMoralis } from "react-moralis"
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { chains } from "./config"

const menuItems = [...chains]

const Chains = () => {

  const { switchNetwork, chainId, chain } = useChain()
  const { isAuthenticated } = useMoralis()
  const [selected, setSelected] = useState({})

  // console.log("chain", chain);

  useEffect(() => {
    if (!chainId) return () => null;
    const newSelected = menuItems.find((item) => item.key === chainId);
    setSelected(newSelected);
    console.log("current chainId: ", chainId);
  }, [chainId]);

  const handleChainChange = (e) => {
    console.log("switch to:", e.key);
    switchNetwork(e.key)
  }

  if (!chainId || !isAuthenticated) return <span className="text-sm text-white font-medium">Blockchain</span>

  return (
    <div className="w-32 sm:w-44">
      <Listbox value={selected} onChange={handleChainChange}>
        <div className="relative mt-1">
          <Listbox.Button className="relative py-1 pl-3 pr-10 w-full flex items-center shadow-md rounded-lg bg-gray-500 bg-opacity-50 text-left sm:text-sm text-white focus:outline-none focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300">
            <span className="mr-3 block">{selected.icon}</span>
            <span className="hidden sm:block truncate">{selected.value}</span>
            <span className="block sm:hidden">
              {selected.value &&
                selected.value.split("").slice(0,3).join("").toUpperCase()
              }
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {menuItems.map((item, chainIdx) => (
                <Listbox.Option
                  key={chainIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-12 pr-4 ${
                      active ? 'bg-teal-100 text-teal-900' : 'text-gray-900'
                    }`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {item.value}
                      </span>
                      {selected 
                        ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) 
                        : (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
                              {item.icon}
                            </span>
                          )
                      }
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default Chains
