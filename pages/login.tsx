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

const LoginPage = ({}) => {
    const [userNft, setUserNft] = useState<NFT | undefined>();
    const login = useLogin();
    const logout = useLogout();
    const route = useRouter();
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

        const userNfts = nfts.filter(nft => nft.owner === user?.address);

        if(userNfts) {
            // @ts-ignore
            setUserNft(userNfts);
        }
    }, [nfts, user]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center text-center bg-[#F5AB0B]">
            <div className="absolute top-56 left-0 w-full h-1/2 bg-fuchsia-600 -skew-y-6 z-10 overflow-hidden shadow-xl">

            </div>
        </div>
    );
};

export default LoginPage;
// by Rokas with ❤️
