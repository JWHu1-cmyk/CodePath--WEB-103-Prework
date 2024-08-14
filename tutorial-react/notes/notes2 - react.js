import { useState } from "react";

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">{category}</th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? (
    product.name
  ) : (
    <span style={{ color: "red" }}>{product.name}</span>
  );
  // Hu: Ternary Operator

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    // Hu: forEach, begins iteration
    if (product.name.toLowerCase().indexOf(filterText.toLowerCase()) === -1) {
      // Hu: '.indexOf(filterText.toLowerCase())': The indexOf method checks if the filterText exists within the product.name.
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    // Hu: relate to the inStockOnly filter;
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category}
        />
      );
    }
    // Hu: < ProductCategoryRow /> won't be created if the last product is's category is the same as current one;
    rows.push(<ProductRow product={product} key={product.name} />);
    lastCategory = product.category;
  });
  // Hu:
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) {
  // Hu: FonFilterTextChange, onInStockOnlyChange changes filterText, inStockOnly in ilterableProductTable;
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />

      {/* 
      Hu: onChange is an event handler prop in React that is triggered when the value of an input element changes (for example, when a user types in a text input).
      Hu: e is the event object that is automatically passed to the event handler function by the browser when the event occurs. 
      Hu: e.target refers to the DOM element that triggered the event. In this case, it's the input element.

      
      */}

      <label>
        <input
          type="checkbox"
          checked={inStockOnly}
          // inStockOnly is initalized to be false;
          onChange={(e) => onInStockOnlyChange(e.target.checked)}
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },

  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];
// Hu: an array containing list of objects

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
