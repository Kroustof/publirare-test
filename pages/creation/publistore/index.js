import Layout from "../../../components/Layout/Layout"
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import loader from '../../../public/loader.gif'
import LayoutSmall from "../../../components/Layout/LayoutSmall"


export default function Store() {
  return (
    <div className="">
      Store
    </div>
  )
};


Store.getLayout = function getLayout(page) {
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