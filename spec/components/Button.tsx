import m1 from "../styles/scss.module.scss"
//@ts-ignore
import m2, {class1} from "../styles/css.module.css"

console.log(class1, Object.keys(m1), Object.keys(m2))

export default function Button() {
  return <button className={
    [m1.class1, m2.class1, "class1"].join(' ')
  }>button</button>
}