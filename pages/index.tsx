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

    const program = await sdk.getNFTDrop(process.env.NEXT_PUBLIC_PROGRAM_ADDRESS!);
    const nfts = await program.getAllClaimed();
    const nft = nfts.find((nft) => nft.owner === user.address);

    if(!nft) {
        return {
            destination: "/login",
            permanent: false,
        }
    }

    return {
        props: {title: "ROKAS"},
    }
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
