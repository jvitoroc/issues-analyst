import React from 'react';
import PropTypes from 'prop-types';

function Message(props){
    return(
        <div className="container">
            <div className="message-wrap">
                <h3>{props.value}</h3>
            </div>
        </div>
    );
}

Message.propTypes = {
    value: PropTypes.string.isRequired
};

export default Message;