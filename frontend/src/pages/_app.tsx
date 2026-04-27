import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";
import { VenueProvider } from "../context/VenueContext";
import { ApplyProvider } from "../context/ApplyContext";
import { UnavailProvider } from "../context/UnavailContext";
import {NotifProvider} from '../context/NotifContext'
import Footer from '../components/Footer';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <NotifProvider>
      <VenueProvider>
        <UnavailProvider>
          <ApplyProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Component {...pageProps} />
                <div className="mt-auto">
                  <Footer/>
                </div>
              </div>
            </AuthProvider>
          </ApplyProvider>
        </UnavailProvider>
      </VenueProvider>    
    </NotifProvider>
  );
  
}
