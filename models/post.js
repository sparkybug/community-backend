'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.hasMany(models.Comment, { foreignKey: 'postId' });
    }
  }
  Post.init({
    image: DataTypes.STRING,
    content: DataTypes.STRING,
    category: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    upvotes: DataTypes.INTEGER,
    downvotes: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
