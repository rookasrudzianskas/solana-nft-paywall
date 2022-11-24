import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <ThirdwebProvider>
        <Component {...pageProps} />
      </ThirdwebProvider>
  )
}

export default MyApp
