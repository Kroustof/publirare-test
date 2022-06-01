import '../styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import { MoralisProvider } from 'react-moralis'
import { MoralisDappProvider } from "../providers/MoralisDappProvider/MoralisDappProvider"


function MyApp({ Component, pageProps }) {
  
  const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APP_ID;
  const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
  
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  const isServerInfo = APP_ID && SERVER_URL ? true : false


  if (!APP_ID || !SERVER_URL) {
    throw new Error(
      "Missing Moralis Application ID or Server URL. Make sure to set your .env file.",
    );
  } 
  if (isServerInfo) {
    return (
      <>
        <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
          <MoralisDappProvider>
            {
              getLayout(<Component {...pageProps} />)
            }
          </MoralisDappProvider>
        </MoralisProvider>
      </>
    ) 
  } else {
    return (
      <>
        <p>Site en maintenance... No worry, we will be back soon!</p>
      </>
    ) 
  }
}

export default appWithTranslation(MyApp)

