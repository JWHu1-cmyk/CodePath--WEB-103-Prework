// import { Outlet } from "react-router-dom";
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";

export async function action() {
  const contact = await createContact();
  // return { contact };
  return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}
// ***
// note: Url search params
// notice name="q" in <input/>
// q is called URLSearchParams

// ***
// { request, params }, Object Destructuring:
// Object destructuring allows you to extract multiple properties from an object and assign them to variables in a single statement. In this case, it is used to extract the request and params properties from the object passed to the action function.

// ***
// Behavior When There Is No q Parameter
// If the q parameter is not present in the request URL, the following will happen:

// q Value:

// q will be null because url.searchParams.get("q") returns null when the parameter is not present.
// Calling getContacts:

// getContacts(null) is called.
// Inside getContacts, since query is null, the filtering step with matchSorter will be skipped, and all contacts will be retrieved and sorted.

export default function Root() {
  const { contacts, q } = useLoaderData();
  // { request, params }, Object Destructuring:
  // const data = useLoaderData();
  // const contacts = data.contacts;
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  // ***
  // const navigation = useNavigation();
  // useNavigation is a custom hook, probably provided by a routing library such as react-router-dom.
  // This hook returns an object that provides information about the current navigation state. This could include details about the current URL, query parameters, and navigation history.

  // navigation.location:
  // This checks if the location property exists on the navigation object. The location property typically contains information about the current URL, including the pathname and query string.
  // new URLSearchParams(navigation.location.search):
  // This creates a URLSearchParams object from the query string (navigation.location.search). The URLSearchParams API allows you to work with query parameters more easily.
  // .has("q"):
  // The has method checks if the query parameter "q" exists in the query string.

  // navigation.location:

  // navigation.location is an object that contains information about the current location (URL). This is similar to the window.location object in the browser, but is provided by the routing library for consistency and ease of use within the application.
  // location.search:

  // location.search is a property of the location object that contains the query string part of the URL. The query string includes everything after the ? in the URL.

  // Combined Logic:
  // navigation.location && new URLSearchParams(navigation.location.search).has("q"):
  // This logical AND expression ensures that both navigation.location is truthy (i.e., it exists) and that the query string contains a "q" parameter.
  // If both conditions are true, searching is set to true, indicating that a search query is active. Otherwise, searching is set to false.

  // http://example.com/path?name=John&age=30
  // Path: /path
  // Query String: ?name=John&age=30
  // navigation.location.search
  // In this example, navigation.location.search would be "?name=John&age=30".

  // searchParams.has("name"):

  // Checks if the query parameter name exists in the query string.
  // searchParams.get("name"):

  // Retrieves the value of the name query parameter from the query string.

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  //   const { contacts, q } = useLoaderData();
  // `q is created using this`;
  // ***
  // # hook, useEffect
  // The useEffect hook in your code snippet is used to update the value of an input element with the ID q whenever the variable q changes. Here’s a detailed explanation of how this works and what it does:
  // useEffect Hook:
  // The useEffect hook is used to perform side effects in function components. It runs after the component renders.

  // Effect Function:
  // `
  // () => {
  //   document.getElementById("q").value = q;
  // }
  // `
  // This is the effect function. It contains the logic to update the value of the input element.
  // document.getElementById("q") selects the input element with the ID q.
  // .value = q sets the value of the selected input element to the current value of the variable q.

  // Dependencies Array:
  // `[q]`
  // The dependencies array contains q.
  // The effect function will run whenever the value of q changes.

  // in the function () => { document.getElementById("q").value = q; }, q is indeed a variable.

  // ***
  // Updating DOM: The useEffect hook updates the input field’s value to match the q variable whenever q changes.

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            {/* ***
          Because this is a GET, not a POST, React Router does not call the action. Submitting a GET form is the same as clicking a link: only the URL changes. That's why the code we added for filtering is in the loader, not the action of this route.
            <Form id="search-form" role="search">
          Note that this form is different from the others we've used, it does not have <form method="post">. The default method is "get".
          Because this is a GET, not a POST, React Router does not call the action. Submitting a GET form is the same as clicking a link: only the URL changes. That's why the code we added for filtering is in the loader, not the action of this route. */}

            <input
              id="q"
              className={searching ? "loading" : ""}
              // Applying the "loading" Class:
              // When the searching variable is true, the input element will have a className of "loading".
              // This typically means the input will be styled according to the CSS rules defined for the .loading class.
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                submit(event.currentTarget.form);
              }}
              // Now as you type, the form is submitted automatically!
            />
            {/* The defaultValue={q} attribute in the <input> element is used to set the initial value of the input field when it is rendered. This is useful when you want to pre-fill the input field with a value, which in this case is the value of the q variable. */}
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {/* The <nav> element in HTML represents a section of a page intended for navigation. */}
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {/* Note that we are passing a function to className. When the
                    user is at the URL in the NavLink, then isActive will be
                    true. When it's about to be active (the data is still
                    loading) then isPending will be true. This allows us to
                    easily indicate where the user is, as well as provide
                    immediate feedback on links that have been clicked but we're
                    still waiting for data to load. */}
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                    {/* When contact.favorite is truthy:
                    The expression evaluates to <span>★</span>, so the star symbol is rendered.
                    When contact.favorite is falsy:
                    The expression evaluates to false, so nothing is rendered. */}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          {/* {contacts.length ? ... : ...}: This is a conditional (ternary) operator that checks if there are any contacts in the contacts array.
            If contacts.length is truthy (i.e., there are contacts), it renders a list of contacts.
            If contacts.length is falsy (i.e., there are no contacts), it renders a message indicating that there are no contacts. */}
        </nav>
      </div>
      {/* new section on the right */}
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
        {/* Great! The <Outlet> component from react-router-dom is used to render the child routes of a parent route. It acts as a placeholder in your parent component where the nested routes will be displayed. */}
      </div>
    </>
  );
}
