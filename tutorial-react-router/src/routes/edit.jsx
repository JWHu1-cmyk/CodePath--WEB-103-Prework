import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
// ***
// request.formData() is a method that extracts the form data from the request. It returns a FormData object that contains the data submitted in the form.
// Object.fromEntries(formData) converts the FormData object into a plain JavaScript object where each key-value pair corresponds to a form field name and its value.

// ***
// { request, params }, Object Destructuring:
// Object destructuring allows you to extract multiple properties from an object and assign them to variables in a single statement. In this case, it is used to extract the request and params properties from the object passed to the action function.

// Aside from action, none of these APIs we're discussing are provided by React Router: request, request.formData, Object.fromEntries are all provided by the web platform.
// action is an api provided by react router;
// Without JavaScript, when a form is submitted, the browser will create FormData and set it as the body of the request when it sends it to the server. As mentioned before, React Router prevents that and sends the request to your action instead, including the FormData.;
// Loaders and actions can both return a Response (makes sense, since they received a Request!). The redirect helper just makes it easier to return a response that tells the app to change locations.

export default function EditContact() {
  const { contact } = useLoaderData();
  // contactloader used in contact.jsx is used as loader in mainjsx for element: <EditContact />;
  // useLoaderData is a hook provided by the react-router-dom library (version 6 and later) that allows components to access data that was preloaded for the route.
  const navigate = useNavigate();

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact?.first}
          //   Optional Chaining Operator (?.)
          //         Purpose: The optional chaining operator allows you to safely access deeply nested properties without having to check if each level of the property exists. If any part of the chain is null or undefined, the expression short-circuits and returns undefined.
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact?.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact?.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact?.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea name="notes" defaultValue={contact?.notes} rows={6} />
      </label>
      <p>
        <button type="submit">Save</button>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </p>
    </Form>
  );
}
// ***
// how does Form know when a request has been made?
// is it when <button type="submit">Save</button> has been clicked.
// Yes, in HTML forms, the <button type="submit"> element plays a crucial role in form submission.
// The <Form> component, which is presumably imported from a library like react-router-dom or another form-handling library, creates a form that can be submitted. The method="post" attribute specifies that the form data should be sent using the POST HTTP method.
// The <button type="submit"> element inside the form triggers the form submission when clicked. This is a built-in HTML behavior: clicking a submit button inside a form will submit the form.

// Form Submission Event:
// Clicking the submit button triggers a submit event on the form. This is the default behavior of forms in HTML.

// Event Handling by <Form>:
// The submit event includes the form data, which is collected from all the form fields within the <Form> element.

// Summary
// Form Submission: The form is submitted when the <button type="submit">Save</button> button is clicked. This triggers the submit event on the <Form> component.
// Event Handling: The <Form> component listens for the submit event, collects the form data, and initiates a network request using the specified method (post).
// Form Data: The data from the form fields is included in the request payload, which is then sent to the server.

// ***
// the form data in the context of an HTML form consists of the values from form elements that have a name attribute. These form elements are typically <input>, <textarea>, <select>, and other input-related elements. When the form is submitted, the values from these elements are collected and sent as the form data.

// The form data sent in the request will look like this (in object representation):
// {
//   "first": "John",
//   "last": "Doe",
//   "twitter": "@johndoe",
//   "avatar": "https://example.com/johndoe.jpg",
//   "notes": "This is a note."
// }

// In the context of a web application, a request typically refers to an HTTP request sent by the client (such as a web browser) to the server. This request can contain various types of data, including form data.

// Form Component:

// <Form method="post" id="contact-form">
//   <!-- form fields -->
//   <button type="submit">Save</button>
// </Form>
