function formatNumber(number) {
    return Number(number).toLocaleString('en-US');
}

async function fetchData() {
    try {
        // Use the Vercel API route
        const response = await fetch('/api/data');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);

        const attributes = data.data.attributes;

        // Helper function to safely update DOM elements
        const updateElement = (id, value, defaultValue = 'N/A') => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || defaultValue;
            }
        };

        // Price and main stats
        if (attributes) {
            // Update price if available
            if (attributes.price_in_usd) {
                updateElement('price', `$${Number(attributes.price_in_usd).toFixed(8)}`);
            }

            // Price change with color
            const priceChangeElement = document.getElementById('price-change');
            if (priceChangeElement && attributes.price_percent_change) {
                const priceChange = attributes.price_percent_change;
                priceChangeElement.textContent = `${priceChange}`;
                
                // Reset classes first to ensure clean slate
                priceChangeElement.classList.remove('text-red-500', 'text-green-500');
                
                // Color coding based on price change
                if (parseFloat(priceChange) >= 0) {
                    priceChangeElement.classList.add('text-green-500');
                } else {
                    priceChangeElement.classList.add('text-red-500');
                }
            }

            // Update other metrics
            updateElement('volume', attributes.from_volume_in_usd ? `$${formatNumber(attributes.from_volume_in_usd)}` : 'N/A');
            updateElement('liquidity', attributes.reserve_in_usd ? `$${formatNumber(attributes.reserve_in_usd)}` : 'N/A');
            updateElement('marketcap', attributes.fully_diluted_valuation ? `$${formatNumber(attributes.fully_diluted_valuation)}` : 'N/A');

            // Trading activity (24h)
            if (attributes.historical_data && attributes.historical_data.last_24h) {
                const last24h = attributes.historical_data.last_24h;
                updateElement('transactions', formatNumber(last24h.swaps_count));
                updateElement('buyers', formatNumber(last24h.buyers_count));
                updateElement('sellers', formatNumber(last24h.sellers_count));
            } else {
                ['transactions', 'buyers', 'sellers'].forEach(id => {
                    updateElement(id, '0');
                });
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);

        // Show error state in UI but preserve price change if available
        const priceChange = document.getElementById('price-change').textContent;
        
        ['price', 'volume', 'liquidity', 'marketcap', 'transactions', 'buyers', 'sellers'].forEach(id => {
            updateElement(id, 'Error');
        });

        // Restore price change if it was available
        if (priceChange && priceChange !== 'Error') {
            document.getElementById('price-change').textContent = priceChange;
        }

        // Retry with a small delay
        setTimeout(fetchData, 5000);
    }
}

// Schedule the function to run every 60 seconds
setInterval(fetchData, 60000);

// Initial call to fetch data immediately
fetchData();
