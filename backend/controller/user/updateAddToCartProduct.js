const addToCartModel = require("../../models/cartProduct")

const updateAddToCartProduct = async(req,res) => {
    try {
        const currenUserId = req.userId
        const addToCartProductId = req?.body?._id
        const qty = req.body.quantity
        const updateProduct = await addToCartModel.updateOne({_id : addToCartProductId},{
            ...(qty && {quantity : qty}),
        })
        res.json({
            message : "Product Updated",
            data : updateProduct,
            success : true,
            error : false,
        })
    } catch (error) {
        res.json({
            message : error?.message || error,
            error : true,
            success : false,
        })
    }
}

module.exports = updateAddToCartProduct