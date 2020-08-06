import root_scss from "../styles/just-scss.scss"
import root_css from "../styles/just-css.css"
import module_scss from "../styles/scss.module.scss"
import module_css from "../styles/css.module.css"

function MyApp({ Component, pageProps }) {
  return <div className="check">
    <div className="json">{JSON.stringify({root_scss, root_css, module_scss, module_css})}</div>
    <Component {...pageProps} />
  </div>
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp