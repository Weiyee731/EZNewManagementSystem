import { Editor } from '@tinymce/tinymce-react';
// import { Component } from 'react';
import React, { Component, useState } from "react";
import axios from "axios";
import { ServerConfiguration } from "../../store/serverConf";

const DescriptionFunction = (props) => {
    const { post_content, postId, content, handleChange, imageFileUrl } = props
    return (
        <Editor
            id="editor1"
            apiKey='x4mqgazypswvw9k7ylkasipxjmrgp49stwbne96rwg4l1xhi'
            value={post_content}
            // value={content}
            onEditorChange={(e) => handleChange(e)}
            init={{
                height: 600,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | table | fontsizeselect | link | image | codesample code | fontselect',
                menubar: 'file edit view insert format tools table help',
                // toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
                a11y_advanced_options: true,
                media_alt_source: false,
                media_poster: false,

                font_formats: "Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Oswald=oswald; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats",
                content_style: "body { font-family: Montserrat; }",
                image_caption: true,
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                noneditable_noneditable_class: 'mceNonEditable',
                toolbar_mode: 'sliding',
                contextmenu: 'link image imagetools table',
                // skin: useDarkMode ? 'oxide-dark' : 'oxide',
                // content_css: useDarkMode ? 'dark' : 'default',
                
                file_picker_types: 'image',
                file_picker_callback: function (cb, value, meta) {
                    let button = document.getElementsByClassName("tox-dialog__footer");
                    var input = document.createElement('input');
                    input.setAttribute('type', 'file');
                    input.setAttribute('accept', 'image/*');
                    // button[0].innerHTML = `<div role="presentation" class="tox-dialog__footer-start"></div><div role="presentation" class="tox-dialog__footer-end"><button title="Cancel" type="button" tabindex="-1" data-alloy-tabstop="true" class="tox-button tox-button--secondary">Cancel</button><button title="Save" type="button" tabindex="-1" data-alloy-tabstop="true">Save</button></div>`
                    
                    // document.getElementById("savebtn").disable = true
                    
                    input.onchange = function () {
                        var file = this.files[0];

                        const formData = new FormData();
                        let imagename = new Date().valueOf();
                        formData.append("directory", imageFileUrl);
                        formData.append("imageFile", file);
                        formData.append("imageName", imagename);
                        let url = ServerConfiguration.filesUrl + "upload.php";
                        axios.post(url, formData, {}).then((res) => {

                            if (res.request.status === 200) {
                                var reader = new FileReader();
                                reader.readAsDataURL(file);
                                let link = ServerConfiguration.mediaUrl + imageFileUrl + "/" + imagename + "." + file.name.split(".").pop()

                                cb(link, { title: imagename });
                                // button[0].innerHTML = `<div role="presentation" class="tox-dialog__footer-start"></div><div role="presentation" class="tox-dialog__footer-end"><button title="Cancel" type="button" tabindex="-1" data-alloy-tabstop="true" class="tox-button tox-button--secondary">Cancel</button><button title="Save" type="button" tabindex="-1" data-alloy-tabstop="true" class="tox-button">Save</button></div>`
                                reader.onerror = error => { };
                            }
                        });
                    };
                    input.click();
                },
                images_upload_handler: function example_image_upload_handler (blobInfo, success, failure, progress) {
                    var xhr, formData;
                  
                    xhr = new XMLHttpRequest();
                    xhr.withCredentials = false;
                    xhr.open('POST', ServerConfiguration.filesUrl + "upload.php");
                    let imagename = new Date().valueOf();
                    xhr.upload.onprogress = function (e) {
                      progress(e.loaded / e.total * 100);
                    };
                  
                    xhr.onload = function() {
                      var json;
                      if (xhr.status === 403) {
                        failure('HTTP Error: ' + xhr.status, { remove: true });
                        return;
                      }
                  
                      if (xhr.status < 200 || xhr.status >= 300) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                      }
                      let link = ServerConfiguration.mediaUrl + imageFileUrl + "/" + imagename + "." + blobInfo.filename().split(".").pop()
                    //   if (xhr.status === 200) {
                    //     var reader = new FileReader();
                    //     reader.readAsDataURL(blobInfo.blob());
                        

                    //     success(link);
                    //     reader.onerror = error => { };
                    // }
                  
                    //   json = JSON.parse(xhr.responseText);
                  
                    //   if (!json || typeof json.location != 'string') {
                    //     failure('Invalid JSON: ' + xhr.responseText);
                    //     return;
                    //   }
                  
                      success(link);
                    };
                  
                    xhr.onerror = function () {
                      failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
                    };
                  
                    formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());
                    formData.append("directory", imageFileUrl);
                    formData.append("imageFile", blobInfo.blob());
                    formData.append("imageName", imagename);
                    xhr.send(formData);
                  }
                  
            }}
        />
    )

}

export default DescriptionFunction