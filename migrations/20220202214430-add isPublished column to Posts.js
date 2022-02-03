"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.addColumn("Posts", "isPublished", {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.removeColumn("Posts", "isPublished");
    }
};
