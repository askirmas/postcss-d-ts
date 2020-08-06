// import root_scss from "../styles/just-scss.scss"
// import root_css from "../styles/just-css.css"
import module_scss from "../styles/scss.module.scss"
import module_css from "../styles/css.module.css"

export default function Page() {
return <main className="json">{JSON.stringify({/*root_scss, root_css,*/ module_scss, module_css})}</main>
}

