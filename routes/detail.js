const express = require('express');
const router = express.Router();
const data = require('../data/');
const getBusinessById = data.businesses.getBusinessById;
const getReviewsByBusiness = data.reviews.getReviewsByBusiness;
const getUserById = data.users.getSelectedUserById;


router.get('/:id', async(req, res) => {
    const entity = req.params.id;
    let business;
    let reviews;
    //let user;
    try {
        business = await getBusinessById(entity);
        reviews = await getReviewsByBusiness(entity);
        for (let rev of reviews) {
            const revuser = await getUserById(rev.userId);
            rev["username"] = revuser.username;
        }
        let phone = business.phone.toString();
        console.log(phone);
        console.log(typeof phone !== "string");
        console.log(phone.length < 13);
        console.log(phone.length > 9);
        if (phone && typeof phone == "string" && phone.length < 13 && phone.length > 9) {
            let newnum = phone.split("").slice(-10);
            newnum[0] = "(" + newnum[0];
            newnum[2] += ") ";
            newnum[5] += "-";
            newnum = newnum.join("");
            business.phone = newnum;
        } else {
            business.phone = "No phone number";
        }
    } catch (err) {
        res.status(404).render("detail/error", {error: err});
        console.log(err);
    }

    try {
        res.render("detail/detail", {business: business, reviews: reviews});
    } catch (err) {
        res.status(500).render("detail/error", {error: "There was an error on the server handling your request."})
    }

});

module.exports = router;