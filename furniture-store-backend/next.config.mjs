import { withPayload } from '@payloadcms/next/withPayload'
import path from 'path'

const nextConfig = {
  productionBrowserSourceMaps: false,

  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve('./src')
    config.resolve.alias['@payload-config'] = path.resolve('./src/payload.config.ts')

    config.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return config
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
