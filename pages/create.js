import { useEffect } from "react"
import { useMoralis, useMoralisQuery } from "react-moralis"
import Layout from "../components/Layout/Layout"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useOKSDapp } from "../providers/OKSDappProvider/OKSDappProvider"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import loader from '../public/loader.gif'


export default function Create() {

  const router = useRouter()
  const { userId } = useOKSDapp()
  const { isAuthenticated } = useMoralis()
  const { data } = useMoralisQuery(
    "_User",
    (query) => query.equalTo("objectId", userId)
  );
  
  //! Redirect unauthenticated users to login page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])


  //! If user is Authenticated and data "isCreator" fetched
  if (isAuthenticated && data && data.length !== 0) {
    
    const isCreator = data[0].get("isCreator")

    //? User is not author or editor
    if (!isCreator) {
      return (
        <div className="py-16 flex flex-col items-center space-y-5">
          <h2 className="">This account is not registered as Author or Editor. Please register before publishing your NFT Book</h2>
          <Link href="/register">
            <a className="py-2 px-6 border border-gray-700 text-gray-700 hover:text-gray-800">Register as Author/Editor</a>
          </Link>
        </div>
      )
    }

    //? User is certified author or editor
    if (isCreator) {
      return (
        <div className="py-16 flex flex-col items-center space-y-5">
          <h1 className="">Publication page</h1>
          <p className="">Choose between options (OakEditions or Full Ownership)</p>
        </div>
      )
    }
  }
  
  //? Loading...
  return (
    <div className="lg:p-20 flex flex-col justify-center items-center space-y-3">
      <Image 
        src={loader}
        alt="loading spinner"
      />
      <Link href="/register">
        <a className="mt-10 text-gray-500 underline hover:text-gray-700">Return to Homepage</a>
      </Link>
    </div>
  )
};


Create.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['navigation', 'footer']),
  },
})