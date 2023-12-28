import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

router.post("/", async (req, res) => {
    const newcid = manager.getNextCartcid();
    const products = req.body.products || [];

    const newCarrito = {
        cid: newcid,
        products: products
    };
    manager.saveNewCartToDisk(newCarrito);
    res.status(201).json(newCarrito);
});


router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    const result = manager.addProductToCart(parseInt(cid), parseInt(pid));

    if (!result.success) {
        return res.status(400).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
});
router.get("/:cid", (req, res) => {
    const { cid } = req.params;
    const cart = manager.getCartByCid(parseInt(cid));

    if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
    }
    const productsInCart = manager.getProductsByCartId(parseInt(cid));

    res.status(200).json({ cart, products: productsInCart });
});

export default router;
