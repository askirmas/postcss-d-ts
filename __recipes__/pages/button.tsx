import css from "../styles/button.css"

const Button = () => <>
  <button className={
    css.button
  }>
    <i className={
      css.button__icon
    }/>
    <span className={
      css.button__label
    }>Submit</span>
  </button>
</>

export default Button
