import { Router } from "express";
import ProductManager from '../managers/ProductManager.js';

const manager = new ProductManager();
const router = Router();

router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        let productsToSend = await manager.getProducts();

        if (limit) {
            const parsedLimit = parseInt(limit);
            if (!isNaN(parsedLimit)) {
                productsToSend = productsToSend.slice(0, parsedLimit);
            }
        }

        res.json(productsToSend);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:_id', async (req, res) => {
    try {
        const product_id = req.params._id;
        const product = await manager.getProductBy_id(product_id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el producto por _id:', error);
        res.status(500).json({ error: 'Error al obtener el producto por _id' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, status } = req.body;
        const newProduct = {
            title,
            description,
            price: Number(price), 
            thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails],
            code,
            stock: Number(stock), 
            status: status || true 
        };
        const product = await manager.addProduct(newProduct);

        if (product) {
            res.status(201).json(product);
        } else {
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    const productId = req.params.id;
    const updatedFields = req.body;

    try {
        const updatedProduct = await manager.updateProduct(productId, updatedFields);
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;