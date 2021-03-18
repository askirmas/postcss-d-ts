import type {CssIdentifiersMap} from "../styles/button.css"
import classNaming from "react-classnaming"

const {
  button,
  button__icon,
  button__label
} = {} as CssIdentifiersMap

const classes = classNaming()

const Button = () => <>
  <button {...classes({button})}>
    <i {...classes({button__icon})}/>
    <span {...classes({button__label})}>Submit</span>
  </button>
</>

export default Button
