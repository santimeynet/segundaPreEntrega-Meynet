import { Router } from "express";
import { Product } from "../dao/models/product.model.js";

const router = Router();

router.get("/", (req, res) => {
    res.render("home.handlebars")
})

router.get("/realtimeproducts", (req, res) => {
    res.render("product.handlebars")
})

router.get("/chat", (req, res) => {
    res.render("chat.handlebars");
});

router.get("/products",async (req, res)=>{
    const {page, limit} = req.query



    const productos = await Product.paginate({},
        {page: page || 1,
         limit:limit ||3,
        });
    res.render("productos", {
        productos
    })
})



export default router;