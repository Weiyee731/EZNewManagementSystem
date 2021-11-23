import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { isStringNullOrEmpty, isObjectUndefinedOrNull } from "../../tools/Helpers"
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AttachmentIcon from "../../assets/icons/attachment.png"

import './Dropzone.css'
const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
    width: '100%'
};

const img = {
    display: 'block',
    width: 'auto',
    height: '100%',
    margin: 'auto',
};


export default function Dropzone(props) {
    const { placeholder, acceptedFormats, styles, maxFiles } = props
    const [accepted, setAccepted] = useState(isStringNullOrEmpty(acceptedFormats) ? 'image/*' : acceptedFormats)
    const [files, setFiles] = useState([]);
    const { getRootProps, getInputProps } = useDropzone({
        accept: accepted,
        onDrop: acceptedFiles => {
            const limitFiles = isStringNullOrEmpty(maxFiles) ? acceptedFiles.length : Number(maxFiles)
            const fileList = acceptedFiles.slice(0, limitFiles)

            setFiles(fileList.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })));
            if (typeof props.onChange === "function")
                props.onChange(fileList)
        }
    });

    const removeAttachment = filename => { setFiles(files.filter(x => x.name !== filename)); typeof props.onRemoveAttachment !== "undefined" && props.onRemoveAttachment(filename); }

    const thumbs = files.map((file, idx) => (
        <div style={isObjectUndefinedOrNull(props.imageStyles) ? thumb : props.imageStyles} key={file.name}>
            <IconButton
                size="medium"
                sx={{ width: '20px', height: '20px', position: 'absolute', color: 'red' }}
                onClick={() => removeAttachment(file.name)}
            >
                <DeleteIcon fontSize="inherit" />
            </IconButton>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    alt={'preview_' + idx}
                    onError={(e) => { e.target.onerror = null; e.target.src = AttachmentIcon }}
                />
            </div>
        </div>
    ));

    useEffect(() => () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    return (
        <section className="container-fluid">
            <div style={styles} {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <div className='m-auto' style={{ fontSize: isStringNullOrEmpty(placeholder.fontSize) ? '16px' : placeholder.fontSize }}>{isStringNullOrEmpty(placeholder.text) ? "" : placeholder.text}</div>
            </div>
            <aside style={thumbsContainer}>
                {thumbs}
            </aside>
        </section>
    );
}
