import '../../style/stock.css';

const StockTable = ({ variants, onEdit }) => {
  return (
    <div className="stock-table-container">
      <table className="stock-table">
        <thead className="stock-table-header">
          <tr>
            <th className="stock-table-header-cell">Name</th>
            <th className="stock-table-header-cell">Color</th>
            <th className="stock-table-header-cell">Size</th>
            <th className="stock-table-header-cell">Price</th>
            <th className="stock-table-header-cell">Quantity</th>
            <th className="stock-table-header-cell">Status</th>
            <th className="stock-table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id} className="stock-table-row">
              <td className="stock-table-cell">{variant.name}</td>
              <td className="stock-table-cell">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span 
                    className="stock-color-indicator" 
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                  />
                  {variant.color}
                </div>
              </td>
              <td className="stock-table-cell">{variant.size}</td>
              <td className="stock-table-cell">${variant.price.toFixed(2)}</td>
              <td className="stock-table-cell">{variant.stock}</td>
              <td className="stock-table-cell">
                <span className={`stock-status ${variant.stock > 0 ? 'stock-status-in' : 'stock-status-out'}`}>
                  {variant.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </td>
              <td className="stock-table-cell">
                <button
                  onClick={() => onEdit(variant)}
                  className="stock-action-button stock-edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => onEdit({ ...variant, stock: 0 })}
                  className="stock-action-button stock-delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;