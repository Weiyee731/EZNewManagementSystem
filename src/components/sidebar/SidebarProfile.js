import React from 'react';
import YourWayLogo from "../../assets/logos/logo.png"

export default function Profile(props) {
    return (
        <div
            style={{
                padding: '24px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: 13,
                letterSpacing: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}
        >
            <div style={{ width: '100px', height: '100px', margin: 'auto', marginBottom: '30px' }}>
                <img style={{borderRadius: ' 10%'}} src={YourWayLogo} alt="Yawei Logistics" width="100%" height="70%" />
            </div>
            EZ TRANSIT AND LOGISTICS
        </div>
    )
}