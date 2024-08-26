import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class User extends Model {
    public id!: string;
    public userKey!: string;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'User',
    }
);

export default User;
