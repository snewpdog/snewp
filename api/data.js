const axios = require('axios');

module.exports = async (req, res) => {
    try {
        // Enable CORS
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');

        const apiUrl = 'https://app.geckoterminal.com/api/p1/solana/pools/2jRNkMgrNLEtNDfRrhhD6LicSkKkUgCd2MtfFTqDcNdZ?include=dex,dex.network.explorers,dex_link_services,network_link_services,pairs,token_link_services,tokens.token_security_metric,tokens.tags,pool_locked_liquidities&base_token=0&time_frame=24h';

        const response = await axios.get(apiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'Cache-Control': 'no-cache'
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Error fetching data' });
    }
};
