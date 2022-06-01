import { NFTCreationProvider } from "../../providers/NFTCreationProvider/NFTCreationProvider";
import Footer from "./footer/Footer";
import HeaderSm from "./header/HeaderSm";


 const LayoutNFTCreate = ({ children }) => {
   return (
    <>
      <NFTCreationProvider>
        <HeaderSm />
        <main className="py-4 px-2 mx-auto w-full min-h-screen overflow-hidden">{children}</main>
        <Footer />
      </NFTCreationProvider>
    </>
   )
 }
 
 export default LayoutNFTCreate
 