import { Router } from "express";
import ProductManager from "../ProductManager.js";

const router = Router();
const productManager = new ProductManager('./productos.json');

// Endpoint
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            res.status(200).send({ status: "success", payload: limitedProducts });
        } else {
            res.status(200).send({ status: "success", payload: products });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", error: 'Error getting produdcts' });
    }
});

// Endpoint
router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(parseInt(pid));

        if (product) {
            res.status(200).send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", error: 'Producto not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", error: 'Error getting product' });
    }
});

// Endpoint
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        if (!product.title || !product.description || !product.price || !product.code || !product.stock || !product.category) {
            res.status(400).send({ status: "error", error: 'Fields incomplete' });
            return;
        }
        const b = await productManager.addProduct(product);
        if (b === -1) {
            res.status(400).send({ status: "error", error: 'Product code already exists' });
            return;
        }
        res.status(201).send({ status: "success", payload: b });
    } catch (err) {
        console.error(err);
        res.status(500)
            .send({ status: "error", error: 'Error adding product' });
    }
});

// Endpoint
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = req.body;
        const updatedProduct = await productManager.updateProduct(
            parseInt(pid),
            product
        );
        if (updatedProduct === -1) {
            res.status(404).send({ status: "error", error: 'Producto not found' });
            return;
        }
        res.status(201).send({ status: "success", payload: updatedProduct });
    } catch (err) {
        console.error(err);
        res.status(500)
            .send({ status: "error", error: 'Error while updating product' });
    }
});

// Endpoint
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productManager.deleteProduct(parseInt(pid));
        if (deletedProduct === -1) {
            res.status(404).send({ status: "error", error: 'Product not found' });
            return;
        }
        res.status(201).send({ status: "success", payload: deletedProduct });
    } catch (err) {
        console.error(err);
        res.status(500)
            .send({ status: "error", error: 'Error deleting product' });
    }
});

export default router;