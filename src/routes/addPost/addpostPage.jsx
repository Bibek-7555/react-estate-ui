import UploadWidget from '../../components/uploadWidget/UploadWidget.jsx';
import './addpostPage.scss'
import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom'
import apiRequest from "../../lib/apiRequest.js"
import { Editor } from '@tinymce/tinymce-react'

function AddpostPage(){

  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const editorRef = useRef(null);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    const description = editorRef.current ? editorRef.current.getContent() : ''
    console.log("Inputs are: ", inputs)

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: Number(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: Number(inputs.bedroom),
          bathroom: Number(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          postImages: images,
        },
        postDetails: {
          description: description,
          utilities: inputs.utilities,
          petPolicy: inputs.pet,
          size: inputs.size,
          propertyFees: inputs.income,
          school: inputs.school,
          bus: inputs.bus,
          restaurant: inputs.restaurant
        }
      })

      console.log("Response: ",res.data)
      console.log("IDDD: ",res.data.data._id)
  
      navigate("/"+res.data.data._id)
    } catch (error) {
      console.log("Errors are: ",error)
      console.log(error.response.data.message)
      setError(error.response.data.message)
    }

  }

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <Editor id= 'desc' name='description'
                    apiKey='ozqiyaapxfazerbrr410t54y0wo6ez2cy0hd20yrcgz095l2'
                    onInit={(_evt, editor) => editorRef.current = editor}
                    // initialValue="<p>This is the initial content of the editor.</p>"
                    init={{
                      height: 500,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                    }}
            />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <div className="imageContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        </div>
        <UploadWidget
        uwConfig={{
          multiple: true,
          cloudName: "dhiaoiv3b",
          uploadPreset: "realestate",
          maaxImageFileSize: 3000000,
          folder: "posts",
        }}
        setState={setImages}
        />
      </div>
    </div>
  );
}
export default AddpostPage;