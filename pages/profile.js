import Link from 'next/link'

import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'
import { useEffect, useState } from 'react'
import { Description } from '@ethersproject/properties'

const endpoint = "https://ceramic-clay.3boxlabs.com"

export default function Profile() {
    const [name, setName] = useState('')
    const [image, setImage] = useState('')
    const [description, setDescription] = useState('')
    const [loaded, setLoaded] = useState(false)

    async function connect() {
        const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
        return addresses
    }



    useEffect(() => {
        async function readProfile() {
            const [address] = await connect()
            const ceramic = new CeramicClient(endpoint)
            const idx = new IDX({ ceramic })

            try {
                const data = await idx.get(
                    'basicProfile',
                    `${address}@eip155:1`
                )
                console.log('data: ', data)
                if (data.name) setName(data.name)
                if (data.avatar) setImage(data.avatar)
                if (data.description) setDescription(data.description)
            } catch (error) {
                console.log('error: ', error)
                setLoaded(true)
            }
        }

        readProfile()
    }, [])





    async function updateProfile() {
        const [address] = await connect()
        const ceramic = new CeramicClient(endpoint)

        const threeIdConnect = new ThreeIdConnect()
        const provider = new EthereumAuthProvider(window.ethereum, address)

        await threeIdConnect.connect(provider)

        const did = new DID({
            provider: threeIdConnect.getDidProvider(),
            resolver: {
                ...ThreeIdResolver.getResolver(ceramic)
            }
        })

        ceramic.setDID(did)
        await ceramic.did.authenticate()

        const idx = new IDX({ ceramic })

        await idx.set('basicProfile', {
            name,
            avatar: image,
            description: description,
        })

        console.log("Profile updated");
    }
    return (
        <div className="home-3">
            <div className="profile-">
                <div className="profile-title">
                    <p>Profile</p>
                </div>
                <div className="profile-table">
                    <div className="set-profile">
                        <div id="input-"><input placeholder='Name' onChange={e => setName(e.target.value)} /></div>
                        <div id="input-"><input placeholder='Profile Image' onChange={e => setImage(e.target.value)} /></div>
                        <div id="input-"><input placeholder='Description' onChange={e => setDescription(e.target.value)} /></div>
                        <div id="button-input"><button onClick={updateProfile} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">Set Profile</button></div>
                    </div>
                    <div className="read-profile">
                        <div className="box-img">{image && <img id="img-profile" src={image} />}</div>
                        <div id="name-profile"><div className="name-2">{name && <h3>{name}</h3>}</div></div>
                        <div id="des-profile">{description && <h3>{description}</h3>}</div>
                        {loaded && image && name && description && (<h4>No profile founded, but you can add one.</h4>)}
                    </div>
                </div>
            </div>
        </div>
    )
}