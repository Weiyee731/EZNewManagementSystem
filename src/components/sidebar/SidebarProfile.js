import React from 'react';
import EZLogo from "../../assets/logos/logo.png"

export default function Profile(props) {
    return (
        <div
            style={{
                padding: '24px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                fontSize: 15,
                letterSpacing: '1px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'center'
            }}
        >
            <div style={{ textAlign: "center", padding:"10pt" }}>
                <img src={EZLogo} alt="Yawei Logistics" width="80%" />
            </div>
            壹智国际物流
        </div>
    )
}