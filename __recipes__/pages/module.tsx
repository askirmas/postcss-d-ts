import module_css from "../styles/is.module.css"
import module_scss from "../styles/is.module.scss"
import module_less from "../styles/is.module.less"
import module_stylus from "../styles/is.module.styl"

export default function Page() {
  return <main>
    <div className={module_css.css_module}>css</div>
    <div className={module_scss.scss_module}>scss</div>
    <div className={module_less.less_module}>less</div>
    <div className={module_stylus.stylus_module}>stylus</div>
  </main>
}
