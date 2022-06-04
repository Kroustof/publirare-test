import LayoutNFTCreate from "../../../../components/Layout/LayoutNFTCreate"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import Image from 'next/image'
import loader from '../../../../public/loader.gif'
import { useMoralis } from "react-moralis"
import { useRouter } from 'next/router'
import { useMoralisDapp } from "../../../../providers/MoralisDappProvider/MoralisDappProvider"
import { useEffect, useRef, useState } from "react"
import CreateNFTBook from "../../../../components/Creation/NFTBook/CreateNFTBook"
import PreviewImage from "../../../../components/Creation/NFTBook/PreviewImage"
import DetailsCollection from "../../../../components/Creation/NFTBook/DetailsCollection"
import DetailsNFTBook from "../../../../components/Creation/NFTBook/DetailsNFTBook"
import { ArrowNarrowRightIcon } from "@heroicons/react/outline"


export default function Create() {

  const router = useRouter()
  const { format, extension, size } = router.query
  const { isAuthenticated, isAuthUndefined } = useMoralis()
  const { isCreator, creatorInfos, isLoading } = useMoralisDapp()

  // customization
  const [images, setImages] = useState({
    collectionImage: null,
    previewImage: null,
    cover: null,
    background: null,
    pages: []
  })
  const canvasBgRef = useRef("")
  const insideCoverRef = useRef("")
  const insideBackRef = useRef("")
  const pagesColorRef = useRef("")
  // collection infos [contract URI] //! Create metadata contract
  const collectionNameRef = useRef("") //! Name ref change be careful to update functions (name) + pinata
  const collectionDescRef = useRef("") //! New ref (description)
  const collectionLinkRef = useRef("") //! New ref (external_link)
  let openseaGlobalRoyaltyInBips //! REDONDANT Value provide later (seller_fee_basis_points)
  let openseaGlobalRoyaltyBeneficiary //! REDONDANT Value provide later (fee_recipient)
  // book infos
  const formatRef = useRef("") //! ALREADY PROVIDED IN QUERY URL FORMAT
  const titleRef = useRef("") //! metadata + pinata (name)
  const authorNameRef = useRef("") //! pinata
  const editorNameRef = useRef("") //! pinata
  const tomeRef = useRef("")
  // metadata book
  const descriptionRef = useRef("")
  const externalUrlRef = useRef("") //! Web 3 Book URL
  const languageRef = useRef("") //! attributes
  const category1Ref = useRef("") //! attributes
  const category2Ref = useRef("") //! attributes
  const specialEditionRef = useRef("") //! attributes
  const [publishingRights, setpublishingRights] = useState(null) //! attributes
  



  //? ====================== USER NOT AUTHENTICATED ==================================================================================

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
      <div className="pb-32 mx-auto w-full max-w-7xl flex flex-col">

        <div className="self-center text-center uppercase">
          <span className="block sm:text-lg text-gray-500 font-bold uppercase">{format}</span>
          <h1 className="block text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-extrabold">New Contract & Book</h1>
          <span className="inline-block w-40 h-0.5 bg-teal-500 opacity-30" />
        </div>

        <div className="relative mt-16 ">
          <h2 className="py-5 text-xl text-teal-500 font-semibold">Create Your NFT Book</h2>
          <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 1</span>
          <CreateNFTBook
            images={images}
            setImages={setImages}
            format={format}
            extension={extension}
            size={size}
            canvasBgRef={canvasBgRef}
            insideCoverRef={insideCoverRef}
            insideBackRef={insideBackRef}
            pagesColorRef={pagesColorRef}
          />
        </div>

        <div className="relative mt-16 border-t-2 border-dotted border-teal-500 border-opacity-20">
          <h2 className="py-5 text-xl text-teal-500 font-semibold">Upload Preview Image</h2>
          <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 2</span>
          <PreviewImage
            images={images}
            setImages={setImages}
          />
        </div>

        <div className="relative mt-16 border-t-2 border-dotted border-teal-500 border-opacity-20">
          <h2 className="py-5 text-xl text-teal-500 font-semibold">Collection & NFT Book details</h2>
          <span className="absolute inset-0 text-7xl text-teal-500 font-black uppercase opacity-10">Step 3</span>
          <div className="py-5 flex flex-col">
            <h3 className="inline-flex items-center text-base text-teal-500 font-extrabold uppercase underline">
              <ArrowNarrowRightIcon className="mr-3 w-7" />
              About Collection
            </h3>
            <DetailsCollection
              collectionNameRef={collectionNameRef}
              collectionDescRef={collectionDescRef}
              collectionLinkRef={collectionLinkRef}
              images={images}
              setImages={setImages}
            />
          </div>
          <div className="py-5 flex flex-col">
          <h3 className="inline-flex items-center text-base text-teal-500 font-extrabold uppercase underline">
              <ArrowNarrowRightIcon className="mr-3 w-7" />
              About your book
            </h3>
            <DetailsNFTBook
              formatRef={formatRef}
              titleRef={titleRef}
              authorNameRef={authorNameRef}
              editorNameRef={editorNameRef}
              tomeRef={tomeRef}
              descriptionRef={descriptionRef}
              externalUrlRef={externalUrlRef}
              languageRef={languageRef}
              category1Ref={category1Ref}
              category2Ref={category2Ref}
              specialEditionRef={specialEditionRef}
              setpublishingRights={setpublishingRights}
            />
          </div>
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