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

        // Price and main stats
        document.getElementById('price').textContent = `$${Number(attributes.price_in_usd).toFixed(8)}`;

        // Price change with color
        const priceChange = attributes.price_percent_change;
        const priceChangeElement = document.getElementById('price-change');
        
        // Ensure the % sign is included and handle the color
        priceChangeElement.textContent = `${priceChange}`; 
        
        // Reset classes first to ensure clean slate
        priceChangeElement.classList.remove('text-red-500', 'text-green-500');
        
        // Color coding based on price change
        if (parseFloat(priceChange) >= 0) {
            priceChangeElement.classList.add('text-green-500');
        } else {
            priceChangeElement.classList.add('text-red-500');
        }

        document.getElementById('volume').textContent = `$${formatNumber(attributes.from_volume_in_usd)}`;
        document.getElementById('liquidity').textContent = `$${formatNumber(attributes.reserve_in_usd)}`;
        document.getElementById('marketcap').textContent = `$${formatNumber(attributes.fully_diluted_valuation)}`;

        // Trading activity (24h)
        if (attributes.historical_data && attributes.historical_data.last_24h) {
            const last24h = attributes.historical_data.last_24h;

            // Total transactions (swaps)
            document.getElementById('transactions').textContent = formatNumber(last24h.swaps_count);

            // Buyers
            document.getElementById('buyers').textContent = formatNumber(last24h.buyers_count);

            // Sellers
            document.getElementById('sellers').textContent = formatNumber(last24h.sellers_count);
        } else {
            console.log('No 24h historical data available');
            ['transactions', 'buyers', 'sellers'].forEach(id => {
                document.getElementById(id).textContent = '0';
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);

        // Show error state in UI
        ['price', 'volume', 'liquidity', 'marketcap', 'transactions', 'buyers', 'sellers'].forEach(id => {
            document.getElementById(id).textContent = 'Error';
        });

        // Retry with a small delay
        setTimeout(fetchData, 5000);
    }
}

// Schedule the function to run every 60 seconds
setInterval(fetchData, 60000);

// Initial call to fetch data immediately
fetchData();
