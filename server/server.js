const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

const data = require('./Details.json');


app.get('/restaurants', (req, res) => {
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ error: 'Location is required' });
    }

    const filteredRestaurants = data.filter(
        (restaurant) => restaurant.location === location
    );

    res.json(filteredRestaurants);
});


app.get('/restaurants/categories', (req, res) => {
    const { location, categories } = req.query;
    if (!location || !categories) {
        return res.status(400).json({ error: 'Location and categories are required' });
    }

    const categoryList = categories.split(',');

    const filteredRestaurants = data.filter(
        (restaurant) => restaurant.location === location
    );

    const result = filteredRestaurants.map(restaurant => {
        const filteredProducts = restaurant.products.filter(product =>
            product.categories.some(category => categoryList.includes(category))
        );
        return {
            ...restaurant,
            products: filteredProducts
        };
    }).filter(restaurant => restaurant.products.length > 0);

    res.json(result);
});


app.get('/restaurants/top-rated', (req, res) => {

    const ratedRestaurants = data.map(restaurant => {
        const ratings = restaurant.products.map(product => product.rating);
        const averageRating =
            ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

        return {
            ...restaurant,
            averageRating: parseFloat(averageRating.toFixed(2))
        };
    });

    const sortedByHighest = ratedRestaurants.sort((a, b) => b.averageRating - a.averageRating);

    const top10 = sortedByHighest.slice(0, 10);

    const sortedAscending = [...top10].sort((a, b) => a.averageRating - b.averageRating);

    res.json(sortedAscending);
});

app.get('/explore/products', (req, res) => {
    const { categories, location } = req.query;

    let filteredProducts = data.flatMap(restaurant => restaurant.products);

    if (categories) {
        const categoriesArray = categories.split(',');
        filteredProducts = filteredProducts.filter(product =>
            product.categories.some(category => categoriesArray.includes(category))
        );
    }

    if (location) {
        filteredProducts = filteredProducts.filter(product =>
            data.some(restaurant => restaurant.location === location && restaurant.products.includes(product))
        );
    }

    res.json(filteredProducts);
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
