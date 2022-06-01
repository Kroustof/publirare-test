import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { useMoralisDapp } from "../../../providers/MoralisDappProvider/MoralisDappProvider"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import loader from '../../../public/loader.gif'
import LayoutNFTCreate from "../../../components/Layout/LayoutNFTCreate"
import FactoryChoices from "../../../components/Creation/Factory/FactoryChoices"


export default function Factory() {

  const { isAuthenticated, isAuthUndefined, user, refetchUserData } = useMoralis()
  const { isCreator, creatorInfos, isLoading } = useMoralisDapp()
  const [error, setError] = useState(null)
  

  //! Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isAuthenticated && !isAuthUndefined) {
      router.push("/login")
    }
  })

  
  //? ====================== USER IS NOT A CREATOR ==================================================================================

  if (isAuthenticated && !isAuthUndefined && !isCreator) {
    return (
      <div className="mx-auto py-32 min-h-full w-full max-w-7xl flex flex-col justify-center items-center text-center">
        <h3 className="text-4xl text-gray-700 font-bold">Not Registered Yet</h3>
        <p className="mt-3 max-w-xl text-base text-gray-500">Sorry, it seems you are not yet registered as Author or Editor. It is also possible that your registration status is still pending.</p>
        <div className="mt-12 flex space-x-8">
          <Link href="/register" >
            <a className="relative w-44 inline-flex justify-center items-center px-3.5 py-2 rounded border border-transparent bg-teal-500 text-sm text-white font-medium hover:bg-teal-600">Register</a>
          </Link>
          <Link href="/account" >
            <a className="relative w-44 inline-flex justify-center items-center px-3.5 py-2 rounded border-2 border-teal-500 bg-transparent text-sm text-teal-500 font-medium hover:border-teal-600 hover:text-teal-600">Check status</a>
          </Link>
        </div>
      </div>
    )
  }

  //? ====================== USER IS A CREATOR BUT NOT PREMIUM ==================================================================================

  if (isAuthenticated && !isAuthUndefined && isCreator && !creatorInfos.isPremium) {
    return (
      <div className="mx-auto py-32 min-h-full w-full max-w-7xl flex flex-col justify-center items-center text-center">
        <h3 className="text-4xl text-gray-700 font-bold">This account is not Premium</h3>
        <p className="mt-3 max-w-xl text-base text-gray-500">Sorry, it seems your author/editor account is not premium. If it is not the case please contact our support.</p>
        <div className="mt-12 flex space-x-8">
          <Link href="/contact" >
            <a className="relative w-44 inline-flex justify-center items-center px-3.5 py-2 rounded border border-transparent bg-gray-500 text-sm text-white font-medium hover:bg-gray-600">Contact support</a>
          </Link>
          <Link href="/account" >
            <a className="relative w-44 inline-flex justify-center items-center px-3.5 py-2 rounded border-2 border-gray-500 bg-transparent text-sm text-gray-500 font-medium hover:border-gray-600 hover:text-gray-600">Check status</a>
          </Link>
        </div>
      </div>
    )
  }

  //? ====================== USER IS A CREATOR AND PREMIUM - PROCESS CREATION ==================================================================================

  if (isAuthenticated && !isAuthUndefined && isCreator && creatorInfos.isPremium) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <FactoryChoices 
          user={user}
          creatorInfos={creatorInfos}
          loaderImg={loader}
        />
      </div>
    )
  }

  //? ====================== LOADING... ==================================================================================
  
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


Factory.getLayout = function getLayout(page) {
  return (
    <LayoutNFTCreate>
      {page}
    </LayoutNFTCreate>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['navigation', 'footer']),
  },
})