import { Router } from 'express';
import CartManager from '../CartManager.js';

const router = Router();
const cartManager = new CartManager('./carrito.json');

// Endpoint
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(parseInt(cid));

        if (cart) {
            res.status(200).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: 'Shopping cart not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", error: 'Error' });
    }
});

// Endpoint
router.post('/', async (req, res) => {
    try {
        const cart = await cartManager.addCart();
        res.status(201).send({ status: "success", payload: cart });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", error: 'Error al agregar el carrito' });
    }
});

// Endpoint
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartManager.addProductToCart(parseInt(cid), parseInt(pid));

        if (cart) {
            res.status(201).send({ status: "success", payload: cart });
        } else {
            res.status(404).send({ status: "error", error: 'Shopping cart or product not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: "error", error: 'Error adding product to shopping cart' });
    }
});

export default router;