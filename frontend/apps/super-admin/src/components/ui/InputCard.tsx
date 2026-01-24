
const InputCard = ({ label, type, id }: { label: string, type: string, id: string }) => {
    return (
        <div className="container">
            <input type={type} id={id} className="form-input" placeholder=" " />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}
export default InputCard
