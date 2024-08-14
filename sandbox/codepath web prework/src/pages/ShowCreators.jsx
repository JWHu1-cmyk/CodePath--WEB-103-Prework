import React from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
} from "react-router-dom";
import { getCreators } from "../Creator1";

export async function loader() {
  try {
    const contacts = await getCreators();
    return { contacts };
  } catch (error) {
    console.error("Failed to load contacts:", error);
    return { contacts: [] }; // Return an empty array on error
  }
}

export default function Root() {
  const { contacts } = useLoaderData();

  return (
    <div className="container mt-4">
      <nav className="mb-4">
        {contacts && contacts.length ? (
          <>
            <div className="mb-3"></div>
            <ul className="list-group">
              {contacts.map((contact) => (
                <li key={contact.id} className="list-group-item">
                  <NavLink
                    to={`./creators/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "list-group-item active" : isPending ? "list-group-item pending" : "list-group-item"
                    }
                  >
                    <div>
                      <strong>Name:</strong>{" "}
                      {contact.name ? contact.name : "No Name"}
                    </div>
                    <div>
                      <strong>URL:</strong>{" "}
                      {contact.url ? contact.url : "No URL"}
                    </div>
                    <div>
                      <strong>Description:</strong>{" "}
                      {contact.description ? contact.description : "No Description"}
                    </div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>
            <i>No contacts</i>
          </p>
        )}
      </nav>
      <Outlet />
    </div>
  );
}
