import Footer from "./footer/Footer";
import Header from "./header/Header";


 const Layout = ({ children }) => {
   return (
    <>
      <Header />
      <main className="py-4 px-2 mx-auto w-full max-w-7xl min-h-screen overflow-hidden">{children}</main>
      <Footer />
    </>
   )
 }
 
 export default Layout
 