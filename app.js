const express = require('express');
const { PManager } = require('./ProductManager');
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = new PManager('./products.json');

app.get('/products', async (req, res) => {
  let { limit } = req.query;

  const prodaDevolver = await products.getProducts();

  if (!limit || limit > prodaDevolver.length) {
    res.status(200).json({
      status: 'ok',
      data: prodaDevolver,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: prodaDevolver.slice(0, limit),
    });
  }
});

app.get('/products/:id', async (req, res) => {
  const id = req.params.id * 1;

  const prodaDevolver = await products.getProductById(id);

  if (typeof prodaDevolver === 'string') {
    res.status(404).json({
      status: 'fail',
      data: prodaDevolver,
    });
  } else {
    res.status(200).json({
      status: 'ok',
      data: prodaDevolver,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});