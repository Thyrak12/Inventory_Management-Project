import '../../style/stock.css';

const StockHeader = ({ onStockProductClick }) => {
  return (
    <header className="stock-header">
      <h1 className="stock-header-title">Stock Management</h1>
      <button 
        className="stock-product-btn"
        onClick={onStockProductClick}
      >
        Stock Product
      </button>
    </header>
  );
};

export default StockHeader;