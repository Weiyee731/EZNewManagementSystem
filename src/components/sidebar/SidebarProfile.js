import React from 'react';
import EZLogo from "../../assets/logos/android-chrome-512x512.png"

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
                <img style={{borderRadius: ' 50%'}} src={EZLogo} alt="EZ Logistics" width="100%" height="100%" />
            </div>
            EZ TRANSIT AND LOGISTICS
        </div>
    )
}