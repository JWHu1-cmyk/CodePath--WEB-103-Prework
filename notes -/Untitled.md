
# App.js
- The code in `App.js` creates a _component_. In React, a component is a piece of reusable code that represents a part of a user interface. 
Components are used to render, manage, and update the UI elements in your application.  
- The first line defines a function called `Square`. The `export` JavaScript keyword makes this function accessible outside of this file. The `default` keyword tells other files using your code that it’s the main function in your file.
- `className="square"` is a button property or _prop_ that tells CSS how to style the button. 
- `X` is the text displayed inside of the button and `</button>` closes the JSX element to indicate that any following content shouldn’t be placed inside the button.

``` jsx
export default function Square() {  

return <button className="square">X</button>;  

}
```

# style.css
- The first two _CSS selectors_ (`*` and `body`) define the style of large parts of your app while the `.square` selector defines the style of any component where the `className` property is set to `square`.

# index.js





























