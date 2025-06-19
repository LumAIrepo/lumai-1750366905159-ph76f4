import React from "react"
```tsx
'use client'

import { useState, useEffect } from 'react'
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Inter } from 'next/font/google'
import { ChevronRightIcon, WalletIcon, CubeTransparentIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

require('@solana/wallet-adapter-react-ui/styles.css')

const inter = Inter({ subsets: ['latin'] })

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
]

const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)

interface WalletConnectionProps {
  onConnect: (publicKey: PublicKey) => void
}

function WalletConnection({ onConnect }: WalletConnectionProps) {
  const { connection } = useConnection()
  const { publicKey, connected, disconnect } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && publicKey) {
      onConnect(publicKey)
      fetchBalance()
    }
  }, [connected, publicKey, onConnect])

  const fetchBalance = async () => {
    if (!publicKey) return
    
    try {
      setLoading(true)
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / 1e9) // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error)
    } finally {
      setLoading(false)
    }
  }

  if (connected && publicKey) {
    return (
      <div className="bg-purple-100 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-purple-900">Wallet Connected</h3>
          <button
            onClick={disconnect}
            className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
          >
            Disconnect
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-purple-700">
            <span className="font-medium">Address:</span> {publicKey.toString().slice(0, 8)}...{publicKey.toString().slice(-8)}
          </p>
          <p className="text-sm text-purple-700">
            <span className="font-medium">Balance:</span> {loading ? 'Loading...' : `${balance?.toFixed(4) || '0'} SOL`}
          </p>
        </div>
        <button
          onClick={fetchBalance}
          disabled={loading}
          className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Balance'}
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !rounded-lg" />
    </div>
  )
}

function MainContent() {
  const [connectedWallet, setConnectedWallet] = useState<PublicKey | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleWalletConnect = (publicKey: PublicKey) => {
    setConnectedWallet(publicKey)
  }

  const features = [
    {
      icon: WalletIcon,
      title: 'Wallet Integration',
      description: 'Connect your Solana wallet seamlessly with support for multiple wallet providers.'
    },
    {
      icon: CubeTransparentIcon,
      title: 'Blockchain Interaction',
      description: 'Interact with Solana programs and smart contracts with ease.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Fast',
      description: 'Built on Solana\'s high-performance blockchain for secure and fast transactions.'
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 ${inter.className}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="ml-3 text-2xl font-bold text-purple-900">HelloSolana</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-purple-700 hover:text-purple-900 transition-colors">Features</a>
              <a href="#about" className="text-purple-700 hover:text-purple-900 transition-colors">About</a>
              <a href="#contact" className="text-purple-700 hover:text-purple-900 transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6">
            Welcome to the
            <span className="text-purple-600 block">Solana Ecosystem</span>
          </h2>
          <p className="text-xl text-purple-700 mb-8 max-w-2xl mx-auto">
            Experience the power of Solana blockchain with our modern, fast, and secure platform. 
            Connect your wallet and start exploring decentralized applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center">
              Get Started
              <ChevronRightIcon className="ml-2 w-5 h-5" />
            </button>
            <button className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Wallet Connection Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-purple-900 mb-4">Connect Your Wallet</h3>
            <p className="text-purple-700">
              Connect your Solana wallet to start interacting with the blockchain
            </p>
          </div>
          <WalletConnection onConnect={handleWalletConnect} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-purple-900 mb-4">Why Choose HelloSolana?</h3>
            <p className="text-xl text-purple-700 max-w-2xl mx-auto">
              Built with modern technologies and best practices for the Solana ecosystem
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-8 shadow-lg border border-purple-200 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-purple-900 mb-4">{feature.title}</h4>
                <p className="text-purple-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">400ms</div>
              <div className="text-purple-700">Block Time</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">65k</div>
              <div className="text-purple-700">TPS Capacity</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">$0.00025</div>
              <div className="text-purple-700">Avg Transaction Cost</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h3>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building the future of decentralized applications on Solana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
              Start Building
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <span className="ml-3 text-xl font-bold">HelloSolana</span>
              </div>
              <p className="text-purple-300">
                Building the future of decentralized applications on Solana
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-purple-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-purple-300">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-purple-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-800 mt-8 pt-8 text-center text-purple-300">
            <p>&copy; 2024 HelloSolana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function Page() {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <MainContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
```