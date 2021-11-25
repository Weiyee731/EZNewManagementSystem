import React, { Component } from "react";
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingPanel() {
    const stylesheet = {
        displayLoadingPanel: {
            width: "100%",
            height: "100%",
            zIndex: "1000",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            display: "flex",
            position: "absolute",
            top: "0",
            left: "0",
        },
        loadingObject: {
            width: "100%",
            height: "100%",
            display: "flex"
        },
        centerObject: {
            margin: "auto"
        },

    }

    return (
        <div style={stylesheet.displayLoadingPanel}>
            <div style={stylesheet.loadingObject}>
                <CircularProgress color="primary" style={stylesheet.centerObject} />
            </div>
        </div>
    );
}
