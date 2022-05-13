
import React, { useEffect, useState } from 'react'
import { useMoralis } from "react-moralis";
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next';
import Link from 'next/link'
import Image from 'next/image'
import { Popover } from "@headlessui/react"
import { KeyIcon, LoginIcon, MenuIcon, SearchIcon, UserIcon, XIcon } from "@heroicons/react/outline"
import logo from '../../../public/logo.png'
import Chains from "../../Chains/Chains";
import Account from "../../Account/Account";


const Header = () => {

  const navigation = {
    pages: [
      { name: "authors", href:"/author" },
      { name: "calendar", href:"/calendar" },
      { name: "tops", href:"/tops&news" },
      { name: "packages", href:"/packages" },
    ],
    categories: [
      {
        id: "explore",
        name: "explore",
        href: "/explore",
        sections: [
          {
            id: "romans",
            name: "romans",
            href: "/explore/?category=romans",
            imageSrc: "https://fancytailwind.com/static/new-arrivals-women-656dca5c8d7d2b16bb7a182419cfdb1d.jpg",
            imageAlt: "description of image"
          },
          {
            id: "mangas",
            name: "mangas",
            href: "/explore/?category=mangas",
            imageSrc: "https://fancytailwind.com/static/accessories-women-9f105984d1074ed4aa064a4a682d1359.jpg",
            imageAlt: "description of image"
          },
          {
            id: "comics",
            name: "comics",
            href: "/explore/?category=comics",
            imageSrc: "https://fancytailwind.com/static/sport-shoes1-213bfd71bb5472ff7562b03d00a79a6c.jpg",
            imageAlt: "description of image"
          },
          {
            id: "others",
            name: "others",
            href: "/explore/?category=others",
            imageSrc: "https://fancytailwind.com/static/swimsuit-women1-9dbf5393ea95e3cbed1a535eb4aeba39.jpg",
            imageAlt: "description of image"
          }
        ]
      },
    ]
  }

  // Scroll state
  useEffect(() => {
    let prevScrollpos = window.pageYOffset
    const menu = document.getElementById("menu")
    window.addEventListener("scroll", () => {
      let currentScrollPos = window.pageYOffset
      if (prevScrollpos > currentScrollPos) {
        menu.style.top = "0"
      } else {
        menu.style.top = "-50px"
      }
      prevScrollpos = currentScrollPos
    })
  })
  // Small device state
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("explore")
  // Page Tree dapp context
  const { isAuthenticated } = useMoralis()
  // Translation
  const router = useRouter()
  const { t } = useTranslation(['navigation'])
  const changeLang = (e) => {
    const url = router.pathname
    router.push(url, url, { locale: e.target.value })
  }

  return (
    <div className="sticky inset-0 z-10 w-full bg-transparent">
      
      {/* :STORE NAVIGATION (SMALL DEVICE) */}
      <div className="md:hidden">

        {/* ::Overlay Background */}
        <div className={`z-30 fixed inset-0 w-full h-screen bg-gray-800 bg-opacity-75 ${isMenuOpen ? "visible" : "invisible"}`} />

        {/* ::Mobile Menu */}
        <div className={`z-50 fixed top-0 left-0 md:inset-0 md:relative w-full h-full max-h-screen max-w-xs overflow-y-scroll md:overflow-auto bg-gray-50 transition-all duration-300 ease-in-out transform ${isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
          <div className="flex flex-col">
            {/* :::Close menu button */}
            <span className="pt-3 pb-5 pr-3 flex justify-end">
              <button className="text-gray-500 hover:text-gray-800" onClick={() => setIsMenuOpen(false)}>
                <XIcon className="w-7 h-7" />
              </button>
            </span>
            {/* :::Tab button */}
            <div className="grid grid-cols-2 gap-x-4 border-b-2 border-gray-100">
              {navigation.categories.map(category => (
                <button key={category.id} className={`col-span-1 py-3 px-4 ${category.id === activeTab ? "border-b-2 border-gray-800 text-gray-800" : "text-gray-500"} text-center text-lg  font-semibold`} onClick={() => setActiveTab(category.id)}>{category.name}</button>
              ))
              }
            </div>
            {/* :::Tab content */}
            <div className="py-8 px-4">
              {navigation.categories
                .filter(category => category.id === activeTab)
                .map(category => (
                  <div key={category.id} className="w-full grid grid-cols-2 gap-5">
                    {category.sections.map(section => (
                      <Link key={section.id} href={section.href}>
                        <a className="col-span-1 group flex flex-col items-start">
                          {/* ::::picture */}
                          <div className="aspect-w-1 aspect-h-1 w-full shadow-sm rounded-md overflow-hidden group-hover:shadow-md">
                            {/* eslint-disable-next-line */}
                            <img src={section.imageSrc} alt={section.imageAlt} className="object-cover" />
                          </div>
                          {/* ::::name */}
                          <h4 className="mt-1.5 text-sm text-gray-600 font-semibold group-hover:text-gray-800">{section.name}</h4>
                          {/* ::::link */}
                          <p className="mt-0.5 text-xs text-gray-400 font-medium">{t('discover')}</p>
                        </a>
                      </Link>
                    ))
                    }
                  </div>
                ))
              }
            </div>
            {/* :::Company infos */}
            <div className="py-5 px-4 flex flex-col space-y-2 border-t-2">
              {navigation.pages.map(page => (
                <a key={page.name} href={page.href} className="py-1 px-4 rounded-md text-base text-gray-700 font-semibold tracking-wide hover:bg-gray-800 hover:text-white">{page.name}</a>
              ))
              }
            </div>
            {/* :::Sign In / Sign Up */}
            <div className="py-5 px-4 flex flex-col space-y-2 border-t-2">
              <a href="#link" className="py-1 px-4 inline-flex items-center rounded-md text-base text-gray-700 font-semibold tracking-wide hover:bg-gray-800 hover:text-white">
                <LoginIcon className="mr-2 w-5 h-5" />
                Sign In
              </a>
              <a href="#link" className="py-1 px-4 inline-flex items-center rounded-md text-base text-gray-700 font-semibold tracking-wide hover:bg-gray-800 hover:text-white">
                <KeyIcon className="mr-2 w-5 h-5" />
                Create a account
              </a>
            </div>
            {/* :::Language & Currency */}
            <div className="pt-5 px-4 pb-10 flex flex-col space-y-4 border-t-2">
              {/* ::::currency */}
              <div className="flex flex-col">
                <label htmlFor="currency" className="mb-2 text-sm text-gray-700 font-semibold">Select your currency</label>
                <select name="currency" id="currency" className="form-select bg-gray-100 rounded-md border-none text-sm font-medium text-gray-800 outline-none cursor-pointer focus:ring-1 focus:ring-gray-800">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CAD">CAD</option>
                </select>
              </div>
              {/* ::::language */}
              <div className="flex flex-col">
                <label htmlFor="language" className="mb-2 text-sm text-gray-700 font-semibold">Select your language</label>
                <select name="language" id="language" className="form-select bg-gray-100 rounded-md border-none text-sm font-medium text-gray-800 outline-none cursor-pointer focus:ring-1 focus:ring-gray-800">
                  <option value="English">English</option>
                  <option value="Français">Français</option>
                  <option value="Español">Español</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>


      {/* :STORE NAVIGATION */}
      <header id="menu" className="relative inset-0 pb-0.5 transition-all duration-500 ease-in-out">
        
        {/* ::Top Header */}
        <div className="relative inset-0 z-20 pt-0.5 pb-2 px-4 bg-gray-800 text-white">
          <div className="mx-auto max-w-7xl flex justify-between items-center space-x-4">
            {/* :::language & dex */}
            <div className="flex items-center sm:space-x-8">
              {/* ::::language */}
              <span className="hidden sm:inline-flex items-center">
                <label htmlFor="language" className="sr-only">Select your language</label>
                <select
                  name="language" id="language"
                  defaultValue={router.locale}
                  onChange={(e) => changeLang(e)}
                  className="form-select py-0.5 bg-transparent border-none text-sm font-medium text-gray-200 outline-none cursor-pointer focus:ring-0"
                >
                  <option value="en" className="text-gray-700">EN</option>
                  <option value="fr" className="text-gray-700">FR</option>
                  <option value="jp" className="text-gray-700">JP</option>
                </select>
              </span>
              {/* ::::dex */}
              <Link href="/dex" className="p-1 shadow-sm rounded bg-gray-500 text-sm text-white font-semibold hover:bg-gray-700">
                <a>Dex</a>
              </Link>
            </div>
            {/* ::::search nft */}
            <div className="relative mx-auto w-full max-w-3xl hidden sm:block">
              <label htmlFor="search" className="sr-only">Search</label>
              <input type="text" id="search" name="search"
                placeholder={t('search')}
                className="form-input py-1 px-5 w-full block shadow-sm rounded-full border-none bg-white bg-opacity-20 text-sm placeholder-transparent sm:placeholder-gray-300 focus:border-transparent focus:ring-0 focus:outline-none focus:bg-opacity-80 focus:text-black"
              />
              <SearchIcon className="absolute top-1 right-3 w-5 h-5 text-teal-500" />
            </div>
            {/* :::site settings */}
            <div className="inline-flex items-center space-x-4">
              {/* ::::uniswap */}
              <button className="text-sm text-gray-200 font-medium hover:underline">uniswap</button>
              {/* ::::chain */}
              <Chains />
            </div>
          </div>
        </div>

        {/* ::Main Menu */}
        <div className="relative bg-white">
          <div className="mx-auto py-3 px-4 max-w-7xl flex justify-between items-center border-b-2 border-gray-100">
            {/* :::Site logo & Burger icon */}
            <div className="flex items-center">
              {/* ::::burger button (small device) */}
              <button className="md:hidden mr-4 text-gray-700 hover:text-gray-800" aria-label="open navigation menu" onClick={() => setIsMenuOpen(true)}>
                <MenuIcon className="w-8 h-8" />
              </button>
              {/* ::::logo  */}
              <Link href="/" className="flex flex-shrink-0 title-font font-medium items-center text-gray-900 md:mb-0">
                <a>
                  <Image
                    src={logo}
                    alt="Tree Logo"
                    width={32}
                    height={32}
                  />
                </a>
              </Link>
            </div>
            {/* :::Navigation */}
            <nav aria-label="navigation menu" className="mx-4">
              <Popover.Group className="hidden md:block">
                <ul className="flex items-center space-x-5 lg:space-x-10 text-base text-gray-700 font-medium">
                  {/* :::Explore menu */}
                    {navigation.categories.map(category => (
                      <li key={category.id}>
                        <Popover>
                          {({ open }) => (
                            <>
                              <Popover.Button className={`group inline-flex items-baseline text-sm uppercase font-semibold ${open ? "text-gray-800" : "group-hover:text-gray-800"}`}>
                                {t(category.name)}
                                <svg className={`ml-1.5 w-2.5 h-2.5 ${open ? "text-gray-800" : "text-gray-500 group-hover:text-gray-800"} fill-current`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                              </Popover.Button>
                              {/* :::Flyout menu */}
                              <Popover.Panel className={`absolute top-full left-1/2 py-5 px-5 w-full max-w-5xl flex justify-start shadow-sm rounded-b-md bg-white transform -translate-x-1/2 translate-y-0.5`}>
                                <div className="w-full grid grid-flow-col auto-cols-fr gap-x-10">
                                  {category.sections.map(section => (
                                    <Link key={section.id} href={section.href} className="group flex flex-col items-start">
                                      <a >
                                        {/* ::::picture */}
                                        <div className="aspect-w-1 aspect-h-1 w-full shadow-sm rounded-md overflow-hidden group-hover:shadow-md">
                                          {/* eslint-disable-next-line */}
                                          <img src={section.imageSrc} alt={section.imageAlt} className="object-cover" />
                                        </div>
                                        {/* ::::name */}
                                        <h4 className="mt-3 text-base text-gray-600 font-semibold capitalize group-hover:text-gray-800">{section.name}</h4>
                                        {/* ::::link */}
                                        <p className="mt-1 text-sm text-gray-400 font-medium">{t('discover')}</p>
                                      </a>
                                    </Link>
                                  ))
                                  }
                                </div>
                              </Popover.Panel>
                            </>
                          )}
                        </Popover>
                      </li>
                    ))
                    }
                  {/* :::Regular pages */}
                  {navigation.pages.map(page => (
                    <li key={page.name}>
                      <Link href={page.href}>
                        <a className="text-base capitalize font-semibold hover:text-gray-800 whitespace-nowrap">{t(page.name)}</a>
                      </Link>
                    </li>
                  ))
                  }
                </ul>
              </Popover.Group>
            </nav>
            {/* :::Create & Account */}
            <div className="flex items-center">
              {/* ::::create */}
              <span className="mr-6">
                <Link href="/create" className="text-gray-500 hover:text-gray-800">
                  <a>{t('create')}</a>
                </Link>
              </span>
              {/* ::::user account || sign in */}
              <Account />
            </div>
          </div>
        </div>

      </header>

    </div>
  )
}

export default Header
