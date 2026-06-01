import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {AuthProvider} from '../context/AuthContext'
import {NotifProvider} from '../context/NotifContext'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <NotifProvider>
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <title>VV Admin</title>
                  <Component {...pageProps} />
                  <div className="mt-auto">
                    <Footer/>
                  </div>
            </div>
        </AuthProvider>
      </NotifProvider>
    </div>
  )
  
}
