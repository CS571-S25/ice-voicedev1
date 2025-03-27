
const Message = (props) => {
    return <div
            className={props.type + "-message"}
            style={{width: "fit-content", maxWidth: "80%", display: "inline-block"}}
        >
        <p>{props.text}</p>
    </div>
}

export default Message;