const router = require("express").Router();
const models = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
    const { category } = req.query;
    const queryObj = {};

    if (category) {
        queryObj.where = {
            category: {
                [Op.iLike]: category
            }
        };
    }

    const posts = await models.Post.findAll(queryObj);
    res.render("posts", { posts: posts });
});

router.get("/create", (req, res) => {
    res.render("newPost");
});

router.post("/create", async (req, res) => {
    const { title, body, category } = req.body;
    const post = models.Post.build({
        title,
        body,
        category
    });

    await post.save();
    res.redirect("/posts");
});

router.get("/:postId/edit", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const post = await models.Post.findOne({
        where: {
            id: postId
        }
    });

    if (!post) {
        return res.redirect("/posts");
    }

    res.render("editPost", { post: post });
});

router.post("/:postId/edit", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const { title, body, category } = req.body;
    await models.Post.update(
        {
            title,
            body,
            category
        },
        {
            where: {
                id: postId
            }
        }
    );

    res.redirect("/posts");
});

router.post("/:postId/delete", async (req, res) => {
    const postId = parseInt(req.params.postId);

    await models.Post.destroy({
        where: {
            id: postId
        }
    });

    res.redirect("/posts");
});

module.exports = router;
