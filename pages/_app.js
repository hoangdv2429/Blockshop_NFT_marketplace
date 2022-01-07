// import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import Link from 'next/link'

import CeramicClient from '@ceramicnetwork/http-client'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'

import { EthereumAuthProvider, ThreeIdConnect } from '@3id/connect'
import { DID } from 'dids'
import { IDX } from '@ceramicstudio/idx'
import { useState } from 'react'
import { Description } from '@ethersproject/properties'

const endpoint = "https://ceramic-clay.3boxlabs.com"

function MyApp({ Component, pageProps }) {
  const [name, setName] = useState(' ')
  const [image, setImage] = useState(' ')
  const [description, setDescription] = useState(' ')
  const [loaded, setLoaded] = useState(false)

  async function connect() {
    const addresses = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return addresses
  }

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
    } catch (error) {
      console.log('error: ', error)
      setLoaded(true)
    }
  }

  async function updateProfile() {
    const [address] = await connect()
    const ceramic = new CeramicClient(endpoint)

    const threeIdConnect = new ThreeIdConnect()
    const provider = new EthereumAuthProvider(window.ethereum, address)

    await threeIdConnect.connect(provider)

    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: {
        ...ThreeIdConnect.getResolver(ceramic)
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
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFT Blockshop</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Sell Digital Asset
            </a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My Digital Assets
            </a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-pink-500">
              Creator Dashboard
            </a>
          </Link>
        </div>
        <div>
          <input placeholder='Name' onChange={e => setName(e.target.value)} />
          <input placeholder='Profile Image' onChange={e => setImage(e.target.value)} />
          <button onClick={readProfile}>Read Profile</button>

          <button onClick={updateProfile}>Set Profile</button>

          {name && <h3>{name}</h3>}
          {image && <img style={{ width: '400px' }} src={image} />}
          {(!image && !name && loaded) && <h4>No profile founded, but you can add one.</h4>}
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp