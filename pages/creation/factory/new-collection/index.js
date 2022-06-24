import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LayoutSmall from "../../../../components/Layout/LayoutSmall"
import Link from 'next/link'
import Image from 'next/image'
import loader from '../../../../public/loader.gif'
import { useRouter } from 'next/router'
import { useMoralisDapp } from "../../../../providers/MoralisDappProvider/MoralisDappProvider"
import FormatChoices from "../../../../components/Creation/Factory/FormatChoices"
import { bookTypes } from "../../../../helpers/bookTypes"


export default function NewCollection() {

  const router = useRouter()
  const { isAuthenticated, isAuthUndefined } = useMoralis()
  const { isCreator, creatorInfos, isLoading } = useMoralisDapp()
  const [selectedFormat, setSelectedFormat] = useState("roman")
  const [selectedExtension, setSelectedExtension] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  const changeTab = (format) => {
    setSelectedFormat(format)
    setSelectedExtension(null)
    setSelectedSize(null)
  }

  const validation = () => {
    if (!selectedExtension || !selectedSize) return
    const format = selectedFormat
    const extension = selectedExtension
    const size = selectedSize
    router.push(`/creation/factory/new-collection/create?format=${format}&extension=${extension}&size=${size}`)
  }




  //? ====================== REDIRECT UNAUTHENTICATED USERS TO LOGIN PAGE ==================================================================

  useEffect(() => {
    if (!isAuthenticated && !isAuthUndefined) {
      router.push("/login")
    }
  })


  //? ====================== USER IS NOT AUTHOR OR EDITOR ==================================================================================

  if (isAuthenticated && isCreator === false && !isLoading) {
    return (
      <div className="py-16 flex flex-col items-center space-y-5">
        <h2 className="">This account is not registered as Author or Editor. Please register before publishing your NFT Book</h2>
        <Link href="/register">
          <a className="py-2 px-6 border border-gray-700 text-gray-700 hover:text-gray-800">Register as Author/Editor</a>
        </Link>
      </div>
    )
  }


  //? ====================== USER IS A CREATOR BUT NOT PREMIUM ==================================================================================

  if (isAuthenticated && !isAuthUndefined && isCreator && !creatorInfos.isPremium && !isLoading) {
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


  //? ====================== USER IS CERTIFIED AUTHOR OR EDITOR ==================================================================================
  
  if (isAuthenticated && isCreator && creatorInfos.isPremium && !isLoading) {
    return (
      <div className="pb-32 flex flex-col">
        <h2 className="self-center text-center text-xl text-gray-700 font-extrabold uppercase">Choose your NFT Book format</h2>
        <FormatChoices 
          bookTypes={bookTypes}
          selectedFormat={selectedFormat}
          setSelectedFormat={setSelectedFormat}
          selectedExtension={selectedExtension}
          setSelectedExtension={setSelectedExtension}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
          changeTab={changeTab}
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={validation}
            disabled={!selectedFormat || selectedExtension === null || selectedSize === null}
            className="relative mt-16 inline-flex items-center px-5 py-2.5 rounded border border-transparent bg-teal-500 text-lg text-white font-bold hover:bg-teal-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Create NFT Book
          </button>
        </div>
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
}


NewCollection.getLayout = function getLayout(page) {
  return (
    <LayoutSmall>
      {page}
    </LayoutSmall>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['navigation', 'footer']),
  },
})