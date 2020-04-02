import React from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';


export default class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: '',
            types: ['image/png', 'image/jpeg', 'image/jpg'],
            errors: [],
        };
        this.compressionOptions = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            onProgress: () => { },
        };
    }

    _handleSubmit(e) {
        e.preventDefault();
        const { file } = this.state;
        if (file !== '') {
            this.setState({ errors: [] }, () => {
                this.validateFile(file);
                this.compressImage(file);
            });
        }
    }

    compressImage = (file) => {
        imageCompression(file, this.compressionOptions)
            .then(function (compressedFile) {
                console.log(compressedFile);
                // return uploadToServer(compressedFile); // write your own logic
            })
            .catch(function (error) {
                console.log(error.message);
            });
    }

    handleAdd = async () => {
        const obj = { providerid: 1, menuid: 2, filename: 'test.png' };
        return axios({
            method: 'post',
            url: "http://50.210.236.117:85/MenuImageUpload",
            headers: {
                'content-type': 'multipart/form-data'
            },
            params: {
                fileData: this.state.imagePreviewUrl,
            },
            data: {
                providerid: obj.providerid,
                menuid: obj.menuid,
                filename: obj.filename,
                fileData: obj.filename
            }
        }).then((resp) => {
            console.log(resp);
        });
    }

    handleGet = async () => {
        const obj = { providerid: 1, menuid: 2, filename: 'test.png' };
        const url = 'http://50.210.236.117:85/Images/Menu/1/2/veggierice.jpg';
        const result = await axios.get(url, obj);
        return result;
    };

    _handleImageChange(e) {
        e.preventDefault();
        let file = e.target.files[0];
        this.setState({ file });
    }

    validateFile = async (file) => {
        // #1 Catching files that are not image files
        await this.validateFileType(file);

        // #2 Catching files that are too large on the client
        this.validateFileSize(file);
    }


    validateFileType = async (file) => {
        const error = `'${file.type}' is not a supported format`;
        if (this.state.types.indexOf(file.type) < 0) {
            return this.setState({ errors: [...this.state.errors, error] }, () => {
                console.log(this.state);
            });
        }
    }

    validateFileSize = (file) => {
        const size = (file.size / 1024 / 1024);
        const error = `'${file.name}' is too large, please pick a smaller file`;
        if (size > 3) {
            return this.setState({ errors: [...this.state.errors, error] });
        }
    }

    render() {
        return (
            <div className="previewComponent">
                <form>
                    <input className="fileInput"
                        type="file"
                        onChange={(e) => this._handleImageChange(e)} />
                    <button className="submitButton"
                        type="submit"
                        onClick={(e) => this._handleSubmit(e)}>Upload Image</button>
                </form>
                <div>
                    <ul>
                        {this.state.errors.map((error, index) => {
                            return (<li style={{ color: 'red' }} key={index}>{error}</li>)
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}
