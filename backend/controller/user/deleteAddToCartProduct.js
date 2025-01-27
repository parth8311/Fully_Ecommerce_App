const addToCartModel = require("../../models/cartProduct")

const deleteAddToCartProduct = async(req,res) => {
    try {
        const currentUserId = req.userId
        const addToCartProductId = req.body._id
        const deleteProduct = await addToCartModel.deleteOne({
            _id : addToCartProductId
        })
        res.json({
            message : "Product Deleted From Cart",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        res.json({
            message : error.message || error,
            success : false,
            error : true,
        })
    }
}

module.exports = deleteAddToCartProduct