module.exports = (sequelize, Sequelize) => {
  const division = sequelize.define("divisions", 
      {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
          },
          estate_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          code: {
            type: Sequelize.STRING(32),
            allowNull: false
          },
          description: {
            type: Sequelize.STRING(128),
            allowNull: false
          },
          image_url: {
            type: Sequelize.STRING(128),
            allowNull: false
          },
          color: {
            type: Sequelize.STRING(32),
            allowNull: false
          },
          lat: {
            type: Sequelize.FLOAT,
            allowNull: false
          },
          lng: {
            type: Sequelize.FLOAT,
            allowNull: false
          },
          status: {
            type: Sequelize.STRING(32),
            allowNull: false
          }
      }, 
      {
        freezeTableName: true,
        underscored: true
      }
  );

  return division;
};