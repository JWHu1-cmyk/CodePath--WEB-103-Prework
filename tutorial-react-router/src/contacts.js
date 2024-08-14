import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getContacts(query) {
  await fakeNetwork(`getContacts:${query}`);
  let contacts = await localforage.getItem("contacts");
  // "contacts" is used in contacts.js set method.
  if (!contacts) contacts = [];
  if (query) {
    contacts = matchSorter(contacts, query, { keys: ["first", "last"] });
  }
  return contacts.sort(sortBy("last", "createdAt"));
}

// Filtering with matchSorter
// The matchSorter function is used to filter an array of items based on a query. It performs fuzzy matching to find items that match the query string, considering the specified keys of the items.

// contacts: This is the array of contact objects that we want to filter.
// query: This is the search query used to filter the contacts.
// keys: ["first", "last"]: These are the keys within each contact object that matchSorter should use to perform the matching. In this case, it will look at the first and last name properties of each contact.

// Sorting with sortBy
// The sortBy function (commonly provided by libraries like lodash or similar) is used to sort an array of objects based on specified keys.

// contacts.sort(sortBy("last", "createdAt")): This line sorts the contacts array. The sorting is first based on the last name, and if there are multiple contacts with the same last name, they are further sorted by createdAt.

export async function createContact() {
  await fakeNetwork();
  // fakeCache Initialization: Since key is undefined, fakeCache is initialized as an empty object.
  // Key Check: The check for fakeCache[key] evaluates to false, so the function does not return early.
  // Cache Update: The key (undefined) is added to the cache with a value of true.
  // Promise: A new promise is created and returned, which resolves after a random delay.
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  let contacts = await getContacts();
  contacts.unshift(contact);
  await set(contacts);
  return contact;
}
// new: unshift
// The unshift method is a built-in JavaScript array method used to add one or more elements to the beginning of an array. It modifies the original array and returns the new length of the array.
// new: set
// In the context of your function, set appears to be a custom function that saves data to a persistent storage system, likely using a library such as localforage. This function is asynchronous and returns a promise.

export async function getContact(id) {
  await fakeNetwork(`contact:${id}`);
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  return contact ?? null;
}
// find Method:
// The find method is a built-in array method in JavaScript.
// It iterates over the array and returns the first element that satisfies the provided testing function.
// The arrow function (contact) => contact.id === id is the testing function provided to find.

// If no element satisfies the testing function, it returns undefined.
// getContact(params.contactId) used in routes/contact.jsx;
// The ?? operator is the nullish coalescing operator. It returns the right-hand side operand when the left-hand side operand is null or undefined.
// If contact is undefined (no contact found), it returns null.

export async function updateContact(id, updates) {
  await fakeNetwork();
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find((contact) => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return contact;
}
// Object.assign(contact, updates)
// The line Object.assign(contact, updates) is used to copy the properties from the updates object to the contact object. Here’s a detailed explanation of how this works:

// Object.assign()
// Object.assign() is a method in JavaScript that copies the properties from one or more source objects to a target object. It returns the target object.

// How Object.assign(contact, updates) Works:
// Target Object (contact):
// The contact object is the target object to which properties from the updates object will be copied.
// This object represents an existing contact fetched from the contacts array.

// Source Object (updates):
// The updates object contains the new or updated properties that should be applied to the contact object.
// This object represents the data submitted through the form.
// // updates is also a javascript object

// Finding a Specific Contact:
// let contact = contacts.find((contact) => contact.id === id);
// contact is a reference to the object within the contacts array that has an id matching the given id.
// find returns a reference to the first element in the array that satisfies the provided testing function.

export async function deleteContact(id) {
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex((contact) => contact.id === id);
  if (index > -1) {
    contacts.splice(index, 1);
    // The splice method is used to add or remove elements from an array. It modifies the original array and returns an array of the removed elements.
    // The syntax of splice is array.splice(start, deleteCount;
    await set(contacts);
    return true;
  }
  return false;
}

function set(contacts) {
  return localforage.setItem("contacts", contacts);
}
// localforage.setItem("contacts", contacts): This method is used to store the contacts data under the key "contacts".

// fake a cache so we don't slow down stuff we've already seen.
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise((res) => {
    setTimeout(res, Math.random() * 800);
  });
}

// The Promise constructor takes a function as its argument. This function receives two parameters: resolve (here named res) and reject. In this case, only resolve (res) is used.

// The arrow function () => {} is indeed a type of function in JavaScript. In the context of the Promise constructor, an arrow function is being used as the argument.

// Promise Constructor:
// new Promise(...) creates a new promise.
// The Promise constructor takes a single argument: a function known as the executor function.

// Executor Function:
// The executor function has two parameters, typically named resolve and reject.
// This function is called immediately by the Promise implementation and receives resolve and reject functions as arguments.

// new:
// After a random delay (between 0 and 800 milliseconds), setTimeout calls the res function.
// Calling res resolves the promise, indicating that the asynchronous operation has completed.

// new: is res provided by new promise?
// Yes, res (short for resolve) is provided by the Promise constructor when you create a new promise. When you create a new promise, the Promise constructor automatically calls the executor function you provide, passing it two arguments: resolve and reject. These arguments are functions that you can call to respectively fulfill or reject the promise.

// new: so in the end a resolved promise is returned by fakenetwork(key)?
// Yes, in the end, a resolved promise is returned by fakeNetwork(key) after the specified delay.
