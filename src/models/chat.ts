import {
    DataTypes,
    Model,
    Association,
    InferAttributes,
    InferCreationAttributes,
    HasManyAddAssociationsMixin
} from 'sequelize';
import sequelize from './index';
import User from "./user";

class Chat extends Model<InferAttributes<Chat>, InferCreationAttributes<Chat>> {
    declare id: string;
    declare isDirect: boolean;

    declare users?: User[];

    declare static associations: {
        users: Association<Chat, User>;
    };

    declare addUsers: HasManyAddAssociationsMixin<User, number>;

}

Chat.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        isDirect: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Chat',
    }
);

Chat.belongsToMany(User, { through: 'ChatUsers', as: 'users' });
User.belongsToMany(Chat, { through: 'ChatUsers', as: 'chats' });

export default Chat;
