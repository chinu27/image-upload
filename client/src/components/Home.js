import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import Setting from "./settings";
import Navbar from "./navbar";
import Footer from "./footer";
import "./component.css";
import Button from "@material-ui/core/Button";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      selectedFiles: null,
      isFetched: false,
    };
  }

  singleFileChangedHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
    });
  };

  multipleFileChangedHandler = (event) => {
    this.setState({
      selectedFiles: event.target.files,
    });
    console.log(event.target.files);
  };

  singleFileUploadHandler = (event) => {
    const data = new FormData();
    // If file selected
    if (this.state.selectedFile) {
      data.append(
        "profileImage",
        this.state.selectedFile,
        this.state.selectedFile.name
      );
      axios
        .post("/api/profile/profile-img-upload", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((response) => {
          if (200 === response.status) {
            // If file size is larger than expected.
            if (response.data.error) {
              if ("LIMIT_FILE_SIZE" === response.data.error.code) {
                this.ocShowAlert("Max size: 2MB", "red");
              } else {
                console.log(response.data);
                // If not the given file type
                this.ocShowAlert(response.data.error, "red");
              }
            } else {
              // Success
              let fileName = response.data;
              console.log("filedata", fileName);
              this.ocShowAlert("File Uploaded", "#3089cf");
              this.showLocation(fileName);
              this.isFetched = true;
            }
          }
        })
        .catch((error) => {
          this.ocShowAlert(error, "red");
        });
    } else {
      this.ocShowAlert("Please upload file", "red");
    }
  };

  multipleFileUploadHandler = () => {
    const data = new FormData();
    let selectedFiles = this.state.selectedFiles;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        data.append("galleryImage", selectedFiles[i], selectedFiles[i].name);
      }
      axios
        .post("/api/profile/multiple-file-upload", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          },
        })
        .then((response) => {
          console.log("res", response);
          if (200 === response.status) {
            // If file size is larger than expected.
            if (response.data.error) {
              if ("LIMIT_FILE_SIZE" === response.data.error.code) {
                this.ocShowAlert("Max size: 35MB", "red");
              } else if ("LIMIT_UNEXPECTED_FILE" === response.data.error.code) {
                this.ocShowAlert("Max 4 images allowed", "red");
              } else {
                // If not the given file type
                this.ocShowAlert(response.data.error, "red");
              }
            } else {
              // Success
              let fileName = response.data;
              console.log("fileName", fileName);
              this.ocShowAlert("File Uploaded", "#3089cf");
              this.showMultiLocation(fileName);
            }
          }
        })
        .catch((error) => {
          // If another error
          this.ocShowAlert(error, "red");
        });
    } else {
      // if file not selected throw error
      this.ocShowAlert("Please upload file", "red");
    }
  };

  //multi show

  showMultiLocation = (fileName) => {
    //console.log("m", fileName);
    var source = fileName.filesArray;
    let gg = source.map((id) => {
      let mulImgContainer = document.querySelector("#mulImgContainer"),
        mulImgele = document.createElement("img");
      mulImgele.setAttribute("class", "imgt");
      mulImgele.setAttribute("src", id.location);
      mulImgContainer.appendChild(mulImgele);
      $("#mhid").show();
    });

    console.log(source);
    // let imgContainer = document.querySelector("#imgContainer"),
    //   imgelem = document.createElement("img");
    // imgelem.setAttribute("class", "imgt");
    // imgelem.setAttribute("src", source);
    // imgContainer.appendChild(imgelem);
    // $("#hid").show();
  };

  //show singleimage
  showLocation = (fileName) => {
    //console.log("b", fileName);
    var source = fileName.location;
    console.log(source);
    let imgContainer = document.querySelector("#imgContainer"),
      imgelem = document.createElement("img");
    imgelem.setAttribute("class", "imgt");
    imgelem.setAttribute("src", source);
    imgContainer.appendChild(imgelem);
    $("#hid").show();
  };

  // ShowAlert Function
  ocShowAlert = (message, background = "#3089cf") => {
    let alertContainer = document.querySelector("#oc-alert-container"),
      alertEl = document.createElement("div"),
      textNode = document.createTextNode(message);
    alertEl.setAttribute("class", "oc-alert-pop-up");
    $(alertEl).css("background", background);
    alertEl.appendChild(textNode);
    alertContainer.appendChild(alertEl);
    setTimeout(function () {
      $(alertEl).fadeOut("slow");
      $(alertEl).remove();
    }, 3000);
  };

  clearHandler = () => {
    this.setState({
      selectedFile: null,
      selectedFiles: null,
    });
  };

  render() {
    console.log(this.state);
    return (
      <>
        <Navbar></Navbar>
        <div
          className="container"
          style={{ marginTop: "100px", marginBottom: "150px" }}
        >
          {/* For Alert box*/}
          <div className="snack" id="oc-alert-container"></div>
          {/* Single File Upload*/}
          <div className="part" style={{ alignItems: "center" }}>
            {/* <div className="single>">
              <div
                className="card border-light mb-3 mt-5"
                style={{ boxShadow: "0 5px 10px 2px rgba(195,192,192,.5)" }}
              >
                <div className="card-header">
                  <div className="chead">
                    <h3 style={{ color: "#555", marginLeft: "12px" }}>
                      Single Image Upload
                    </h3>
                    <span className="pointer">
                      <Setting color="primary"></Setting>
                    </span>
                  </div>
                  <p className="text-muted" style={{ marginLeft: "12px" }}>
                    Upload Size: 250px x 250px ( Max 35MB )
                  </p>
                </div>
                <div className="card-body">
                  <p className="card-text">Please upload an image.</p>
                  <input type="file" onChange={this.singleFileChangedHandler} />
                  <div className="col-md-12 mt-3">
                    <div className="imgcon" id="imgContainer">
                      <div
                        className="subContaner"
                        id="hid"
                        style={{ display: "none" }}
                      >
                        <p>Uploaded Images:</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.singleFileUploadHandler}
                    >
                      Upload!
                    </Button>
                  </div>
                </div>
              </div>
            </div> */}
            {/* Multiple File Upload */}
            <div className="multi" style={{ marginTop: "30px" }}>
              <div
                className="card border-light mb-3"
                style={{
                  boxShadow: "0 5px 10px 2px rgba(195,192,192,.5)",
                }}
              >
                <div className="card-header">
                  <div className="chead">
                    <h3 style={{ color: "#555", marginLeft: "12px" }}>
                      Upload Images to Amazon S3 Bucket.
                    </h3>
                    <span className="pointer">
                      <Setting color="primary"></Setting>
                    </span>
                  </div>
                  <p className="text-muted" style={{ marginLeft: "12px" }}>
                    Upload Size: 300px x 300px ( Max 35MB )
                  </p>
                </div>
                <div className="card-body">
                  <p className="card-text">
                    Please upload single or multiple images.
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={this.multipleFileChangedHandler}
                  />
                  <div className="dz" style={{ marginTop: "25px" }}></div>
                  <div className="col-md-12 mt-3">
                    <div className="imgcon" id="mulImgContainer">
                      <div
                        className="subContaner"
                        id="mhid"
                        style={{ display: "none" }}
                      >
                        <p>Uploaded Images:</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 but">
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={this.multipleFileUploadHandler}
                    >
                      Upload!
                    </Button>
                    <Button variant="contained" onClick={this.clearHandler}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default Home;
