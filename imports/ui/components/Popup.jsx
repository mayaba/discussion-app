import React from 'react'

function Popup(props) {
    return (
        <div>
            <div>
                <button onClick={props.closeClicked}>close</button>
                {props.children}
            </div>
        </div>
    )
}

export default Popup
