import css from "../styles/some.css"
import stylus from "../styles/some.styl"
import less from "../styles/some.less"
import scss from "../styles/some.scss"

console.log(
  //@ts-expect-error Property 'dialog' does not exist
  less.NoSuchClass
)

export default function Some() {
  return <main>
    <div className={css.dialog__title}>css</div>
    <div className={stylus.dialog__close}>stylus</div>
    <div className={less.dialog__cancel}>less</div>
    <div className={scss.dialog__submit}>scss</div>
  </main>
}
