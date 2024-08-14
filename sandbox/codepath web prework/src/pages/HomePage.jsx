import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Root() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">CREATORVERSE</h1>
      <div className="d-flex justify-content-center mb-4">
        <Link to="showCreators" className="me-2">
          <button type="button" className="btn btn-primary">
            VIEW ALL CREATORS
          </button>
        </Link>
        <Link to="addCreator" className="ms-2">
          <button type="button" className="btn btn-success">
            ADD A CREATOR
          </button>
        </Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
