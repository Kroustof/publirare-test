import Footer from "./footer/Footer";
import HeaderSm from "./header/HeaderSm";


 const LayoutSmall = ({ children }) => {
   return (
    <>
      <HeaderSm />
      <main className="py-4 px-2 mx-auto w-full min-h-screen overflow-hidden">{children}</main>
      <Footer />
    </>
   )
 }
 
 export default LayoutSmall
 