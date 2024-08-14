
***
FilterableProductTable
    SearchBar
    ProductTable
        ProductCategoryRow
        ProductRow  

***
The original list of products is passed in as props, so it’s not state.
The search text seems to be state since it changes over time and can’t be computed from anything.
The value of the checkbox seems to be state since it changes over time and can’t be computed from anything.
The filtered list of products isn’t state because it can be computed by taking the original list of products and filtering it according to the search text and value of the checkbox.

Identify components that use state:
ProductTable needs to filter the product list based on that state (search text and checkbox value).
SearchBar needs to display that state (search text and checkbox value).

Currently your app renders correctly with props and state flowing down the hierarchy. But to change the state according to user input, you will need to support data flowing the other way: the form components deep in the hierarchy need to update the state in FilterableProductTable.

