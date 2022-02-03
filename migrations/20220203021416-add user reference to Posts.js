"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.addColumn("Posts", "user_id", {
            type: Sequelize.INTEGER,
            references: { model: "Users", key: "id" }
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.removeColumn("Posts", "user_id");
    }
};
