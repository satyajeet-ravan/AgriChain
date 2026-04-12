import { useNavigate } from 'react-router-dom';
import './CropCard.css';

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const stars = Array.from({ length: 5 }, (_, i) => i < full ? '★' : '☆').join('');
  return <span className="stars">{stars}</span>;
}

export default function CropCard({ crop, onAddToCart, showActions = true }) {
  const navigate = useNavigate();

  function handleAddToCart(e) {
    e.stopPropagation();
    onAddToCart?.(crop);
  }

  return (
    <div className="crop-card" onClick={() => navigate(`/marketplace/${crop.id}`)}>
      <div className="crop-card-image">
        <img src={crop.image} alt={crop.name} loading="lazy" />
        <div className="crop-card-badges">
          {crop.organic && <span className="badge badge-success">🌿 Organic</span>}
          {!crop.available && <span className="badge badge-danger">Out of Stock</span>}
        </div>
        {!crop.available && (
          <div className="unavailable-overlay"><span>Unavailable</span></div>
        )}
      </div>

      <div className="crop-card-body">
        <div className="crop-category">{crop.category}</div>
        <div className="crop-name">{crop.name}</div>
        <div className="crop-farmer">
          <span>👨‍🌾</span>
          <span>{crop.farmer} • {crop.location}</span>
        </div>
        <div className="crop-rating">
          <StarRating rating={crop.rating} />
          <span>{crop.rating}</span>
          <span className="review-count">({crop.reviews} reviews)</span>
        </div>
      </div>

      <div className="crop-card-footer">
        <div className="crop-price">
          <span className="price-amount">₹{crop.price}</span>
          <span className="price-unit">/{crop.unit}</span>
        </div>
        <div className="crop-qty">📦 {crop.quantity}{crop.unit}</div>
        {showActions && crop.available && (
          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>+ Cart</button>
        )}
      </div>
    </div>
  );
}
