import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { getCreators, updateCreator } from "../Creator1";

export async function action({ request, params }) {
  try {
    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    // Attempt to update the creator and handle potential errors
    await updateCreator(
      Number(params.creatorId),
      updates.name,
      updates.url,
      updates.description,
      updates.imageURL
    );

    return redirect(`/showCreators`);
  } catch (error) {
    console.error("Error updating creator:", error);
    alert("Error updating creator: " + error.message);
    return redirect(`/showCreators`);
  }
}

export async function loader({ params }) {
  const creators = await getCreators();

  if (!creators) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const creator = creators.find((creator) => creator.id === Number(params.creatorId));

  if (!creator) {
    throw new Response("", {
      status: 404,
      statusText: "Creator Not Found",
    });
  }

  return { creator };
}

export default function EditCreator() {
  const { creator } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Form method="post" id="edit-form" className="container mt-5">
      <div className="mb-3">
        <label className="form-label">
          <span>Name: </span>
        </label>
        <input
          name="name"
          placeholder="Enter name"
          defaultValue={creator?.name}
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
          defaultValue={creator?.url}
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
          defaultValue={creator?.description}
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
          defaultValue={creator?.imageURL}
          className="form-control"
        />
      </div>
      <div className="d-flex justify-content-between">
        <button type="submit" className="btn btn-primary">Save</button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/showCreators")}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
}
