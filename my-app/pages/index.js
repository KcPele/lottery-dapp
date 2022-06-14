import React from 'react'
import Head from "next/head"
import { Header, LotteryEntry} from '../components'

const index = () => {
  return (
    <div>
      <Head>
      <title>Smart Contract Lottery</title>
      <meta name="description" content='Our Smart Contract Lottery ' />
      <link rel='icon' href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntry />
    </div>
  )
}

export default index