import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTmarket.sol/NFTmarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
        loadNFTs()
    }, [])
    async function loadNFTs() {
        const web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
        })
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                name: meta.data.name,
                image: meta.data.image,
            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
    return (
        <div className="home-2">
            <div className="products">
                <div className="my-digital">
                    <p>My Digital</p>
                </div>
                <div className="items-my-digital">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="product">
                                <div className='image-product'>
                                    <img src={nft.image} />
                                </div>
                                <div className="p-4">
                                    <p style={{ height: '40px' }} className="text-2xl font-semibold">{nft.name}</p>
                                </div>
                                <div id='black-p' className="p-4 bg-black">
                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}