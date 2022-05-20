import { useMoralis } from "react-moralis"
import Layout from "../components/Layout/Layout"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { connectors } from '../components/Account/config'
import Image from 'next/image'
import loader from '../public/loader.gif'


export default function Login() {

  const { t } = useTranslation('login')
  const { authenticate, isAuthenticated, isAuthUndefined, user } = useMoralis()
  const router = useRouter()

  // console.log(user);

  const login = async (connectorId) => {
    if (!isAuthenticated) {
      await authenticate({ provider: connectorId, chainId: 80001, signingMessage: "Welcome to Page Tree marketplace!" })
        .then((user) => {
          console.log(user.get("ethAddress"));
          router.push('/')
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }

  //! REDIRECT HOME IF ALREADY AUTHENTICATED
  if (isAuthenticated) {
    router.push('/')
  }

  //? ====================== USER AUTHENTICATED ==================================================================
  if (!isAuthenticated && !isAuthUndefined) {
    return (
      <div className="relative mx-auto w-full py-16 px-4 max-w-7xl">
        <div className="flex flex-col justify-center items-center">
  
          <h1 className="text-5xl text-teal-500 font-semibold">{t('h1')}</h1>
          <p className="mt-5 text-base text-gray-500">{t('p')}</p>
  
          <div className="mt-10 flex flex-col space-y-5">
            {connectors.map(({ title, icon, connectorId }, index) => (
              <button 
                key={index}
                type="button"
                className={`relative inline-flex items-center px-10 py-2.5 rounded-full border border-transparent ${index === 0 ? "bg-sky-500 text-white hover:bg-sky-600" : "bg-gray-200 text-gray-500 hover:bg-gray-300"} text-base font-medium`}
                onClick={() => login(connectorId)}
              >
                <span className="mr-8">
                  <Image 
                    src={icon}
                    alt={`${title} wallet icon`}
                    width={30}
                    height={30}
                  />
                </span>
                {`${t('btn-connect')} ${title}`}
              </button>
            ))
            }
          </div>
  
        </div>
      </div>
    )
  }

  //? ====================== LOADING =============================================================================================
  return (
    <div className="lg:p-20 flex justify-center items-center">
      <Image 
        src={loader}
        alt="loading spinner"
      />
    </div>
  )
}


//! ====================== LAYOUT ====================================================================================================
Login.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}


//! ====================== LOAD TRANSLATIONS ====================================================================================================
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...await serverSideTranslations(locale, ['login', 'navigation', 'footer']),
  },
})