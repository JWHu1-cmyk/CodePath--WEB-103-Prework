import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import ErrorPage from "./error-page";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";
import Index from "./routes/index";

// main.jsx manages the components: edit.jsx. contact.jsx. root.jsx wihtin routes/;
// note "export default function <...>" in each component, it contain the html to create the website.
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      { index: true, element: <Index /> },
      {
        path: "contacts/:contactId",
        // `:contactId`, params are passed to the loader with keys that match the dynamic segment
        element: <Contact />,
        loader: contactLoader,
        action: contactAction,
      },
      // The contactLoader function fetches the contact data based on the route parameter contactId and returns it.
      // The Contact component will be rendered when the route matches /contacts/:contactId;
      // contactLoader parameter is `:contactId`.'
      {
        path: "contacts/:contactId/edit",
        element: <EditContact />,
        loader: contactLoader,
        action: editAction,
      },
      {
        path: "contacts/:contactId/destroy",
        action: destroyAction,
        errorElement: <div>Oops! There was an error.</div>,
      },
    ],
  },
]);

/* <Form> prevents the browser from sending the request to the server and sends it to your route action instead.  */
// ex: rootLoader in main.jsx, useLoaderData in root.jsx.
// In the routes/Contact.jsx component, useLoaderData is called to access the data loaded by the 'loader as contactLoader' in main.jsx.
// within routes/contact.jsx, 'import { Form, useLoaderData } from "react-router-dom"';

// within edit.jsx, you see '<Form method="post" id="contact-form">';
// This is where the "old school web" programming model shows up. As we discussed earlier, <Form> prevents the browser from sending the request to the server and sends it to your route action instead. In web semantics, a POST usually means some data is changing;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
