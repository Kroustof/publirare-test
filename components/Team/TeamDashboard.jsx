import { useState } from 'react'
import { Moralis } from 'moralis'
import CreatorTools from "./dashboard/CreatorTools"
import HeaderDashboard from "./dashboard/HeaderDashboard"
import FactoryTools from "./dashboard/FactoryTools"
import ContractsTools from "./dashboard/ContractsTools"
import {
  CogIcon,
  CurrencyDollarIcon,
  ScissorsIcon,
  KeyIcon,
  TicketIcon,
  UserCircleIcon,
  LibraryIcon,
  IdentificationIcon,
  UserGroupIcon,
  EyeIcon,
  EyeOffIcon,
  LockClosedIcon,
} from '@heroicons/react/outline'



export default function TeamDashboard({ memberInfos }) {

  const subNavigation = [
    { name: 'Creators', href: '#', icon: UserCircleIcon },
    { name: 'Factory', href: '#', icon: CogIcon },
    { name: 'Store', href: '#', icon: TicketIcon },
    { name: 'Marketplace', href: '#', icon: LibraryIcon },
    { name: 'Cut Editions', href: '#', icon: ScissorsIcon },
    { name: 'Permissions', href: '#', icon: KeyIcon },
    { name: 'Member Profile', href: '#', icon: IdentificationIcon },
    { name: 'Team', href: '#', icon: UserGroupIcon },
    { name: 'Finances', href: '#', icon: CurrencyDollarIcon },
    { name: 'Contracts', href: '#', icon: LockClosedIcon },
  ]

  const [currentSubNav, setCurrentSubNav] = useState("Creators")
  const [showSideNav, setShowSideNav] = useState(true)
  
  const [isDataLoading, setIsDataLoading] = useState(false)
  console.log(memberInfos.role);
  return (
    <div>

      {/* :HEADER */}
      <div>
        <HeaderDashboard 
          memberInfos={memberInfos}
        />
      </div>

      <main className="relative -mt-32">
        <div className="max-w-screen-xl mx-auto pb-6 px-4 sm:px-6 lg:pb-16 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200 lg:flex lg:divide-y-0 lg:divide-x">

              {/* :SIDE NAVIGATION */}
              <aside className={`flex-shrink-0 pt-3 pb-6 ${showSideNav ? "" : "lg:col-span-1"}`}>

                {/* ::Hide & Show */}
                <button 
                  onClick={() => setShowSideNav(!showSideNav)}
                  className="mb-2 pl-1 pr-2 w-full flex justify-end text-sm text-gray-400"
                >
                  {showSideNav 
                    ? <> reduce <EyeOffIcon className="ml-2 w-6 h-6"/></>
                    : <> extend <EyeIcon className="ml-2 w-6 h-6" /></>
                  }
                </button>

                {/* ::Navigation */}
                <nav className="flex flex-row lg:flex-col flex-wrap sm:justify-center space-y-1">
                  {subNavigation.map((item) => (
                    <button
                      type="button"
                      key={item.name}
                      className={`${
                        item.name === currentSubNav
                          ? 'bg-teal-50 border-teal-500 text-teal-700 hover:bg-teal-50 hover:text-teal-700'
                          : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900'}
                          'group border-l-4 pl-3 pr-10 py-2 w-1/2 sm:w-auto flex items-center text-sm font-medium'
                      `}
                      aria-current={item.name === currentSubNav ? 'page' : undefined}
                      onClick={() => setCurrentSubNav(item.name)}
                    >
                      <item.icon
                        className={`${
                          item.name === currentSubNav
                            ? "text-teal-500 group-hover:text-teal-500" 
                            : "text-gray-400 group-hover:text-gray-500"}
                            flex-shrink-0 -ml-1 mr-3 h-6 w-6
                          `}
                        aria-hidden="true"
                      />
                      <span className={`truncate ${showSideNav ? "inline-block" : "hidden"}`}>{item.name}</span>
                    </button>
                  ))}
                </nav>
              </aside>
              

              {/* :CATEGORY DISPLAY */}
              <div className={`flex-grow py-6 w-full px-3 divide-y divide-gray-200 overflow-x-auto`}>

                {/* ::Creators Tools */}
                {currentSubNav === "Creators" &&
                  <CreatorTools 
                    isDataLoading={isDataLoading}
                    setIsDataLoading={setIsDataLoading}
                  />
                }

                {/* ::Factory Tools */}
                {currentSubNav === "Factory" &&
                  <FactoryTools 
                    isDataLoading={isDataLoading}
                    setIsDataLoading={setIsDataLoading}
                  />
                }

                {/* ::Contracts Tools */}
                {currentSubNav === "Contracts" &&
                  <ContractsTools 
                    isDataLoading={isDataLoading}
                    setIsDataLoading={setIsDataLoading}
                    memberInfos={memberInfos}
                  />
                }

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
