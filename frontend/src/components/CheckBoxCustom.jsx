import './CheckBoxCustom.css'

function CheckBoxCustom({label, value, name, id, onChange}){
    return (
        <label className="checkbox">
            <input type="checkbox" name={name}
            value={label} id={id} className="visually-hidden" onChange={onChange}/>
            <span className="checkbox__custom"></span>
            <span className="checkbox__label">{label}</span>
        </label>
    )
}

export default CheckBoxCustom