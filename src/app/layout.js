import './globals.css';
export const viewport={themeColor:'#F8F5EE'};import {StoreProvider} from '../components/Store';import {Header,Footer} from '../components/Site';import ShoppingAssistant from '../components/ShoppingAssistant';
export const metadata={icons:{icon:'/vedika-favicon.png',apple:'/vedika-favicon.png'},title:{default:'Vedika Furniture | Beautifully Considered Living',template:'%s | Vedika Furniture'},description:'Discover thoughtfully curated furniture inspiration for living, dining and bedroom spaces from Vedika Furniture, Betul, Madhya Pradesh.'};
export default function RootLayout({children}){return <html lang="en"><body><StoreProvider><Header/><main>{children}</main><Footer/><ShoppingAssistant/></StoreProvider></body></html>}
