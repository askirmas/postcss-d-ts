import css from "../styles/some.css"
import scss from "../styles/some.scss"
import less from "../styles/some.less"
import stylus from "../styles/some.styl"

export default function Page() {
  return <main>
    <div className={css.dialog__title}>css</div>
    <div className={scss.dialog__submit}>scss</div>    
    <div className={less.dialog__cancel}>less</div>
    <div className={stylus.dialog__close}>stylus</div>
  </main>
}
