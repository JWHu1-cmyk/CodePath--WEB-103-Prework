import {
  Form,
  useNavigate,
  redirect,
} from "react-router-dom";
import { createCreator } from "../Creator1.js";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    // Attempt to create the creator and handle potential errors
    await createCreator(updates);

    return redirect(`/`);
  } catch (error) {
    console.error("Error inserting creator:", error);
    alert("Error inserting creator: " + error.message);
    return redirect(`/`);
  }
}

export default function AddCreator() {
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form" className="container mt-5">
      <div className="mb-3">
        <label className="form-label">
          <span>Name: </span>
        </label>
        <input 
          name="name" 
          placeholder="Enter name" 
          className="form-control" 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          <span>URL: </span>
        </label>
        <input 
          name="url" 
          placeholder="Enter URL" 
          className="form-control" 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          <span>Description: </span>
        </label>
        <textarea 
          name="description" 
          rows={6} 
          placeholder="Enter description"
          className="form-control" 
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          <span>Image URL: </span>
        </label>
        <input 
          name="imageURL" 
          placeholder="Enter Image URL" 
          className="form-control" 
        />
      </div>
      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-primary">Save</button>
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
