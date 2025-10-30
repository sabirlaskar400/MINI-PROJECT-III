//   // Trie Node Class
//         class TrieNode {
//             constructor() {
//                 this.children = {};
//                 this.isEndOfWord = false;
//                 this.products = []; // Store product objects at this node
//             }
//         }

//         // Trie Data Structure
//         class Trie {
//             constructor() {
//                 this.root = new TrieNode();
//             }

//             // Insert a word with associated product data
//             insert(word, product) {
//                 let node = this.root;
//                 word = word.toLowerCase();
                
//                 for (let char of word) {
//                     if (!node.children[char]) {
//                         node.children[char] = new TrieNode();
//                     }
//                     node = node.children[char];
//                 }
                
//                 node.isEndOfWord = true;
//                 node.products.push(product);
//             }

//             // Search for words with given prefix
//             searchPrefix(prefix) {
//                 let node = this.root;
//                 prefix = prefix.toLowerCase();
                
//                 for (let char of prefix) {
//                     if (!node.children[char]) {
//                         return [];
//                     }
//                     node = node.children[char];
//                 }
                
//                 return this.getAllProducts(node, prefix);
//             }

//             // Get all products from a node
//             getAllProducts(node, prefix) {
//                 let results = [];
                
//                 if (node.isEndOfWord) {
//                     results.push(...node.products);
//                 }
                
//                 for (let char in node.children) {
//                     results.push(...this.getAllProducts(node.children[char], prefix + char));
//                 }
                
//                 return results;
//             }
//         }

//         // Initialize Trie and populate with products
//         const productTrie = new Trie();

//         // Product data from your HTML
//         const products = [
//             { brand: "adidas", name: "Printed Shirt", price: "$74" },
//             { brand: "Nike", name: "Printed Shirt", price: "$65" },
//             { brand: "Zara", name: "Half Slave Printed Shirt", price: "$29" },
//             { brand: "H&M", name: "White Printed Shirt", price: "$89" },
//             { brand: "Loka", name: "Nevy blue Shirts", price: "$12" },
//             { brand: "adidas", name: "Dual color Shirt", price: "$89" },
//             { brand: "H&M", name: "Lower", price: "$78" },
//             { brand: "adidas", name: "Top", price: "$56" },
//             { brand: "adidas", name: "Astronaut Full Slave Shirts", price: "$74" },
//             { brand: "Nike", name: "Black Shirts", price: "$65" },
//             { brand: "Zara", name: "White Shirts", price: "$29" },
//             { brand: "H&M", name: "Shirts", price: "$89" },
//             { brand: "H&M", name: "Cargo Shirts", price: "$12" },
//             { brand: "adidas", name: "Shorts", price: "$89" },
//             { brand: "Nike", name: "Brown Shirts", price: "$78" },
//             { brand: "H&M", name: "Half slave Shirt", price: "$56" }
//         ];

//         // Insert products into Trie
//         products.forEach(product => {
//             // Insert by product name
//             productTrie.insert(product.name, product);
            
//             // Insert by brand name
//             productTrie.insert(product.brand, product);
            
//             // Insert by individual words in product name
//             const words = product.name.split(' ');
//             words.forEach(word => {
//                 if (word.length > 2) { // Only index words longer than 2 characters
//                     productTrie.insert(word, product);
//                 }
//             });
//         });

//         // Autocomplete functionality
//         const searchInput = document.querySelector('.search-input');
//         const dropdown = document.getElementById('autocompleteDropdown');

//         searchInput.addEventListener('input', function(e) {
//             const query = e.target.value.trim();
            
//             if (query.length === 0) {
//                 dropdown.classList.remove('show');
//                 return;
//             }
            
//             const results = productTrie.searchPrefix(query);
            
//             // Remove duplicates based on product name and brand
//             const uniqueResults = [];
//             const seen = new Set();
            
//             results.forEach(product => {
//                 const key = `${product.brand}-${product.name}`;
//                 if (!seen.has(key)) {
//                     seen.add(key);
//                     uniqueResults.push(product);
//                 }
//             });
            
//             displayResults(uniqueResults);
//         });

//         function displayResults(results) {
//             if (results.length === 0) {
//                 dropdown.innerHTML = '<div class="no-results">No products found</div>';
//                 dropdown.classList.add('show');
//                 return;
//             }
            
