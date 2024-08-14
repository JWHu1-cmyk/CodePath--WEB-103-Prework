import { Form, useLoaderData, useNavigate, redirect } from "react-router-dom";
import { getCreators, deleteCreator } from "../Creator1";

export async function action({ params }) {
  await deleteCreator(params.creatorId);
  return redirect("/");
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

export default function ViewCreator() {
  const { creator } = useLoaderData();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/showCreators/creators/${creator.id}/edit`);
  };

  return (
    <div className="container mt-5">
      <div id="contact" className="card mb-3">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              key={creator.imageURL}
              src={creator.imageURL || `https://robohash.org/${creator.id}.png?size=200x200`}
              className="img-fluid rounded-start"
              alt={`${creator.name || 'Creator Image'}`}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">Name: {creator.name ? creator.name : <i>No Name</i>}</h5>
              {creator.url && (
                <p className="card-text">
                  <strong>URL: </strong>
                  <a href={creator.url} target="_blank" rel="noopener noreferrer">
                    {creator.url}
                  </a>
                </p>
              )}
              {creator.description && (
                <p className="card-text">
                  <strong>Description: </strong>{creator.description}
                </p>
              )}
              <div className="d-flex justify-content-start">
                <button className="btn btn-primary me-2" onClick={handleEdit}>Edit</button>
                <Form
                  method="post"
                  onSubmit={(event) => {
                    if (!confirm("Please confirm you want to delete this record.")) {
                      event.preventDefault();
                    }
                  }}
                >
                  <button type="submit" className="btn btn-danger">Delete</button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
