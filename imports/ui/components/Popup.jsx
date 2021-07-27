import React from 'react'

function Popup(props) {
    return (
        <div>
            <div>
                <button>close</button>
                {props.children}
            </div>
        </div>
    )
}

export default Popup
