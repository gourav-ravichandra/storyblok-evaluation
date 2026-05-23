import path from 'path'
import {fileURLToPath} from 'url'
import {config as loadEnv} from 'dotenv'
import type {NextConfig} from 'next'

const webDir = path.dirname(fileURLToPath(import.meta.url))

loadEnv({path: path.join(webDir, '.env')})
loadEnv({path: path.join(webDir, '.env.local'), override: true})

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {protocol: 'https', hostname: 'a.storyblok.com'},
      {protocol: 'https', hostname: 'a-eu.storyblok.com'},
      {protocol: 'https', hostname: 'a-us.storyblok.com'},
      {protocol: 'https', hostname: 'www.modulrfinance.com'},
      {protocol: 'https', hostname: 'modulrfinance.com'},
      {protocol: 'https', hostname: 'cdn2.hubspot.net'},
      {protocol: 'https', hostname: '**.hubspot.com'},
      {protocol: 'https', hostname: '**.hubspotusercontent.com'},
      {protocol: 'https', hostname: '**.hubspotusercontent-na1.net'},
      {protocol: 'https', hostname: '**.hubspotusercontent-eu1.net'},
    ],
  },
}

export default nextConfig
