import css from "../styles/some.css"
import scss from "../styles/some.scss"
import less from "../styles/some.less"
import stylus from "../styles/some.styl"

export default function Page() {
  return <main>
    <div className={css.some_css}>css</div>
    <div className={scss.some_scss}>scss</div>    
    <div className={less.some_less}>less</div>
    <div className={stylus.some_stylus}>stylus</div>
  </main>
}
