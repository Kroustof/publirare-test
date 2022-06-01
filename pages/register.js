import { useEffect, useRef, useState } from "react"
import { useMoralis, useNewMoralisObject } from "react-moralis"
import { Moralis } from 'moralis'
import Layout from "../components/Layout/Layout"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider"
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import loader from '../public/loader.gif'
import { Switch } from '@headlessui/react'


export default function Register() {
  
  const router = useRouter()
  const { isAuthenticated, isAuthUndefined, user, account } = useMoralis()
  const { isCreator, isLoading } = useMoralisDapp()
  const { save, isSaving } = useNewMoralisObject("Creator")
  
  const firstnameRef = useRef()
  const lastnameRef = useRef()
  const emailRef = useRef()
  const editorNameRef = useRef()
  const [isEditor, setIsEditor] = useState(false)
  
  const handleRegister = async (e) => {
    e.preventDefault()
    const Creator = await Moralis.Object.extend("Creator")
    const query = new Moralis.Query(Creator)
    const dataCount = await query.equalTo("parentUser", user).count()
    // console.log(dataCount);
    // console.log(isCreator);
    if (dataCount > 0 || isCreator) {
      return alert("already registered")
    }

    if (isEditor && editorNameRef.current.value === "") {
      return alert("Please enter editor name")
    }

    const registerInfo = {
      parentUser: user,
      status: "pending",
      mainAccount: account,
      accounts: isEditor ? [account] : [],
      firstName: firstnameRef.current.value,
      lastName: lastnameRef.current.value,
      isEditor: isEditor,
      editorName: isEditor ? editorNameRef.current.value : "self-edition",
      email: emailRef.current.value,
      isPremium: false,
      isWhitelistedStore: false,
      isWhitelistedFactory: false,
    }

    save(registerInfo, {
      onSuccess: async (creator) => {
        console.log(creator.id);
        alert("New creator added with objectId: " + creator.id)
        user.set("childCreator", creator)
        user.set("username", `${firstnameRef.current.value} ${lastnameRef.current.value}`)
        user.set("email", emailRef.current.value)
        await user.save()
        firstnameRef = ""
        lastnameRef = ""
        emailRef = ""
        editorNameRef = ""
        setIsEditor(false)
        router.push('/')
      },
      onError: (error) => {
        console.log(error.message);
        alert("Failed to create new object, with error code: " + error.message)
      }
    })
  }

  //! REDIRECT UNAUTHENTICATED USERS TO LOGIN PAGE
  useEffect(() => {
    if (!isAuthenticated && !isAuthUndefined) {
      router.push("/")
    }
  })
  
  //? ====================== USER AUTHENTICATED AND USER ADDRESS NOT REGISTERED YET =========================================================
  if (isAuthenticated && isCreator === false && !isLoading) {
    return (
      <div className="relative mx-auto w-full max-w-7xl flex flex-col items-center">
        
        <h1 className="text-center text-4xl text-gray-700 font-semibold">Register</h1>

        <form 
          onSubmit={(e) => handleRegister(e)}
          className="mt-10 w-full max-w-3xl grid grid-cols-2 gap-10"
        >
          {/* ::First name */}
          <span className="col-span-1 inline-block">
            <label htmlFor="firstname" className="text-sm text-gray-700 font-medium">First name</label>
            <input 
              type="text" id="firstname" name="firstname"
              ref={firstnameRef}
              placeholder="Enter your firstname"
              className="form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </span>
          {/* ::Last name */}
          <span className="col-span-1 inline-block">
            <label htmlFor="lastname" className="text-sm text-gray-700 font-medium">Last name</label>
            <input 
              type="text" id="lastname" name="lastname"
              ref={lastnameRef}
              placeholder="Enter your last name"
              className="form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </span>
          {/* ::Is Editor */}
          <span className="col-span-full flex items-center">
            <label htmlFor="" className="mr-4">Are you an editor?</label>
            <Switch
              checked={isEditor}
              onChange={setIsEditor}
              className={`${isEditor ? 'bg-green-600' : 'bg-gray-400'}
                relative inline-flex h-[30px] w-[71px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span className="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                className={`${isEditor ? 'translate-x-10' : 'translate-x-0'}
                  pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
              />
            </Switch>
          </span>
          {/* ::Editor name */}
          <span className="col-span-1 inline-block">
            <label htmlFor="editorName" className="text-sm text-gray-700 font-medium">Editor name</label>
            <input 
              type="text" id="editorName" name="editorName"
              disabled={!isEditor}
              ref={editorNameRef}
              placeholder="Enter your editor name"
              className={`form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 ${isEditor ? "" : "cursor-not-allowed"}`}
            />
          </span>
          {/* ::Email */}
          <span className="col-span-1 inline-block">
            <label htmlFor="email" className="text-sm text-gray-700 font-medium">Email</label>
            <input 
              type="email" id="email" name="email"
              ref={emailRef}
              placeholder="myaddress@example.com"
              className="form-input mt-1 w-full block shadow-sm rounded border-gray-300 bg-gray-50 text-sm placeholder-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </span>

          {/* ::Submit button */}
          <button 
            disabled={isSaving}
            type="submit"
            className="relative inline-flex justify-center items-center px-3.5 py-2 rounded border border-transparent bg-gray-600 text-center text-sm text-white font-medium hover:bg-gray-700"
          >
            Submit
          </button>
        </form>

      </div>
    )
  }

  //? ====================== IF USER IS ALREADY REGISTERED AS CREATOR =======================================================================
  if (isAuthenticated && isCreator && !isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl flex flex-col items-center text-center">
        <p className="text-red-500">This address is already registered</p>
        <p className="mt-3 max-w-lg text-sm text-gray-500">You can verify your creator status in your profile dashboard. Once your registration confirmed by our team you will be able to create, sell and manage your NFT books and smart contracts.</p>
        <Link href="/">
          <a className="mt-10 text-gray-500 underline hover:text-gray-700">Return to Homepage</a>
        </Link>
      </div>
    )
  }


  //? ====================== LOADING... =======================================================================================================
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


//! ====================== LAYOUT ==============================================================================================================
Register.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}


//! ====================== LOAD TRANSLATIONS ====================================================================================================
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['navigation', 'footer']),
  },
})