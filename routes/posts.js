const router = require("express").Router();
const models = require("../models");
const { Op } = require("sequelize");

router.get("/", async (req, res) => {
    const { category } = req.query;
    const queryObj = {
        include: [
            {
                model: models.Comment,
                as: "comments"
            }
        ],
        order: [["createdAt", "DESC"]]
    };

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
    const post = await models.Post.findByPk(postId, {
        include: [
            {
                model: models.Comment,
                as: "comments"
            }
        ]
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

router.post("/:postId/add-comment", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const { title, body } = req.body;
    const comment = models.Comment.build({
        title,
        body,
        post_id: postId
    });

    await comment.save();
    res.redirect(`/posts#${postId}`);
});

router.post("/:postId/delete-comment/:commentId", async (req, res) => {
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    await models.Comment.destroy({
        where: {
            id: commentId
        }
    });

    res.redirect(`/posts#${postId}`);
});

module.exports = router;
