

// Function to encrypt a value
function encrypt(value) {
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

// Proxy for courses API with encrypted `url` field
app.get('/api/courses', async (req, res) => {
    try {
        const { page = 1, limit = 9, sortBy = 'sale_start', search = '' } = req.query;

        const response = await axios.get(`${BASE_URL}/courses`, {
            params: { page, limit, sortBy, search }
        });

        const encryptedItems = response.data.items.map(item => ({
            ...item,
            url: encrypt(item.url), // Encrypt the `url` field
        }));

        res.json({
            items: encryptedItems,
            totalItems: response.data.totalItems,
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages,
            itemsPerPage: response.data.itemsPerPage,
            sortBy: response.data.sortBy,
            sortOrder: response.data.sortOrder,
        });
    } catch (error) {
        console.error('Error fetching courses:', error.message);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Proxy for categories API
app.get('/api/categories', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/categories-with-subcategories`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Proxy for stores API
app.get('/api/stores', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/stores`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching stores:', error.message);
        res.status(500).json({ error: 'Failed to fetch stores' });
    }
});

// Proxy for languages API
app.get('/api/languages', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/distinct-languages`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching languages:', error.message);
        res.status(500).json({ error: 'Failed to fetch languages' });
    }
});

// Serve the index.html file for any other routes
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
