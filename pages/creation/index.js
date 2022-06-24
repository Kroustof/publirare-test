import { useEffect } from "react"
import { useMoralis } from "react-moralis"
import { useMoralisDapp } from "../../providers/MoralisDappProvider/MoralisDappProvider"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import loader from '../../public/loader.gif'
import LayoutSmall from "../../components/Layout/LayoutSmall"
import CreationOptions from "../../components/Creation/CreationOptions"


export default function Create() {

  const router = useRouter()
  const { isAuthenticated, isAuthUndefined } = useMoralis()
  const { isCreator, creatorInfos, isLoading } = useMoralisDapp()
  console.log(isCreator);

  //! Redirect unauthenticated users to login page
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


  //? ====================== USER IS CERTIFIED AUTHOR OR EDITOR ==================================================================================
  
  if (isAuthenticated && isCreator && !isLoading) {
    return (
      <div className="flex flex-col">
        <h1 className="self-center">Publication page</h1>
        <p className="self-center mt-5">Choose between options (OakEditions or Full Ownership)</p>

        {/* :Creator options */}
        <div className="mt-10">
          <CreationOptions 
            isPremium={creatorInfos.isPremium}
          />
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
    
};


Create.getLayout = function getLayout(page) {
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