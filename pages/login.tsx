import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {
    useClaimNFT,
    useDropUnclaimedSupply,
    useLogin,
    useLogout,
    useNFTs,
    useProgram,
    useUser
} from '@thirdweb-dev/react/solana';
import {useWallet} from "@solana/wallet-adapter-react";
import {NFT} from "@thirdweb-dev/sdk";
import {wallet} from "./_app";
import Image from "next/image";
import Link from "next/link";

const LoginPage = ({}) => {
    const [userNft, setUserNft] = useState<NFT | undefined>();
    const login = useLogin();
    const logout = useLogout();
    const router = useRouter();
    const { user } = useUser();
    const { publicKey, connect, select} = useWallet();

    const { program } = useProgram(process.env.NEXT_PUBLIC_PROGRAM_ADDRESS, "nft-drop");

    const { data: unclaimedSupply } = useDropUnclaimedSupply(program);
    const { data: nfts, isLoading } = useNFTs(program);
    const { mutateAsync: claim } = useClaimNFT(program);

    useEffect(() => {
        if(!publicKey) {
            select(wallet.name);
            connect();
        }
    }, [publicKey, wallet]);

    useEffect(() => {
        if(!user || !nfts) return;

        const userNfts = nfts.filter((nft) => nft.owner === user?.address);

        if(userNfts) {
            // @ts-ignore
            setUserNft(userNfts);
        }
    }, [nfts, user]);

    const handleLogin = async () => {
        await login();
        router.replace("/");
    }

    const handlePurchase = async () => {
        await claim({
            amount: 1
        });
        router.replace("/");
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#F5AB0B]">
            <div className="absolute top-56 left-0 w-full h-1/2 bg-fuchsia-600 -skew-y-6 z-10 overflow-hidden shadow-xl"/>
            <Image width={400} height={400} src={"https://yt3.ggpht.com/IQ4OqurVrPmACaf3h5fgTcRInn6QoHz0xN4O5qzhuhY7UKgpDg2A4mGyhWW5vcaGSiVbf_FLdQ=s900-c-k-c0x00ffffff-no-rj"} alt={"rokas"} className="mt-5 z-30 shadow-2xl mb-10 rounded-full" />
                <main className="z-30 text-white">
                    <h1 className="text-4xl font-bold uppercase">
                        Welcome to the <p className="text-fuchsia-600">Cool Place!</p>
                    </h1>

                    {!user && (
                        <div>
                            <button onClick={handleLogin} className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-fushbg-fuchsia-600 animate-pulse rounded-md transition duration-200 mt-5">
                                Login / Connect Wallet
                            </button>
                        </div>
                    )}

                    {user && (
                        <div>
                            <p className="text-lg text-fuchsia-600 font-bold mb-10">
                                Welcome {user.address.slice(0, 5)}...{user.address.slice(-5)}
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200">
                            Hold on, we're just looking for your Boring Membership pass
                        </div>
                    )}

                    {/* @ts-ignore */}
                    {(userNft && (userNft.length > 0)) && (
                        <Link className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200 hover:bg-white hover:text-fuchsia-600 mt-5 uppercase" href={'/'}>
                            ACCESS GRANTED - ENTER
                        </Link>
                    )}

                    {!userNft && !isLoading && (unclaimedSupply && unclaimedSupply > 0) ? (
                        <button
                            onClick={handlePurchase}
                            className="text-2xl font-bold mb-5 bg-fuchsia-600 text-white py-4 px-10 border-2 border-fusbg-fuchsia-600 animate-pulse rounded-md transition duration-200 hover:bg-white hover:text-fuchsia-600 mt-5 uppercase"
                        >
                            Purchase Membership
                        </button>
                    ) : (
                        <p className="text-2xl font-bold mb-5 bg-red-500 text-white py-4 px-10 border-2 border-red-500 rounded-md uppercase transition duration-200">
                            Sorry, we're all out of Boring Membership passes!
                        </p>
                    )}

                    {user && (
                        <button
                            onClick={logout}
                            className="bg-white mb-5 text-fuchsia-600 py-4 px-10 border-2 border-fuchsia-600 rounded-md hover:bg-fuchsia-600 hover:text-white mt-10 uppercase font-bold transition duration-200"
                        >
                            Logout
                        </button>
                    )}



                </main>
        </div>
    );
};

export default LoginPage;
// by Rokas with ❤️
