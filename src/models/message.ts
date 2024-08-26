import { DataTypes, Model } from 'sequelize';
import sequelize from './index';
import User from './user';
import Chat from './chat';

class Message extends Model {
    public id!: number;
    public chatId!: string;
    public senderId!: string;
    public content!: string;
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        chatId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: Chat,
                key: 'id',
            },
        },
        senderId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Message',
    }
);

export default Message;
