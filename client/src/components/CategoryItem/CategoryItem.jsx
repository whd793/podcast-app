import './CategoryItem.styles.scss';

// export const CategorySection = styled.section`
//   margin-bottom: 40px;
// `;

// export const CategoryHeader = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 20px;

//   h2 {
//     font-size: 1.8rem;
//     color: var(--primary-color);
//   }
// `;

// export const ItemsScrollContainer = styled.div`
//   display: flex;
//   overflow-x: auto;
//   gap: 20px;
//   padding: 10px 0;
//   -webkit-overflow-scrolling: touch;
//   scrollbar-width: none;
//   -ms-overflow-style: none;

//   &::-webkit-scrollbar {
//     display: none;
//   }
// `;

// export const ItemCard = styled.div`
//   flex: 0 0 auto;
//   width: 200px;
//   background-color: white;
//   border-radius: 8px;
//   overflow: hidden;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   transition: transform 0.3s ease;

//   &:hover {
//     transform: translateY(-5px);
//   }

//   img {
//     width: 100%;
//     height: 150px;
//     object-fit: cover;
//   }

//   h3 {
//     font-size: 1rem;
//     margin: 10px;
//   }

//   p {
//     font-size: 1.1rem;
//     font-weight: bold;
//     color: var(--secondary-color);
//     margin: 10px;
//   }
// `;

// export const AddToCartButton = styled.button`
//   background-color: var(--primary-color);
//   color: white;
//   border: none;
//   padding: 8px 16px;
//   font-size: 0.9rem;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
//   border-radius: 4px;
//   margin: 10px;
//   width: calc(100% - 20px);

//   &:hover {
//     background-color: #3476c5;
//   }
// `;

// export const ViewMoreButton = styled.button`
//   background-color: transparent;
//   color: var(--primary-color);
//   border: 2px solid var(--primary-color);
//   padding: 8px 16px;
//   font-size: 0.9rem;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   border-radius: 4px;

//   &:hover {
//     background-color: var(--primary-color);
//     color: white;
//   }
// `;

const CategoryItem = ({ category }) => (
  <div className='category-section'>
    <div className='category-header'>
      <h2>{category.title}</h2>
      <button className='view-more-btn'>View More</button>
    </div>
    <div className='items-scroll-container'>
      {category.items.map((item) => (
        <div key={item.id} className='item-card'>
          <img src={item.imageUrl} alt={item.name} />
          <h3>{item.name}</h3>
          <p>${item.price.toFixed(2)}</p>
          <button className='add-to-cart-btn'>Add to Cart</button>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryItem;