//             // Limit to 8 results
//             const limitedResults = results.slice(0, 8);
            
//             dropdown.innerHTML = limitedResults.map(product => `
//                 <div class="autocomplete-item">
//                     <div>
//                         <span class="product-brand">${product.brand}</span>
//                         <span class="product-name">${product.name}</span>
//                     </div>
//                     <span class="product-price">${product.price}</span>
//                 </div>
//             `).join('');
            
//             dropdown.classList.add('show');
            
//             // Add click handlers to items
//             const items = dropdown.querySelectorAll('.autocomplete-item');
//             items.forEach(item => {
//                 item.addEventListener('click', function() {
//                     const productName = this.querySelector('.product-name').textContent;
//                     searchInput.value = productName;
//                     dropdown.classList.remove('show');
//                 });
//             });
//         }

//         // Close dropdown when clicking outside
//         document.addEventListener('click', function(e) {
//             if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
//                 dropdown.classList.remove('show');
//             }
//         });

//         // Prevent form submission on Enter key
//         searchInput.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 e.preventDefault();
//                 const firstItem = dropdown.querySelector('.autocomplete-item');
//                 if (firstItem) {
//                     firstItem.click();
//                 }
//             }
//         });

// Trie Node Class 2
        class TrieNode {
            constructor() {
                this.children = {};
                this.isEndOfWord = false;
                this.products = [];
            }
        }

        // Trie Data Structure
        class Trie {
            constructor() {
                this.root = new TrieNode();
            }

            insert(word, product) {
                let node = this.root;
                word = word.toLowerCase();
                
                for (let char of word) {
                    if (!node.children[char]) {
                        node.children[char] = new TrieNode();
                    }
                    node = node.children[char];
                }
                
                node.isEndOfWord = true;
                node.products.push(product);
            }

            searchPrefix(prefix) {
                let node = this.root;
                prefix = prefix.toLowerCase();
                
                for (let char of prefix) {
                    if (!node.children[char]) {
                        return [];
                    }
                    node = node.children[char];
                }
                
                return this.getAllProducts(node, prefix);
            }

            getAllProducts(node, prefix) {
                let results = [];
                
                if (node.isEndOfWord) {
                    results.push(...node.products);
                }
                
                for (let char in node.children) {
                    results.push(...this.getAllProducts(node.children[char], prefix + char));
                }
                
                return results;
            }
        }

        // Initialize Trie and populate with products
        const productTrie = new Trie();

        // Product data from your HTML (with image paths and ratings)
        const products = [
            { brand: "adidas", name: "Printed Shirt", price: "$74", image: "img/product/f1.jpg", rating: 5 },
            { brand: "Nike", name: "Printed Shirt", price: "$65", image: "img/product/f2.jpg", rating: 4 },
            { brand: "Zara", name: "Half Slave Printed Shirt", price: "$29", image: "img/product/f3.jpg", rating: 5 },
            { brand: "H&M", name: "White Printed Shirt", price: "$89", image: "img/product/f4.jpg", rating: 5 },
            { brand: "Loka", name: "Nevy blue Shirts", price: "$12", image: "img/product/f5.jpg", rating: 3 },
            { brand: "adidas", name: "Dual color Shirt", price: "$89", image: "img/product/f6.jpg", rating: 5 },
            { brand: "H&M", name: "Lower", price: "$78", image: "img/product/f7.jpg", rating: 5 },
            { brand: "adidas", name: "Top", price: "$56", image: "img/product/f8.jpg", rating: 4 },
            { brand: "adidas", name: "Astronaut Full Slave Shirts", price: "$74", image: "img/product/n1.jpg", rating: 5 },
            { brand: "Nike", name: "Black Shirts", price: "$65", image: "img/product/n2.jpg", rating: 4 },
            { brand: "Zara", name: "White Shirts", price: "$29", image: "img/product/n3.jpg", rating: 5 },
            { brand: "H&M", name: "Shirts", price: "$89", image: "img/product/n4.jpg", rating: 5 },
            { brand: "H&M", name: "Cargo Shirts", price: "$12", image: "img/product/n5.jpg", rating: 3 },
            { brand: "adidas", name: "Shorts", price: "$89", image: "img/product/n6.jpg", rating: 5 },
            { brand: "Nike", name: "Brown Shirts", price: "$78", image: "img/product/n7.jpg", rating: 5 },
            { brand: "H&M", name: "Half slave Shirt", price: "$56", image: "img/product/n8.jpg", rating: 4 }
        ];

        // Insert products into Trie
        products.forEach(product => {
            productTrie.insert(product.name, product);
            productTrie.insert(product.brand, product);
            
            const words = product.name.split(' ');
            words.forEach(word => {
                if (word.length > 2) {
                    productTrie.insert(word, product);
                }
            });
        });

        // DOM Elements
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        const dropdown = document.getElementById('autocompleteDropdown');
        const searchResultsSection = document.getElementById('search-results');
        const searchResultsGrid = document.getElementById('searchResultsGrid');
        const noSearchResults = document.getElementById('noSearchResults');

        // Autocomplete functionality
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            if (query.length === 0) {
                dropdown.classList.remove('show');
                return;
            }
            
            const results = productTrie.searchPrefix(query);
            const uniqueResults = getUniqueProducts(results);
            displayDropdownResults(uniqueResults);
        });

        // Search button click handler
        searchBtn.addEventListener('click', function() {
            performSearch();
        });

        // Enter key handler
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        function performSearch() {
            const query = searchInput.value.trim();
            
            if (query.length === 0) {
                return;
            }
            
            dropdown.classList.remove('show');
            
            const results = productTrie.searchPrefix(query);
            const uniqueResults = getUniqueProducts(results);
            
            displaySearchResults(uniqueResults, query);
        }

        function getUniqueProducts(results) {
            const uniqueResults = [];
            const seen = new Set();
            
            results.forEach(product => {
                const key = `${product.brand}-${product.name}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueResults.push(product);
                }
            });
            
            return uniqueResults;
        }

        function displayDropdownResults(results) {
            if (results.length === 0) {
                dropdown.innerHTML = '<div class="no-results">No products found</div>';
                dropdown.classList.add('show');
                return;
            }
            
            const limitedResults = results.slice(0, 8);
            
            dropdown.innerHTML = limitedResults.map(product => `
                <div class="autocomplete-item" data-product='${JSON.stringify(product)}'>
                    <div>
                        <span class="product-brand">${product.brand}</span>
                        <span class="product-name">${product.name}</span>
                    </div>
                    <span class="product-price">${product.price}</span>
                </div>
            `).join('');
            
            dropdown.classList.add('show');
            
            const items = dropdown.querySelectorAll('.autocomplete-item');
            items.forEach(item => {
                item.addEventListener('click', function() {
                    const productName = this.querySelector('.product-name').textContent;
                    searchInput.value = productName;
                    dropdown.classList.remove('show');
                    performSearch();
                });
            });
        }

        function displaySearchResults(results, query) {
            document.body.classList.add('search-active');
            searchResultsSection.classList.add('show');
            
            document.querySelector('.search-query').textContent = query;
            document.querySelector('.results-count').textContent = results.length;
            
            if (results.length === 0) {
                searchResultsGrid.style.display = 'none';
                noSearchResults.style.display = 'block';
                return;
            }
            
            searchResultsGrid.style.display = 'flex';
            noSearchResults.style.display = 'none';
            
            searchResultsGrid.innerHTML = results.map(product => `
                <div class="search-result-item">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x250?text=No+Image'">
                    <div class="des">
                        <span>${product.brand}</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            ${generateStars(product.rating)}
                        </div>
                        <h4>${product.price}</h4>
                    </div>
                </div>
            `).join('');
            
            // Scroll to search results
            searchResultsSection.scrollIntoView({ behavior: 'smooth' });
        }

        function generateStars(rating) {
            let stars = '';
            for (let i = 0; i < 5; i++) {
                if (i < rating) {
                    stars += '<i class="fas fa-star"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }

        function clearSearch() {
            searchInput.value = '';
            document.body.classList.remove('search-active');
            searchResultsSection.classList.remove('show');
            dropdown.classList.remove('show');
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && 
                !dropdown.contains(e.target) && 
                !searchBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Add clear search button to header (optional)
        searchInput.addEventListener('focus', function() {
            if (document.body.classList.contains('search-active')) {
                dropdown.classList.remove('show');
            }
        });
