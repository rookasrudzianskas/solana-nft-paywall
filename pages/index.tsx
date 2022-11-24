import { ThirdwebSDK } from '@thirdweb-dev/sdk/solana';
import type {GetServerSideProps, NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import {network} from "./_app";
import {getUser} from "../auth.config";

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    const sdk = ThirdwebSDK.fromNetwork(network);
    const user = await getUser(req);

    if(!user) {
        return {
            destination: "/login",
            permanent: false,
        }
    };


}

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>NFT solana paywall</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

    </div>
  )
}

export default Home;
