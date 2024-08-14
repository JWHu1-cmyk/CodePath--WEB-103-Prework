import { Form, useLoaderData, useFetcher } from "react-router-dom";
import { getContact, updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
}

export async function loader({ params }) {
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { contact };
  //
  // Hu: The return { contact } syntax is used to return an object containing the contact variable. This is a common pattern in JavaScript, particularly when you want to return multiple pieces of data from a function, or when you want to maintain a consistent return type (an object) for easier access and destructuring in the caller.
  //   return { contact, metadata };
  // used as 'loader as contactLoader' in main.jsx.
  // contactLoader parameter is `:contactId`.
}
// within main.jsx
// Note the :contactId URL segment. The colon (:) has special meaning, turning it into a "dynamic segment". Dynamic segments will match dynamic (changing) values in that position of the URL, like the contact ID. We call these values in the URL "URL Params", or just "params" for short.

// These params are passed to the loader with keys that match the dynamic segment. For example, our segment is named :contactId so the value will be passed as params.contactId.

export default function Contact() {
  const { contact } = useLoaderData();
  // { request, params }, Object Destructuring:
  // In the routes/Contact.jsx component, useLoaderData is called to access the data loaded by the 'loader as contactLoader' in main.jsx.

  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://robohash.org/you.png?size=200x200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          key={contact.avatar}
          src={
            contact.avatar ||
            `https://robohash.org/${contact.id}.png?size=200x200`
          }
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
          {/* you need to pass contact within {} because contact is an object, and you are using object destructuring in the Favorite component's function parameters to access its properties directly. Let's break this down step by step. */}
        </h1>
        {/* This checks if either contact.first or contact.last exists.
        If either value exists, it evaluates to true.
        If both are undefined or empty, it evaluates to false. */}

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        )}
        {/* This checks if contact.twitter exists and is not empty.
        If it exists, the code inside the parentheses is rendered.
        If it does not exist, nothing is rendered. */}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          {/* 
          *** 
          When you click the "Edit" button, the form is submitted. In HTML,
          submitting a form with an action attribute will direct the browser to
          the URL specified in the action attribute. In this case, it will
          navigate to the "edit" route relative to the current route.
          ***
          1. Form Component with Action 
            The "Edit" button is part of a form
            with an action attribute set to "edit"; 
          2. Form Submission 
            When you
            click the "Edit" button, the form is submitted. In HTML, submitting a
            form with an action attribute will direct the browser to the URL
            specified in the action attribute. In this case, it will navigate to
            the "edit" route relative to the current route. 
          3. Route Configuration
            In your routing configuration (likely in main.jsx or a similar file), you have defined a route for the edit page.
          */}
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}
          >
            {/* When the user clicks the submit button:
              <Form> prevents the default browser behavior of sending a new POST request to the server, but instead emulates the browser by creating a POST request with client side routing
              The <Form action="destroy"> matches the new route at "contacts/:contactId/destroy" and sends it the request
              After the action redirects, React Router calls all of the loaders for the data on the page to get the latest values (this is "revalidation"). useLoaderData returns new values and causes the components to update! 
              
            */}
            {/* The onSubmit attribute in the <Form> element specifies a JavaScript function that is executed when the form is submitted. 
            Arrow Function:

            The function defined is an arrow function with a single parameter event.
            Parameter event:

            event is an object representing the event that occurs when the form is submitted. This object provides various properties and methods related to the event.
            confirm Function:

            confirm("Please confirm you want to delete this record.") is a built-in JavaScript function that displays a modal dialog with a specified message and OK/Cancel buttons.
            If the user clicks "OK", confirm returns true.
            If the user clicks "Cancel", confirm returns false.

            event.preventDefault():

            event.preventDefault() is a method that prevents the default action associated with the event.
            In this context, it prevents the form from being submitted if the user clicks "Cancel" in the confirmation dialog. 
            
            ***
            Form Submission: Clicking the "Edit" button submits the form.
            Action Attribute: The action="edit" attribute indicates that the form should navigate to the edit path relative to the current route.
            Relative Navigation: If the current route is /contacts/123, the form submission navigates to /contacts/123/edit.
            
            */}
            <button type="submit">Delete</button>
          </Form>
          {/* Form detects being clicked in website, and calls action reserved in main.jsx's route config */}
        </div>
      </div>
    </div>
  );
}

function Favorite({ contact }) {
  const fetcher = useFetcher();

  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;
  // Instead of always rendering the actual data, we check if the fetcher has any formData being submitted, if so, we'll use that instead. When the action is done, the fetcher.formData will no longer exist and we're back to using the actual data. So even if you write bugs in your optimistic UI code, it'll eventually go back to the correct state 🥹

  return (
    <fetcher.Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
    // within contact.jsx, <Form action="edit">, <Form method="post" action="destroy">, causing redirecting to relative link "contacts/:contactId/edit", shown in main.jsx;
    //***
    // notes: mutation without navigation;
    // mutations (the times we change data);
    // So far all of our mutations (the times we change data) have used forms that navigate, creating new entries in the history stack. While these user flows are common, it's equally as common to want to change data without causing a navigation.
    // For these cases, we have the useFetcher hook. It allows us to communicate with loaders and actions without causing a navigation.
    // Our new <fetcher.Form method="post"> works almost exactly like the <Form>;
    // There is one key difference though, it's not a navigation--the URL doesn't change, the history stack is unaffected.
    // wihtin root.jsx, <Form method="post">, calls action; within edit.jsx, <Form method="post" id="contact-form">, which also calls action; but there is no navigation??? although to be fair all the action contains redirect() method;
    // within root.jsx, <Form id="search-form" role="search">, Note that this form is different from the others we've used, it does not have <form method="post">. The default method is "get". Because this is a GET, not a POST, React Router does not call the action. Submitting a GET form is the same as clicking a link: only the URL changes;
  );
}
