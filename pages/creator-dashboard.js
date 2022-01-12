import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
    nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/NFTmarket.sol/NFTmarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function CreatorDashboard() {
    const [nfts, setNfts] = useState([])
    const [sold, setSold] = useState([])
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
        const data = await marketContract.fetchItemsCreated()

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId)
            const meta = await axios.get(tokenUri)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                sold: i.sold,
                image: meta.data.image,
            }
            return item
        }))
        /* create a filtered array of items that have been sold */
        const soldItems = items.filter(i => i.sold)
        setSold(soldItems)
        setNfts(items)
        setLoadingState('loaded')
    }
    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets created</h1>)
    return (
        <div className='home-3'>
            <div className="products">
                <div className="items-create">
                    <p>Items Created</p>
                </div>
                <div className="items-created-product">
                    {
                        nfts.map((nft, i) => (
                            <div key={i} className="product">
                                <div className='image-product'>
                                    <img src={nft.image} />
                                </div>
                                <div className="p-4 bg-black">
                                    <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="dot">
                    <p>. . .</p>
                </div>
            </div>
            <div className="products">
                {
                    Boolean(sold.length) && (
                        <div>
                            <div className='items-sold'>
                                <p>Items Sold</p>
                            </div>
                            <div className="items-sold-product">
                                {
                                    sold.map((nft, i) => (
                                        <div key={i} className="product">
                                            <div className='image-product'>
                                                <img src={nft.image} />
                                            </div>
                                            <div id='black-p' className="p-4 bg-black">
                                                <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}