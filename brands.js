// Brands.js - Reusable JavaScript for all brand pages
// Usage: initializeBrandPage('Izmir') or initializeBrandPage('Powerful') or initializeBrandPage('Zilwer')

function initializeBrandPage(brandName) {
    // Fetch and display products from API
    async function loadProducts() {
        const categoryGrid = document.getElementById('categoryGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        try {
            // Show loading spinner
            loadingSpinner.style.display = 'flex';
            
            // Fetch products from API using the brand name
            const response = await fetch(`https://api.urjeans.uz/api/products/brand/${brandName}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
            
            // Check if products exist
            if (!products || products.length === 0) {
                categoryGrid.innerHTML = '<div class="no-products"><p>No products available at the moment.</p></div>';
                return;
            }
            
            // Clear loading spinner and render products
            categoryGrid.innerHTML = '';
            
            // Render each product
            products.forEach(product => {
                const productElement = createProductElement(product);
                categoryGrid.appendChild(productElement);
            });
            console.log(products)
            
            // Initialize slideshow functionality for new products
            initializeSlideshows();
            
        } catch (error) {
            console.error('Error loading products:', error);
            loadingSpinner.style.display = 'none';
            categoryGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load products. Please try again later.</p>
                    <p style="font-size: 14px; margin-top: 10px;">Error: ${error.message}</p>
                </div>
            `;
        }
    }
    
    // Create product element
    function createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'category-item';
        
        // Create image slideshow
        const slideshowDiv = document.createElement('div');
        slideshowDiv.className = 'image-slideshow';
        
        // Parse images from JSON string
        let images = [];
        try {
            if (product.images) {
                images = JSON.parse(product.images);
            }
        } catch (error) {
            console.error('Error parsing images for product:', product.id, error);
        }
        
        // Add images to slideshow with proper URL construction
        if (images && images.length > 0) {
            images.forEach((image, index) => {
                const img = document.createElement('img');
                img.src = image.startsWith('http') ? image : `https://api.urjeans.uz${image}`;
                img.alt = `${product.product_name || product.brand_name} ${index + 1}`;
                img.className = index === 0 ? 'slide active' : 'slide';
                slideshowDiv.appendChild(img);
            });
        } else {
            const img = document.createElement('img');
            img.src = `../assets/${brandName.toLowerCase()}/${brandName.toLowerCase()}-1.jpeg`;
            img.alt = product.product_name || product.brand_name || 'Product';
            img.className = 'slide active';
            slideshowDiv.appendChild(img);
        }
        
        // Create info section (always visible at bottom)
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-hover';
        
        // Product name
        const nameH3 = document.createElement('h3');
        nameH3.className = 'jeans-name';
        nameH3.textContent = product.product_name || product.brand_name || 'Product';
        
        // Product style and brand
        const styleH4 = document.createElement('h4');
        styleH4.className = 'jeans-style';
        styleH4.textContent = `${product.brand_name || 'Brand'} - ${product.style || 'Premium Denim'}`;
        
        // Colors section
        const colorsP = document.createElement('p');
        colorsP.className = 'jeans-color';
        
        if (product.colors) {
            const colorArray = product.colors.split(',').map(color => color.trim());
            
            const colorMap = {
                'Blue': '#0066cc',
                'Black': '#000000',
                'White': '#ffffff',
                'Dark Blue': '#003366',
                'Light Blue': '#66ccff',
                'Navy': '#000080',
                'Red': '#dc2626',
                'Green': '#059669',
                'Yellow': '#d97706',
                'Purple': '#7c3aed',
                'Orange': '#ea580c',
                'Pink': '#ec4899',
                'Brown': '#92400e',
                'Gray': '#6b7280'
            };
            
            colorArray.forEach(colorName => {
                const colorSpan = document.createElement('span');
                colorSpan.className = 'color-box';
                colorSpan.style.backgroundColor = colorMap[colorName] || '#cccccc';
                colorSpan.title = colorName;
                colorsP.appendChild(colorSpan);
            });
        } else {
            const defaultColors = ['#0066cc', '#000000', '#ffffff'];
            defaultColors.forEach(color => {
                const colorSpan = document.createElement('span');
                colorSpan.className = 'color-box';
                colorSpan.style.backgroundColor = color;
                colorsP.appendChild(colorSpan);
            });
        }
        
        // Fabric/material
        const fabricP = document.createElement('p');
        fabricP.className = 'fabric';
        fabricP.textContent = product.fabric || '';
        
        // Add sizes information
        const sizesP = document.createElement('p');
        sizesP.className = 'fabric';
        sizesP.innerHTML = `<i class="fas fa-ruler" style="margin-right: 5px; color: #9ca3af;"></i>${product.sizes || 'Sizes available'}`;
        
        // Assemble info section
        infoDiv.appendChild(nameH3);
        infoDiv.appendChild(styleH4);
        infoDiv.appendChild(colorsP);
        infoDiv.appendChild(fabricP);
        infoDiv.appendChild(sizesP);
        
        // Assemble product element
        productDiv.appendChild(slideshowDiv);
        productDiv.appendChild(infoDiv);
        
        return productDiv;
    }
    
    // Initialize slideshow functionality
    function initializeSlideshows() {
        const slideshows = document.querySelectorAll('.image-slideshow');
        
        slideshows.forEach(slideshow => {
            const slides = slideshow.querySelectorAll('.slide');
            let currentSlide = 0;
            let slideshowInterval = null;
            
            if (slides.length > 1) {
                // Start slideshow on hover
                slideshow.addEventListener('mouseenter', () => {
                    slideshowInterval = setInterval(() => {
                        slides[currentSlide].classList.remove('active');
                        currentSlide = (currentSlide + 1) % slides.length;
                        slides[currentSlide].classList.add('active');
                    }, 3000);
                });
                
                // Stop slideshow on mouseout
                slideshow.addEventListener('mouseleave', () => {
                    if (slideshowInterval) {
                        clearInterval(slideshowInterval);
                        slideshowInterval = null;
                    }
                    // Reset to first image
                    slides.forEach((slide, index) => {
                        slide.classList.toggle('active', index === 0);
                    });
                    currentSlide = 0;
                });
            }
        });
    }
    
    // Load products when page loads
    document.addEventListener('DOMContentLoaded', loadProducts);
}

// Export the function for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeBrandPage };
}