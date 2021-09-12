import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { ensuredAuthenticated } from './middleware';

const router = Router();

interface ProductDTO {
  name: string;
  description: string;
  price: number;
  id: string;
}

const products: ProductDTO[] = [];

router.get('/products/findByName', (req, res) => {
  const { name } = req.query;
  const product = products.filter((p) => p.name.includes(String(name)));
  return res.json(product);
});

router.get('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  return res.json(product);
});

router.post('/products', ensuredAuthenticated, (req, res) => {
  const { name, description, price } = req.body;

  const productsAlreadyExists = products.find((p) => p.name === name);

  if (productsAlreadyExists)
    return res.status(400).json({ message: 'Product Already exists' });

  const product: ProductDTO = {
    description,
    name,
    price,
    id: uuid(),
  };

  products.push(product);

  return res.json(product);
});

router.put('/products/:id', ensuredAuthenticated, (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1)
    return res.status(400).json({ message: `Product doesn't exists!` });

  const product: ProductDTO = Object.assign({
    id,
    name,
    description,
    price,
  });

  products[productIndex] = product;

  return res.json(product);
});

export { router };
