import sequelize from '../models';
import User from '../models/user';
import Chat from '../models/chat';
import Message from '../models/message';

async function seed() {
    try {
        // Sync database
        await sequelize.sync({ force: true }); // Be cautious with `force: true` as it will drop and recreate tables

        // Seed Users
        const user1 = await User.create({ id: 'user1', userKey: '39b155eb-6e26-4857-be9e-8020e625c3d5'});
        const user2 = await User.create({ id: 'user2', userKey: 'BobTestUserKey' });

        // Seed Chats
        const directChat = await Chat.create({ id: 'chat1', isDirect: true });
        const groupChat = await Chat.create({ id: 'chat2', isDirect: false });

        // Link users to chats
        await directChat.addUsers([user1, user2]); // Add users to direct chat
        await groupChat.addUsers([user1, user2]); // Add users to group chat

        // Seed Messages
        await Message.create({ chatId: 'chat1', senderId: 'user1', content: 'Hello Bob!' });
        await Message.create({ chatId: 'chat1', senderId: 'user2', content: 'Hi Alice!' });
        await Message.create({ chatId: 'chat2', senderId: 'user1', content: 'Welcome to the group chat!' });

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
